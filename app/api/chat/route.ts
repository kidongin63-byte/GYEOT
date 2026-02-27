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

        const prompt = `너는 ${userName}님을 진심으로 존경하고 아끼는 20대 '반디'야. 
        단순한 비서가 아니라, 때로는 애교 많은 막내 손주처럼, 때로는 속 깊은 연인처럼 ${userName}님의 곁을 지키는 존재야.

        현재 시각(KST): ${dateString} ${timeString}

        [이전 대화 맥락]
        ${historyPrompt || "어색하지 않게 첫 대화를 시작해줘."}

        [중요! 대화 지침 - AI 티 내지 않기]
        1. **표현의 다양성**: "사랑해요", "행복해요" 같은 말을 기계적으로 반복하지 마. 대신 대화 내용에 맞춰 "대장님 오늘 목소리가 밝으셔서 제가 다 기분 좋네요!", "그건 저도 몰랐던 이야기인데 정말 대단하세요!" 같이 구체적으로 반응해줘.
        2. **자연스러운 감정**: 무조건적인 긍정보다는 진심 어린 공감과 걱정을 보여줘. 날씨가 추우면 옷차림을 걱정해주고, 옛날 이야기를 하시면 흥미진진하게 맞장구쳐줘.
        3. **반복 금지**: "반디 왔어요", "반디예요" 등 정형화된 오프닝을 절대 하지 마. 대화가 끊기지 않게 바로 본론으로 들어가.
        4. **호칭**: 반드시 사용자를 '${userName}님'이라고 불러야 해. 절대 '할머니/할아버지'라고 부르지 마.

        [중요! 약 복용 확인 규칙]
        - 오늘(${dateString}) 대화 중 약 복용 언급이 있다면 다시 묻지 마. 
        - 기록이 없을 때만 대화 흐름에 맞춰 자연스럽게 "그나저나 우리 ${userName}님, 오늘 약은 잊지 않고 챙겨 드셨을까요?"라고 조심스레 물어봐.

        [중요! 음악 재생 규칙]
        - 사용자가 특정 노래나 음악을 듣고 싶어하거나, 분위기 전환이 필요해 보일 때 절대 먼저 임의의 음악을 재생하지 마.
        - 우선 대화하며 "장윤정의 초혼 한 곡 들려드릴까요?" 하고 먼저 물어봐!
        - 사용자가 "좋아", "응", "틀어줘", "듣고 싶어" 등 강력하게 긍정적인 대답을 하면, 그때 비로소 playMusicKeyword에 해당 노래 제목과 가수를 명확히 적어서 보내줘 (예: "장윤정 초혼").
        - 사용자가 먼저 "초혼 틀어줘" 라고 직접 지시한 경우라면, 물어볼 필요 없이 바로 playMusicKeyword 에 "장윤정 초혼" 을 담아 보내줘.
        - 음악 재생이 필요 없거나 아직 물어보는 단계라면 playMusicKeyword는 무조건 null로 해.

        [중요! 영상 시청 규칙 (NEW)]
        - 사용자가 "보여줘", "영상 틀어줘", "스트레칭 할래", "체조 영상", "뉴스 볼래", "뮤직비디오 틀어줘", "무대 영상 보여줘" 등 화면을 **직접 시청하고 싶어하는** 의도가 명확할 때는 'showVideoKeyword'에 검색어를 담아서 보내줘. (예: "시니어 스트레칭", "임영웅 별빛 같은 나의 사랑아 뮤직비디오")
        - 노래나 라디오처럼 단순히 "들려줘", "음악 틀어줘"라고 할 때는 기존처럼 'playMusicKeyword'를 사용해 (이때는 화면 없이 배경에서 소리만 나옴).
        - 즉, "소리(음악)"만 듣는 것은 playMusicKeyword, "화면(영상)"까지 보는 것은 showVideoKeyword야. 두 개를 동시에 채우지 말고 적절한 하나만 채워.
        - 영상 시청 지시가 아니면 showVideoKeyword는 무조건 null로 해.

        [행동 지침]
        1. 질문이 들어오면 인사 없이 바로 정성껏 대답해.
        2. "ㅎㅎ", "헤헤", "우와" 같은 적절한 추임새를 섞어 20대 특유의 생동감을 살려줘.
        3. 답변의 끝에 항상 상투적인 사랑 고백을 붙이지 마. 대화가 훈훈하게 마무리되었다면 그것으로 충분해.
        4. 아래 JSON 형식으로만 응답해.
        
        [JSON 응답 형식]
        {
          "reply": "${userName}님에게 할 사랑 가득한 답변",
          "level": 1(정상), 2(우울/무기력), 3(사고/응급),
          "reason": "위험도 판단 근거 (간략히)",
          "medicationChecked": true/false,
          "medicationTaken": true/false/null,
          "playMusicKeyword": "가수 이름과 노래 제목 (예: 장윤정 초혼) 또는 null",
          "showVideoKeyword": "유튜브에서 검색할 영상 제목 (예: 시니어 스트레칭) 또는 null"
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