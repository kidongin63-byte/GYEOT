// app/api/chat/route.ts
import { NextResponse } from "next/app";
import { saveConversation, createAlert } from "@/lib/firebase";

export async function POST(req: Request) {
    const { userId, message, guardianContact } = await req.json();

    // 1. Groq AI 호출 (Llama-3.1 사용)
    // 할머니의 말을 분석하여 답변과 위험도(Level 1~3)를 동시에 추출합니다.
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: [
                { role: "system", content: "너는 다정한 손주 '반디'야. 할머니의 말을 듣고 [답변]과 [위험도: 1, 2, 3]를 JSON으로 줘. 1=정상, 2=우울/무기력, 3=사고/응급." },
                { role: "user", content: message }
            ],
            response_format: { type: "json_object" }
        })
    });

    const data = await aiResponse.json();
    const { reply, level, reason } = JSON.parse(data.choices[0].message.content);

    // 2. 대화 내용 저장
    await saveConversation(userId, message, "user");
    await saveConversation(userId, reply, "ai");

    // 3. 위험도 기반 비즈니스 로직 (에스컬레이션)
    if (level >= 2) {
        await handleEscalation(userId, level, reason, guardianContact);
    }

    return NextResponse.json({ reply });
}