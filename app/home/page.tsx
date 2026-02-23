// app/home/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
    Mic, Send, Keyboard, Heart, Sparkles, MessageCircle, Pencil,
    BarChart3, AlertCircle, Phone, MapPin, Pill, Activity, Settings, X, Volume2, ChevronRight, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "ai";
    content: string;
}

const MemoView = ({ setHomeView, setInput, input }: { setHomeView: (view: "dashboard" | "chat" | "memo") => void, setInput: (val: string) => void, input: string }) => (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom-20 duration-500">
        <header className="p-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
            <Button
                variant="ghost"
                className="flex items-center gap-1 px-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                onClick={() => setHomeView("dashboard")}
            >
                <ChevronLeft className="w-6 h-6" />
                <span className="font-bold text-lg">이전</span>
            </Button>
            <div className="text-slate-800 font-black text-xl">메모 남기기</div>
            <Button
                variant="ghost"
                className="text-brand-purple font-black text-lg"
                onClick={() => {
                    setHomeView("dashboard");
                    setInput("");
                }}
            >
                완료
            </Button>
        </header>

        <div className="flex-1 p-8 flex flex-col space-y-6">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Pencil className="w-6 h-6" />
                <span className="font-bold text-lg">현재 나를 메모해보세요</span>
            </div>
            <textarea
                autoFocus
                className="w-full flex-1 bg-slate-50/50 rounded-[32px] p-8 text-2xl font-bold border-2 border-dashed border-slate-200 outline-none focus:border-brand-purple/30 focus:bg-white transition-all resize-none leading-relaxed placeholder:text-slate-300"
                placeholder="여기에 내용을 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>

        <div className="p-8 pb-12 shrink-0">
            <Button
                onClick={() => {
                    setHomeView("dashboard");
                    setInput("");
                }}
                className="w-full h-18 rounded-full bg-brand-purple text-white text-2xl font-black shadow-lg shadow-brand-purple/20"
            >
                저장하고 돌아가기
            </Button>
        </div>
    </div>
);

const DashboardView = ({ setHomeView, setActiveTab, toggleVoice, setIsSettingsOpen }: { setHomeView: (view: "dashboard" | "chat" | "memo") => void, setActiveTab: (tab: string) => void, toggleVoice: () => void, setIsSettingsOpen: (open: boolean) => void }) => (
    <div className="flex flex-col h-full bg-[#FAFAFA] text-slate-800 animate-in fade-in duration-500">
        <header className="p-6 flex justify-center items-center bg-transparent shrink-0">
            <div className="text-slate-400 font-bold text-lg">곁이 함께하고 있어요</div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-start pt-4 px-8 text-center overflow-y-auto hide-scrollbar">
            <div className="relative mb-10 mt-2">
                <div className="absolute inset-0 bg-brand-purple/10 rounded-full animate-pulse-ring" style={{ animationDelay: '0s' }} />
                <div className="absolute inset-0 bg-brand-purple/10 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-brand-purple/10 rounded-full animate-pulse-ring" style={{ animationDelay: '2s' }} />

                <div className="relative w-44 h-44 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner border border-white/50">
                    <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-45 overflow-hidden">
                        <div className="transform -rotate-45 flex items-center justify-center p-3">
                            <Image src="/gyeot-logo.svg" alt="Logo" width={90} height={90} className="object-contain" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <h2 className="text-[28px] md:text-[32px] font-black leading-tight tracking-tight">
                    지금 상태가<br />평소와 조금 다른 것 같아요
                </h2>
                <p className="text-[17px] text-slate-400 font-medium leading-relaxed">
                    잠시 호흡을 가다듬고<br />
                    상태를 확인해보는 건 어떨까요?
                </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-brand-purple/10 text-brand-purple rounded-full text-[13px] font-black tracking-widest uppercase mb-12">
                <div className="w-4.5 h-4.5 bg-brand-purple rounded-md flex items-center justify-center shadow-sm shadow-brand-purple/30">
                    <BarChart3 className="w-3 h-3 text-white" />
                </div>
                LIVE ANALYSIS
            </div>
        </div>

        <div className="dashboard-card bg-white p-10 pb-14 shadow-[0_-15px_40px_rgba(0,0,0,0.04)] animate-in slide-in-from-bottom-12 duration-700 shrink-0">
            <div className="max-w-[340px] mx-auto w-full space-y-12">
                <Button
                    onClick={() => setHomeView("chat")}
                    className="w-full h-20 rounded-[32px] bg-brand-purple hover:bg-brand-purple/95 text-white text-3xl font-black flex items-center justify-center gap-5 shadow-[0_12px_24px_rgba(161,99,241,0.25)] transition-all hover:scale-[1.02] active:scale-95"
                >
                    <MessageCircle className="w-8 h-8 fill-white/20" />
                    대화하기
                </Button>

                <div className="grid grid-cols-2 gap-7">
                    <Button
                        variant="secondary"
                        onClick={toggleVoice}
                        className="h-18 rounded-[28px] bg-blue-50/70 hover:bg-blue-100 text-blue-700 font-black text-xl border border-blue-100/50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Mic className="w-6 h-6 text-blue-500" />
                        음성/말하기
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setActiveTab("report")}
                        className="h-18 rounded-[28px] bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 font-black text-xl border border-emerald-100/50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <BarChart3 className="w-6 h-6 text-emerald-500" />
                        리포트
                    </Button>
                </div>

                <button
                    onClick={() => setHomeView("memo")}
                    className="w-full relative group transition-all active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-brand-purple/5 blur-xl group-hover:bg-brand-purple/10 transition-all rounded-[32px]" />
                    <div className="relative flex items-center justify-between bg-slate-50/80 p-5 rounded-[32px] border-2 border-dashed border-slate-200/80 group-hover:border-brand-purple/40 group-hover:bg-white transition-all shadow-inner">
                        <span className="text-xl font-bold text-slate-400 ml-2">글쓰기 메모 남기기...</span>
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                            <Pencil className="w-6 h-6" />
                        </div>
                    </div>
                </button>

                <div className="pt-2 flex items-center gap-3">
                    <Button
                        onClick={() => setActiveTab("emergency")}
                        className="flex-1 h-18 rounded-full bg-[#FFF5F5] hover:bg-red-100/50 text-[#FF4D4D] text-2xl font-black flex items-center justify-center gap-4 border border-red-100/30 shadow-sm transition-all active:scale-95"
                    >
                        <Sparkles className="w-7 h-7 fill-[#FF4D4D]/10" />
                        긴급호출
                    </Button>
                    <Button
                        onClick={() => setIsSettingsOpen(true)}
                        variant="secondary"
                        className="w-18 h-18 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 border border-slate-100 flex items-center justify-center transition-all active:scale-95"
                    >
                        <Settings className="w-8 h-8" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
);

