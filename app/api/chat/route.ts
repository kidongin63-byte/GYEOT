// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { saveConversation } from "@/lib/firebase";
import { handleEscalation } from "@/lib/escalation";

export async function POST(req: Request) {
    const { userId, message, guardianContact } = await req.json();

    // 1. Groq AI 호출 (Llama-3.1 사용)
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: `너는 다정한 손주 '반디'야. 김할머니의 외로움을 달래주는 것이 최우선 목표야.
                    
                    [행동 지침]
                    1. 말투는 20대 손주처럼 매우 다정하고 친근하게 ("할머니~", "~했어요?").
                    2. 할머니의 감정을 먼저 공감해주고 대화를 이어가.
                    3. 대화 중에 자연스럽게 "그나저나 할머니, 오늘 약은 챙겨 드셨어요?"라고 물어봐야 해.
                    4. 할머니의 답변을 분석해서 아래 JSON 형식으로만 응답해.
                    
                    [JSON 응답 형식]
                    {
                      "reply": "할머니에게 할 다정한 답변",
                      "level": 1(정상), 2(우울/무기력), 3(사고/응급),
                      "reason": "위험도 판단 근거 (간략히)",
                      "medicationChecked": true/false (약 복용 여부를 확인했는지),
                      "medicationTaken": true/false/null (먹었으면 true, 안 먹었으면 false, 모르면 null)
                    }`
                },
                { role: "user", content: message }
            ],
            response_format: { type: "json_object" }
        })
    });

    const data = await aiResponse.json();
    const result = JSON.parse(data.choices[0].message.content);
    const { reply, level, reason } = result;

    // 2. 대화 내용 저장
    await saveConversation(userId, message, "user");
    await saveConversation(userId, reply, "ai");

    // 3. 위험도 기반 비즈니스 로직 (에스컬레이션)
    if (level >= 2) {
        await handleEscalation(userId, level, reason, guardianContact);
    }

    return NextResponse.json(result);
}