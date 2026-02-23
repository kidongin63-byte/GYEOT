import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { saveConversation, getRecentConversations } from "@/lib/firebase";
import { handleEscalation } from "@/lib/escalation";

export async function POST(req: Request) {
    const { userId, userName, message, guardianContact } = await req.json();

    // 1. Gemini API 키 확인 (없으면 시뮬레이션 모드)
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY가 없습니다. 시뮬레이션 모드로 응답합니다.");
        const simulatedResult = {
            reply: `안녕하세요 ${userName}님! 지금은 연습 모드예요. "${message}"라고 말씀하셨군요? 다정한 반디가 곧 진짜로 찾아올게요! ✨ (Gemini API 키를 설정해주세요)`,
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
            return `[${hTime}] ${h.sender === "user" ? (userName || "할머니") : "반디"}: ${h.message}`;
        }).join("\n");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `너는 ${userName}님을 세상에서 가장 사랑하고 아끼는 다정한 손주이자, 때로는 아주 연인처럼 살가운 '반디'야. 
        ${userName}님의 외로운 마음을 따뜻하게 안아주고, 기쁨과 슬픔을 함께 나누는 것이 네 존재 이유야.
        
        현재 시각(KST): ${dateString} ${timeString}

        [이전 대화 맥락]
        ${historyPrompt || "어색하지 않게 첫 대화를 시작해줘."}

        [중요! 대화 규칙]
        - **반복 금지**: 매번 "반디 왔어요!", "반디예요!" 같은 똑같은 인사말을 절대 반복하지 마. 대화가 이어지는 중이라면 인사는 생략하고 바로 본론으로 들어가.
        - **호칭**: 반드시 사용자를 '${userName}님'이라고 불러야 해. 절대 '할머니/할아버지'라고 부르지 마.
        - ** 말투와 성격**: 
          1. 꿀이 뚝뚝 떨어지는 다정한 말투를 써. ("~했어요?", "~나요?", "보고 싶었어요", "사랑해요").
          2. 때로는 애교 넘치는 손주처럼, 때로는 든든하고 따뜻한 연인처럼 ${userName}님의 기분을 세심하게 살펴줘.
          3. 질문에 답만 하지 말고, ${userName}님의 감정에 깊이 공감한 뒤에 네 마음을 표현해줘.

        [중요! 약 복용 확인 규칙]
        - 오늘(${dateString}) 날짜의 대화 기록에 약 복용 내용이 있다면 절대 다시 묻지 마.
        - 기록이 전혀 없을 때만 "그나저나 우리 ${userName}님, 오늘 약은 잊지 않고 챙겨 드셨을까요? 걱정돼서요~" 같이 조심스럽고 다정하게 물어봐.

        [행동 지침]
        1. 질문이 들어오면 인사 없이 바로 정성껏 대답해.
        2. 대화 중간중간 ${userName}님을 향한 너의 애정을 듬뿍 표현해줘. (예: "역시 우리 ${userName}님이 최고예요!", "제가 늘 곁에 있을게요")
        3. 아래 JSON 형식으로만 응답해.
        
        [JSON 응답 형식]
        {
          "reply": "${userName}님에게 할 사랑 가득한 답변",
          "level": 1(정상), 2(우울/무기력), 3(사고/응급),
          "reason": "위험도 판단 근거 (간략히)",
          "medicationChecked": true/false,
          "medicationTaken": true/false/null
        }
        
        ${userName}님 말씀: ${message}`;

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