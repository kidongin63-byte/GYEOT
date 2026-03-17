import { NextResponse } from "next/server";
import youtubeSearchApi from "youtube-search-api";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: "검색어가 필요합니다." }, { status: 400 });
    }

    try {
        // 옵션 없이 검색하여 더 넓은 결과를 가져옴 (필터가 가끔 오류를 유발)
        const result = await youtubeSearchApi.GetListByKeyword(query, false, 5);

        if (!result || !result.items || result.items.length === 0) {
            return NextResponse.json({ error: "검색된 결과가 없습니다." }, { status: 404 });
        }

        // 'video' 타입인 첫 번째 항목을 찾거나, 타입이 없더라도 첫 번째 항목 사용
        const videoItem = result.items.find((item: any) => item.type === "video") || result.items[0];
        const videoId = typeof videoItem === 'string' ? videoItem : videoItem?.id;

        if (videoId) {
            return NextResponse.json({ videoId });
        } else {
            return NextResponse.json({ error: "검색된 비디오가 없습니다." }, { status: 404 });
        }
    } catch (error: any) {
        console.error("YouTube API Error:", error);
        return NextResponse.json({ error: "유튜브 검색 중 오류가 발생했습니다." }, { status: 500 });
    }
}
