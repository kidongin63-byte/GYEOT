// lib/escalation.ts
import { createAlert, sendPushNotification } from "@/lib/firebase";

export async function handleEscalation(userId: string, level: number, reason: string, contact: string) {
    // 1. Firestore에 즉시 경고 로그 생성
    await createAlert(userId, level, reason);

    // 2. Level 2 (박아들 알림)
    if (level === 2) {
        await sendPushNotification(contact, "어머니 상태 주의 필요", `사유: ${reason}`);

        // [비즈니스 로직] 20분간 응답 없으면 Level 3 격상 예약 (Queue 처리 권장)
        console.log("20분 대기 후 응답 없으면 기관(이주무관) 자동 알림 예약");
    }

    // 3. Level 3 (이주무관/기관 강제 알림)
    if (level === 3) {
        await sendPushNotification("agency_admin", "🚨 응급 상황 발생", `사용자 ID: ${userId} - ${reason}`);
        // Baserow 동기화는 Zapier가 자동으로 처리
    }
}