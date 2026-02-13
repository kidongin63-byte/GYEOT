// app/home/page.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <div className="p-6 space-y-10 flex flex-col items-center">
            {/* 이주무관용 위험도 인디케이터 */}
            <div className="w-full flex justify-end">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
                    <div className="w-3 h-3 bg-safe rounded-full animate-pulse" />
                    안전함
                </div>
            </div>

            {/* AI 캐릭터 영역 */}
            <div className="relative">
                <div className="w-64 h-64 bg-primary/10 rounded-full flex items-center justify-center animate-bounce duration-[3000ms] infinite">
                    <span className="text-9xl">✨</span>
                </div>
                <div className="absolute -bottom-4 bg-white px-6 py-2 rounded-2xl shadow-md border border-primary/20">
                    <p className="text-lg font-bold">반디가 기다리고 있어요</p>
                </div>
            </div>

            {/* 메인 동작 버튼 */}
            <div className="w-full space-y-4 pt-10">
                <p className="text-center text-2xl font-bold mb-4">오늘 기분이 어떠세요?</p>
                <Button className="w-full h-32 text-4xl font-black rounded-[40px] shadow-xl hover:scale-95 transition-transform bg-primary">
                    말하기
                </Button>
            </div>

            {/* 박아들용 간편 리포트 카드 */}
            <Card className="w-full p-4 grid grid-cols-2 gap-4 border-none bg-slate-100/50">
                <div className="text-center border-r">
                    <p className="text-xs text-slate-500 uppercase">최근 활동</p>
                    <p className="text-lg font-bold">1시간 전</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase">오늘 걸음</p>
                    <p className="text-lg font-bold text-primary">1,250보</p>
                </div>
            </Card>
        </div>
    );
}