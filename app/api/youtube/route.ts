import { NextResponse } from "next/server";
import youtubeSearchApi from "youtube-search-api";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: "검색어가 필요합니다." }, { status: 400 });
    }

    try {
        const result = await youtubeSearchApi.GetListByKeyword(query, false, 5, [{ type: "video" }]);

        // 검색 결과 중 type이 'video'인 첫 번째 항목만 추출
        const videoItem = result.items.find((item: any) => item.type === "video");
        const videoId = videoItem?.id;

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
