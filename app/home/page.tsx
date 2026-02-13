// app/home/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, Keyboard, Heart, Sparkles, MessageCircle, BarChart3, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function HomePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "할머니~ 저 반디예요! 오늘 기분은 좀 어떠세요? ✨" }
    ]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async (text?: string) => {
        const messageToSend = text || input;
        if (!messageToSend.trim() || isLoading) return;

        setInput("");
        setShowKeyboard(false);
        setIsListening(false);
        setMessages(prev => [...prev, { role: "user", content: messageToSend }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "kim-grandma-01",
                    message: messageToSend,
                    guardianContact: "010-1234-5678"
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "ai", content: "아이구 할머니, 잠시 반디가 졸았나봐요. 다시 말씀해 주시겠어요?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoice = () => {
        setIsListening(!isListening);
    };

    return (
        <div className="flex flex-col h-full bg-[#FDFCF8] relative overflow-hidden">
            {/* 상단 상태바 (간소화) */}
            <header className="p-4 flex justify-between items-center bg-white/60 backdrop-blur-md z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
                    <span className="text-xs font-bold text-primary">반디 서비스 중</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-black border border-green-200">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    안전
                </div>
            </header>

            {/* 대화 영역 (초대형 폰터) */}
            <ScrollArea className="flex-1 px-4 py-4 hide-scrollbar">
                <div className="space-y-8 max-w-lg mx-auto pb-40">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                            <div className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                <Avatar className={cn(
                                    "w-12 h-12 border-2 shadow-sm",
                                    msg.role === "ai" ? "border-primary/20 animate-float" : "border-slate-100"
                                )}>
                                    <AvatarImage src={msg.role === "ai" ? "/gyeot.png" : ""} />
                                    <AvatarFallback className={msg.role === "ai" ? "bg-primary/10" : "bg-slate-200"}>
                                        {msg.role === "ai" ? <Sparkles className="w-6 h-6 text-primary" /> : <span className="text-lg font-bold">나</span>}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={cn(
                                    "p-4 rounded-[32px] text-xl md:text-2xl font-bold leading-tight shadow-lg max-w-[85%]",
                                    msg.role === "user"
                                        ? "bg-primary text-white rounded-br-none"
                                        : "bg-white text-slate-800 rounded-tl-none border-2 border-primary/5"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-4 animate-pulse opacity-70">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div className="bg-slate-100 p-4 rounded-3xl text-lg font-bold text-slate-500">
                                반디가 생각 중...
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* 하단 컨트롤 레이어 (입력 및 내비게이션 통합) */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* 1. 입력 영역 (Pulsing Mic) */}
                <div className="px-6 py-6 bg-gradient-to-t from-white via-white to-transparent">
                    {showKeyboard ? (
                        <div className="flex gap-4 items-center bg-white p-2 rounded-full shadow-2xl border-2 border-primary/10 animate-in slide-in-from-bottom-2">
                            <input
                                autoFocus
                                className="flex-1 h-16 bg-transparent px-6 text-xl font-bold outline-none"
                                placeholder="글을 남겨보세요..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button
                                className="w-14 h-14 rounded-full"
                                onClick={() => handleSendMessage()}
                            >
                                <Send className="w-6 h-6" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                {isListening && (
                                    <>
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
                                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse scale-125" />
                                    </>
                                )}
                                <Button
                                    size="lg"
                                    className={cn(
                                        "w-36 h-36 rounded-full shadow-[0_15px_40px_rgba(var(--primary),0.3)] transition-all duration-500 relative z-30",
                                        isListening ? "bg-red-500 ring-8 ring-red-100 scale-90" : "bg-primary hover:scale-105 active:scale-95"
                                    )}
                                    onClick={toggleVoice}
                                >
                                    {isListening ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-1 bg-white rounded-full animate-pulse mb-2" />
                                            <span className="text-xl font-black">듣는 중</span>
                                        </div>
                                    ) : (
                                        <Mic className="w-20 h-20 text-white" />
                                    )}
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                className="text-slate-400 text-sm font-bold flex items-center gap-2 h-10 hover:bg-transparent"
                                onClick={() => setShowKeyboard(true)}
                            >
                                <Keyboard className="w-4 h-4" />
                                글자로 쓰기
                            </Button>
                        </div>
                    )}
                </div>

                {/* 2. 네이티브 하단 내비게이션 바 */}
                <nav className="flex justify-around items-center h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 pb-2">
                    <button
                        onClick={() => setActiveTab("home")}
                        className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === "home" ? "text-primary" : "text-slate-400")}
                    >
                        <MessageCircle className={cn("w-6 h-6", activeTab === "home" && "fill-primary/20")} />
                        <span className="text-[10px] font-black uppercase">대화하기</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("report")}
                        className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === "report" ? "text-primary" : "text-slate-400")}
                    >
                        <BarChart3 className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase">리포트</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("emergency")}
                        className={cn("flex flex-col items-center gap-1 transition-colors", activeTab === "emergency" ? "text-red-500" : "text-slate-400")}
                    >
                        <AlertCircle className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">긴급호출</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}