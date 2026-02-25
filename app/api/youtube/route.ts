import { NextResponse } from "next/server";
import youtubeSearchApi from "youtube-search-api";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    try {
        const result = await youtubeSearchApi.GetListByKeyword(q, false, 1);
        if (result && result.items && result.items.length > 0) {
            // Find the first video (type 'video')
            const video = result.items.find((item: any) => item.type === 'video');
            const videoId = video ? video.id : result.items[0].id;
            return NextResponse.json({ videoId });
        } else {
            return NextResponse.json({ error: "No video found" }, { status: 404 });
        }
    } catch (error) {
        console.error("YouTube search error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
