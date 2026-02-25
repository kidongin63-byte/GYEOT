// lib/reporting.ts
import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

/**
 * 박아들용 '오늘의 곁 리포트' 생성 함수
 * 하루 동안의 대화 기록을 요약하여 할머니의 상태를 안심할 수 있게 리포트합니다.
 */
export async function generateDailyReport(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
        collection(db, "conversations"),
        where("userId", "==", userId),
        where("timestamp", ">=", today),
        orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => doc.data());

    if (conversations.length === 0) {
        return {
            summary: "오늘 대화 기록이 아직 없어요. 할머니께 먼저 말을 건네보라고 반디에게 시켜볼까요?",
            mood: "조용함",
            activities: [],
            status: "normal"
        };
    }

    // [비즈니스 로직] 실제로는 여기서 Groq AI를 한 번 더 호출하여 요약본을 만듭니다.
    // 여기서는 간단한 하드코딩 예시를 반환합니다.
    return {
        summary: "오늘 할머니는 총 7번 웃으셨고, 산책 이야기에 아주 즐거워하셨어요. 아침 약도 잘 챙겨 드셨답니다!",
        mood: "즐거움",
        activities: ["아침 식사 대화", "오후 산책 계획", "약 복용 확인"],
        status: "safe",
        timestamp: new Date().toISOString()
    };
}
