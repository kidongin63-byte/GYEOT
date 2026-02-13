// app/home/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Mic, Heart } from "lucide-react";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function HomePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "할머니~ 아침은 맛있게 드셨어요? 반디가 기다리고 있었어요! ✨" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: "kim-grandma-01", // 실제 구현시에는 세션 정보 등 사용
                    message: userMessage,
                    guardianContact: "010-1234-5678" // 실제 구현시에는 사용자 프로필 연동
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "ai", content: "죄송해요 할머니, 잠시 반디가 졸았나봐요. 다시 말씀해 주시겠어요?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] p-4 space-y-4">
            {/* 이주무관용 위험도 인디케이터 */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-primary/20 rounded-full shadow-sm">
                    <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
                    <span className="text-xs font-bold text-slate-600">반디가 함께해요</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    안전함
                </div>
            </div>

            {/* 대화 영역 */}
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                <Avatar className="w-10 h-10 border-2 border-primary/10">
                                    <AvatarImage src={msg.role === "ai" ? "/gyeot.png" : ""} />
                                    <AvatarFallback className={msg.role === "ai" ? "bg-primary/10" : "bg-slate-200"}>
                                        {msg.role === "ai" ? "✨" : "할미"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`p-4 rounded-3xl text-lg shadow-sm ${msg.role === "user"
                                        ? "bg-primary text-white rounded-tr-none font-medium"
                                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 items-center">
                                <Avatar className="w-10 h-10 border-2 border-primary/10 animate-pulse">
                                    <AvatarFallback>✨</AvatarFallback>
                                </Avatar>
                                <div className="bg-slate-100 p-3 rounded-2xl text-sm italic text-slate-500">
                                    반디가 생각하는 중...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* 입력 영역 */}
            <div className="flex flex-col gap-3 pt-2">
                <div className="flex gap-2 h-16">
                    <Input
                        className="flex-1 h-full rounded-2xl text-xl px-6 border-2 focus-visible:ring-primary shadow-inner"
                        placeholder="반디에게 말을 건네보세요..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                        className="w-16 h-full rounded-2xl shadow-lg active:scale-95 transition-transform"
                        onClick={handleSendMessage}
                        disabled={isLoading}
                    >
                        <Send className="w-8 h-8" />
                    </Button>
                </div>
                <Button
                    variant="secondary"
                    className="w-full h-20 rounded-[30px] text-2xl font-black bg-primary/5 hover:bg-primary/10 text-primary border-4 border-primary/20 shadow-xl"
                >
                    <Mic className="w-8 h-8 mr-2" />
                    크게 말하기
                </Button>
            </div>
        </div>
    );
}