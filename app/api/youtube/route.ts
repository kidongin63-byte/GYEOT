import { NextResponse } from "next/server";
import youtubesearchapi from "youtube-search-api";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    try {
        // GetListByKeyword(keywords, playlist, limit, options)
        const results = await youtubesearchapi.GetListByKeyword(query, false, 1, [{ type: "video" }]);
        
        if (results.items && results.items.length > 0) {
            const videoId = results.items[0].id;
            return NextResponse.json({ videoId });
        } else {
            return NextResponse.json({ error: "No videos found" }, { status: 404 });
        }
    } catch (error: any) {
        console.error("YouTube Search Error:", error);
        return NextResponse.json({ error: error.message || "Failed to search YouTube" }, { status: 500 });
    }
}