const ChatView = ({ messages, input, setInput, handleSendMessage, toggleVoice, setHomeView, isListening, isLoading, scrollRef, userName }: { messages: Message[], input: string, setInput: (val: string) => void, handleSendMessage: (text?: string) => void, toggleVoice: () => void, setHomeView: (view: "dashboard" | "chat" | "memo") => void, isListening: boolean, isLoading: boolean, scrollRef: React.RefObject<HTMLDivElement | null>, userName: string }) => (
    <div className="flex flex-col h-full bg-[#FDFCF8] animate-in slide-in-from-right-10 duration-500">
        <header className="p-4 flex justify-between items-center bg-white/60 backdrop-blur-md z-10 border-b border-slate-100">
            <Button
                variant="ghost"
                className="flex items-center gap-1 px-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                onClick={() => setHomeView("dashboard")}
            >
                <ChevronLeft className="w-6 h-6" />
                <span className="font-bold text-lg">이전</span>
            </Button>
            <div className="font-bold text-slate-700">반디와 대화</div>
            <div className="w-16" />
        </header>

        <ScrollArea className="flex-1 px-3 py-3 hide-scrollbar">
            <div className="space-y-8 max-w-[380px] mx-auto pb-16 px-1">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <Avatar className={cn(
                                "border-none shadow-none shrink-0",
                                msg.role === "ai" ? "!w-[70px] !h-[70px] bg-transparent" : "!w-12 !h-12 bg-transparent"
                            )}>
                                <AvatarImage src={msg.role === "ai" ? "/gyeot-logo.svg" : ""} className="object-contain" />
                                <AvatarFallback className={cn(
                                    "rounded-full border-2",
                                    msg.role === "ai" ? "bg-brand-purple/5 border-transparent" : "bg-green-50 border-green-200"
                                )}>
                                    {msg.role === "ai" ? (
                                        <Sparkles className="w-6 h-6 text-brand-purple" />
                                    ) : (
                                        <span className={cn(
                                            "font-black text-green-700",
                                            userName.length > 2 ? "text-xs px-1" : "text-sm"
                                        )}>
                                            {userName}
                                        </span>
                                    )}
                                </AvatarFallback>
                            </Avatar>

                            <div className={cn(
                                "p-4 px-5 rounded-2xl font-bold leading-snug shadow-sm w-fit",
                                msg.role === "user"
                                    ? "bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] rounded-br-none text-[18px] max-w-[calc(100%-60px)]"
                                    : "bg-white text-slate-800 rounded-tl-none border border-slate-50 text-[18px] max-w-[calc(100%-85px)]"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 animate-pulse opacity-70 mt-1">
                        <div className="w-5 h-5 bg-brand-purple/5 rounded-full flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5 text-brand-purple" />
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl text-[13px] font-bold text-slate-400">
                            반디가 생각 중...
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>

        <div className="p-3 pb-8 bg-white border-t border-slate-100">
            <div className="flex gap-2 items-center bg-slate-100/50 p-1 rounded-full border border-slate-200 focus-within:bg-white focus-within:border-brand-purple/30 transition-all z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoice}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0",
                        isListening ? "bg-red-500 text-white animate-pulse" : "bg-white text-brand-purple shadow-sm"
                    )}
                >
                    <Mic className="w-4 h-4" />
                </Button>
                <input
                    autoFocus
                    className="flex-1 h-10 bg-transparent px-2 text-[15px] font-bold outline-none text-slate-800 min-w-0"
                    placeholder="메시지를 입력하세요..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <Button
                    size="icon"
                    className="w-10 h-10 rounded-full bg-brand-purple hover:bg-brand-purple/90 shrink-0 transition-all active:scale-95 shadow-md flex items-center justify-center"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    disabled={!input.trim() || isLoading}
                >
                    <Send className="w-4 h-4 text-white" />
                </Button>
            </div>
        </div>
    </div>
);


