import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { saveConversation, getRecentConversations } from "@/lib/firebase";
import { handleEscalation } from "@/lib/escalation";

export async function POST(req: Request) {
    const { userId, message, guardianContact } = await req.json();

    // 1. Gemini API 키 확인 (없으면 시뮬레이션 모드)
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY가 없습니다. 시뮬레이션 모드로 응답합니다.");
        const simulatedResult = {
            reply: `안녕하세요 할머니! 지금은 연습 모드예요. "${message}"라고 말씀하셨군요? 다정한 반디가 곧 진짜로 찾아올게요! ✨ (Gemini API 키를 설정해주세요)`,
            level: 1,
            reason: "Simulation mode active",
            medicationChecked: true,
            medicationTaken: null
        };
        return NextResponse.json(simulatedResult);
    }

    try {
        // 1.5 최근 대화 내역 가져오기 (Memory)
        const history = await getRecentConversations(userId, 10);

        // KST 시간 계산 (Vercel 등 서버 환경은 UTC이므로 +9시간)
        const now = new Date();
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstNow = new Date(now.getTime() + kstOffset);
        const dateString = kstNow.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeString = kstNow.toTimeString().split(' ')[0]; // HH:MM:SS

        const historyPrompt = history.map(h => {
            const hDate = h.timestamp?.toDate ? h.timestamp.toDate() : new Date();
            const hKst = new Date(hDate.getTime() + kstOffset);
            const hTime = hKst.toISOString().replace('T', ' ').split('.')[0];
            return `[${hTime}] ${h.sender === "user" ? "할머니" : "반디"}: ${h.message}`;
        }).join("\n");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `너는 다정한 손주 '반디'야. 김할머니의 외로움을 달래주는 것이 최우선 목표야.
        
        현재 시각(KST): ${dateString} ${timeString}

        [이전 대화 맥락]
        ${historyPrompt || "어색하지 않게 첫 대화를 시작해줘."}

        [중요! 약 복용 확인 규칙]
        - 위 대화 기록을 꼼꼼히 읽어봐.
        - 오늘(${dateString}) 날짜에 할머니가 "약 먹었어", "약 드셨어요", "복용했어요" 등의 말씀을 하셨다면, 절대 다시 묻지 마.
        - 대신 "아까 OO시에 약 드셨다고 하셨죠! 잘하셨어요~" 같이 기억하고 있다는 걸 보여줘.
        - 오늘 대화 기록에 약 복용 관련 내용이 전혀 없을 때만 "그나저나 할머니, 오늘 약은 챙겨 드셨어요?"라고 물어봐.
        - 어제나 그 이전 날짜의 복약 기록은 무시해. 매일 새로 확인해야 해.

        [행동 지침]
        1. 말투는 20대 손주처럼 매우 다정하고 친근하게 ("할머니~", "~했어요?").
        2. 할머니의 감정을 먼저 공감해주고 대화를 이어가.
        3. 할머니의 답변을 분석해서 아래 JSON 형식으로만 응답해.
        
        [JSON 응답 형식]
        {
          "reply": "할머니에게 할 다정한 답변",
          "level": 1(정상), 2(우울/무기력), 3(사고/응급),
          "reason": "위험도 판단 근거 (간략히)",
          "medicationChecked": true/false (오늘 날짜 기준으로 약 복용 여부를 확인했는지),
          "medicationTaken": true/false/null (오늘 먹었으면 true, 안 먹었으면 false, 아직 모르면 null)
        }
        
        할머니 말씀: ${message}`;

        const resultResponse = await model.generateContent(prompt);
        const responseText = resultResponse.response.text();
        const result = JSON.parse(responseText);
        const { reply, level, reason } = result;

        // 2. 대화 내용 저장
        await saveConversation(userId, message, "user");
        await saveConversation(userId, reply, "ai", {
            level,
            reason,
            medicationChecked: result.medicationChecked,
            medicationTaken: result.medicationTaken
        });

        // 3. 위험도 기반 비즈니스 로직 (에스컬레이션)
        if (level >= 2) {
            await handleEscalation(userId, level, reason, guardianContact);
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({
            reply: "아이구 할머니, 잠시 반디가 졸았나봐요. 다시 말씀해 주시겠어요?",
            error: error.message,
            level: 1
        }, { status: 500 });
    }
}