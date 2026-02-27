import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: "검색어가 필요합니다." }, { status: 400 });
    }

    try {
        // 실제 운영 시에는 Google Places API, Kakao Map API 등을 연동합니다.
        // 현재는 시뮬레이션 데이터를 반환하여 UI 흐름을 확인합니다.

        console.log(`[Place Search Requested] Query: ${query}`);

        // 검색어에 따른 맞춤형 가짜 데이터 생성
        let items = [
            {
                id: "place-01",
                name: `${query} 관련 추천 장소`,
                address: "바다님 근처 가장 가까운 곳",
                mapUrl: `https://www.google.com/maps/search/${encodeURIComponent(query)}`,
                mapEmbedUrl: `https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=${encodeURIComponent(query)}`, // 임시 URL (API 키 필요 시 설정)
                category: "추천"
            }
        ];

        // 병원 관련 검색일 경우 태그 추가
        if (query.includes("병원") || query.includes("약국") || query.includes("의원")) {
            items[0].category = "의료";
        } else if (query.includes("맛집") || query.includes("식당")) {
            items[0].category = "음식";
        }

        return NextResponse.json({ items });
    } catch (error: any) {
        console.error("Place Search API Error:", error);
        return NextResponse.json({ error: "장소 검색 중 오류가 발생했습니다." }, { status: 500 });
    }
}
