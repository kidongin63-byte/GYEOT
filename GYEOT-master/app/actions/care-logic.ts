// app/actions/care-logic.ts
"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// 오늘의 곁 리포트 생성 (박아들용 카드 데이터)
export async function generateDailyReport(userId: string) {
    const q = query(collection(db, "conversations"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    // 오늘 대화 내용 요약 (AI 활용 가능)
    const conversationCount = snapshot.size;
    return {
        summary: "오늘 어머니는 총 " + conversationCount + "번 반디와 대화하셨어요. 기분은 전반적으로 밝으셨습니다.",
        status: "safe",
        steps: 1250 // 실제 센서 데이터 연동 시
    };
}

// 음성 약 복용 체크 로직
export function checkMedication(message: string) {
    const keywords = ["약 먹었니", "혈압약", "깜빡", "먹었다"];
    if (keywords.some(k => message.includes(k))) {
        return "어머님, 약 챙겨드신 거 맞죠? 참 잘하셨어요!";
    }
    return null;
}