export default function HomePage() {
    const [userName, setUserName] = useState("대장");
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: `${userName}님~ 저 반디예요! 오늘 기분은 좀 어떠세요? ✨` }
    ]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const [homeView, setHomeView] = useState<"dashboard" | "chat" | "memo">("dashboard");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedFont, setSelectedFont] = useState("font-nanum-gothic");
    const [selectedVoice, setSelectedVoice] = useState<number>(0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // TTS 설정
    useEffect(() => {
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const korVoices = allVoices.filter(v => v.lang.includes("ko"));
            setVoices(korVoices);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        const savedFont = localStorage.getItem("bandi-font");
        const savedVoice = localStorage.getItem("bandi-voice");
        const savedName = localStorage.getItem("bandi-user-name");
        if (savedFont) setSelectedFont(savedFont);
        if (savedVoice) setSelectedVoice(parseInt(savedVoice));
        if (savedName) {
            setUserName(savedName);
            setMessages([{ role: "ai", content: `${savedName}님~ 저 반디예요! 오늘 기분은 좀 어떠세요? ✨` }]);
        }
    }, []);

    const speak = (text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        if (voices[selectedVoice]) utterance.voice = voices[selectedVoice];
        utterance.lang = "ko-KR";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (scrollRef.current && activeTab === "home" && homeView === "chat") {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeTab, homeView]);

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
                    userName: userName,
                    message: messageToSend,
                    guardianContact: "010-1234-5678"
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
            speak(data.reply);
        } catch (error) {
            const errorMsg = "아이구 할머니, 잠시 반디가 졸았나봐요. 다시 말씀해 주시겠어요?";
            setMessages(prev => [...prev, { role: "ai", content: errorMsg }]);
            speak(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoice = () => {
        if (typeof window === "undefined") return;
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        if (isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "ko-KR";
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => handleSendMessage(event.results[0][0].transcript);
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        recognitionRef.current = recognition;
    };



    return (
        <div className={cn("flex flex-col h-[100dvh] bg-white relative overflow-hidden transition-all duration-500", selectedFont)}>
            <div className="flex-1 overflow-hidden relative">
                {activeTab === "home" && (
                    homeView === "dashboard" ? <DashboardView
                        setHomeView={setHomeView}
                        setActiveTab={setActiveTab}
                        toggleVoice={toggleVoice}
                        setIsSettingsOpen={setIsSettingsOpen}
                    /> :
                        homeView === "chat" ? <ChatView
                            messages={messages}
                            input={input}
                            setInput={setInput}
                            handleSendMessage={handleSendMessage}
                            toggleVoice={toggleVoice}
                            setHomeView={setHomeView}
                            isListening={isListening}
                            isLoading={isLoading}
                            scrollRef={scrollRef}
                            userName={userName}
                        /> :
                            <MemoView
                                setHomeView={setHomeView}
                                setInput={setInput}
                                input={input}
                            />
                )}

                {activeTab === "report" && (
                    <ScrollArea className="h-full px-4 py-6 hide-scrollbar bg-[#FAFAFA]">
                        <div className="max-w-md mx-auto space-y-8 pb-32">
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 px-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                                    onClick={() => { setActiveTab("home"); setHomeView("dashboard"); }}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                    <span className="font-bold text-lg">이전</span>
                                </Button>
                                <h2 className="text-2xl font-black text-slate-800">곁 리포트</h2>
                                <div className="w-16" />
                            </div>

                            <div className="bg-white p-8 rounded-[40px] shadow-xl border-2 border-brand-purple/5 space-y-4">
                                <div className="flex items-center gap-3 text-brand-purple">
                                    <Sparkles className="w-6 h-6" />
                                    <span className="text-xl font-black">반디의 요약</span>
                                </div>
                                <p className="text-2xl font-bold leading-relaxed text-slate-700">
                                    "할머니, 오늘 기분도 좋으시고 약도 잘 챙겨 드셨네요! 산책 다녀오신 것도 정말 잘하셨어요. 대화도 많이 해서 반디가 기뻐요."
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center gap-2">
                                    <Activity className="w-8 h-8 text-blue-500" />
                                    <span className="text-slate-500 text-sm font-bold">활동량</span>
                                    <span className="text-2xl text-slate-800 font-black">충분함</span>
                                </div>
                                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center gap-2">
                                    <Pill className="w-8 h-8 text-green-500" />
                                    <span className="text-slate-500 text-sm font-bold">약 복용</span>
                                    <span className="text-2xl text-slate-800 font-black">완료</span>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[32px] shadow-lg border border-slate-100">
                                <h3 className="text-xl mb-6 text-slate-800 font-black">오늘의 대화 패턴</h3>
                                <div className="flex items-end gap-3 h-32 px-4 shadow-inner bg-slate-50/50 rounded-2xl pt-4">
                                    {[30, 60, 45, 90, 70, 40, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-brand-purple/40 hover:bg-brand-purple rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-xs text-slate-400 px-2 font-bold uppercase tracking-wider">
                                    <span>오전</span><span>정오</span><span>오후</span>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                )}

                {activeTab === "emergency" && (
                    <div className="h-full px-6 py-8 flex flex-col items-center space-y-12 bg-white animate-in slide-in-from-bottom-20 duration-500">
                        <header className="w-full flex justify-between items-center bg-transparent mb-4">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-1 px-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                                onClick={() => { setActiveTab("home"); setHomeView("dashboard"); }}
                            >
                                <ChevronLeft className="w-6 h-6" />
                                <span className="font-bold text-lg">이전</span>
                            </Button>
                            <div className="font-bold text-slate-700 text-lg">긴급 상황</div>
                            <div className="w-16" />
                        </header>
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black text-red-600 animate-pulse">도움이 필요하신가요?</h2>
                            <p className="text-xl font-bold text-slate-400">아래 버튼을 3초간 꾹 눌러주세요</p>
                        </div>

                        <button className="w-72 h-72 bg-red-500 rounded-full shadow-[0_30px_60px_rgba(239,68,68,0.3)] border-[15px] border-red-50 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 group-active:animate-none" />
                            <AlertCircle className="w-24 h-24 text-white" />
                            <span className="text-3xl font-black text-white">긴급출동</span>
                        </button>

                        <div className="w-full max-w-sm space-y-4">
                            <div className="bg-slate-50 p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                                        <Phone className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-black uppercase tracking-wider">보호자 (박아들)</p>
                                        <p className="text-xl font-black text-slate-700">010-1234-5678</p>
                                    </div>
                                </div>
                                <Button size="icon" className="rounded-full bg-blue-500 w-12 h-12 shadow-lg shadow-blue-500/20">
                                    <Phone className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-red-500">
                                        <MapPin className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-black uppercase tracking-wider">내 위치 확인</p>
                                        <p className="text-lg font-black text-slate-700">집 (서울 종로구)</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="outline" className="rounded-full w-12 h-12 bg-white shadow-sm">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <div className="p-8 bg-brand-purple/5 flex justify-between items-center border-b border-brand-purple/10">
                            <h2 className="text-2xl font-black text-brand-purple flex items-center gap-3">
                                <Settings className="w-7 h-7 animate-spin-slow" />
                                반디 설정
                            </h2>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white transition-colors" onClick={() => setIsSettingsOpen(false)}>
                                <X className="w-7 h-7 text-slate-400" />
                            </Button>
                        </div>

                        <div className="p-8 space-y-10 overflow-y-auto max-h-[60vh] hide-scrollbar">
                            <section className="space-y-6">
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <Heart className="w-6 h-6 text-brand-purple" />
                                    나의 호칭 설정
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-slate-400 px-1">
                                        반디가 저를 뭐라고 부르면 좋을까요?
                                    </p>
                                    <input
                                        type="text"
                                        className="w-full h-16 rounded-3xl bg-slate-50 px-6 text-xl font-black border-2 border-slate-100 focus:border-brand-purple/30 focus:bg-white outline-none transition-all"
                                        placeholder="호칭을 입력하세요 (예: 대장, 할머니)"
                                        value={userName}
                                        onChange={(e) => {
                                            const newName = e.target.value.slice(0, 10);
                                            setUserName(newName);
                                            localStorage.setItem("bandi-user-name", newName);
                                        }}
                                    />
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <Volume2 className="w-6 h-6 text-brand-purple" />
                                    반디 목소리
                                </h3>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-black text-pink-500 px-1">
                                            <div className="w-2 h-2 rounded-full bg-pink-500" />
                                            여성 목소리
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[0, 1, 2].map((idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={selectedVoice === idx ? "default" : "outline"}
                                                    className={cn(
                                                        "h-14 rounded-2xl font-black text-md transition-all border-2",
                                                        selectedVoice === idx
                                                            ? "bg-brand-purple border-brand-purple shadow-lg text-white scale-105"
                                                            : "bg-white border-slate-100 text-slate-400 hover:border-brand-purple/30"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedVoice(idx);
                                                        localStorage.setItem("bandi-voice", idx.toString());
                                                        const testMsg = "반디 여성 목소리예요!";
                                                        const utterance = new SpeechSynthesisUtterance(testMsg);
                                                        if (voices[idx]) utterance.voice = voices[idx];
                                                        window.speechSynthesis.cancel();
                                                        window.speechSynthesis.speak(utterance);
                                                    }}
                                                >
                                                    여성 {idx + 1}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-black text-blue-500 px-1">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            남성 목소리
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[3, 4, 5].map((idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={selectedVoice === idx ? "default" : "outline"}
                                                    className={cn(
                                                        "h-14 rounded-2xl font-black text-md transition-all border-2",
                                                        selectedVoice === idx
                                                            ? "bg-brand-purple border-brand-purple shadow-lg text-white scale-105"
                                                            : "bg-white border-slate-100 text-slate-400 hover:border-brand-purple/30"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedVoice(idx);
                                                        localStorage.setItem("bandi-voice", idx.toString());
                                                        const testMsg = "반디 남성 목소리예요!";
                                                        const utterance = new SpeechSynthesisUtterance(testMsg);
                                                        if (voices[idx]) utterance.voice = voices[idx];
                                                        window.speechSynthesis.cancel();
                                                        window.speechSynthesis.speak(utterance);
                                                    }}
                                                >
                                                    남성 {idx - 2}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-brand-purple" />
                                    글씨 모양
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { id: "font-nanum-gothic", name: "표준 나눔고딕", class: "font-nanum-gothic" },
                                        { id: "font-nanum-myeongjo", name: "인자한 명조체", class: "font-nanum-myeongjo" },
                                        { id: "font-black-han-sans", name: "진한 블랙체", class: "font-black-han-sans" },
                                        { id: "font-gowun-batang", name: "부드러운 고운바탕", class: "font-gowun-batang" }
                                    ].map((font) => (
                                        <Button
                                            key={font.id}
                                            variant={selectedFont === font.id ? "default" : "outline"}
                                            className={cn(
                                                "w-full h-16 rounded-3xl text-xl font-black justify-start px-8 border-2 transition-all",
                                                font.class,
                                                selectedFont === font.id
                                                    ? "bg-slate-800 border-slate-800 text-white shadow-xl"
                                                    : "bg-white border-slate-100 hover:border-brand-purple/30 text-slate-600"
                                            )}
                                            onClick={() => {
                                                setSelectedFont(font.id);
                                                localStorage.setItem("bandi-font", font.id);
                                            }}
                                        >
                                            {font.name}
                                        </Button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            <Button className="w-full h-18 rounded-3xl text-xl font-black bg-brand-purple hover:bg-brand-purple/90 shadow-xl shadow-brand-purple/20" onClick={() => setIsSettingsOpen(false)}>
                                설정 완료
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}