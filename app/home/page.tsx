// app/home/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Mic, Send, Keyboard, Heart, Sparkles, MessageCircle,
    BarChart3, AlertCircle, Phone, MapPin, Pill, Activity, Settings, X, Volume2
} from "lucide-react";
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

        // 로컬 설정 불러오기
        const savedFont = localStorage.getItem("bandi-font");
        const savedVoice = localStorage.getItem("bandi-voice");
        if (savedFont) setSelectedFont(savedFont);
        if (savedVoice) setSelectedVoice(parseInt(savedVoice));
    }, []);

    const speak = (text: string) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        // 이전 발화 중지
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (voices[selectedVoice]) {
            utterance.voice = voices[selectedVoice];
        }
        utterance.lang = "ko-KR";
        utterance.rate = 0.9; // 어르신들을 위해 조금 천천히
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (scrollRef.current && activeTab === "home") {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, activeTab]);

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
            speak(data.reply); // 반디의 답변을 목소리로 읽어줍니다
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
        if (!SpeechRecognition) {
            alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
            return;
        }

        if (isListening) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "ko-KR";
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            handleSendMessage(transcript);
        };

        recognition.onerror = (event: any) => {
            if (event.error === "no-speech") {
                // 무음 발생 시 조용히 종료
                console.log("STT: No speech detected.");
            } else {
                console.error("STT Error:", event.error);
                alert("음성 인식 오류: " + event.error);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
        } catch (error) {
            console.error("STT Start Error:", error);
            setIsListening(false);
        }
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#FDFCF8] relative overflow-hidden transition-all duration-500", selectedFont)}>
            {/* 상단 상태바 */}
            <header className="p-4 flex justify-between items-center bg-white/60 backdrop-blur-md z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
                    <span className="text-xs font-bold text-primary">반디 서비스 중</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-black border border-green-200">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        {activeTab === "emergency" ? "응급 대기" : "안전"}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-10 h-10 text-slate-400"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <Settings className="w-6 h-6" />
                    </Button>
                </div>
            </header>

            {/* 설정 모달 */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 bg-primary/5 flex justify-between items-center border-b border-primary/10">
                            <h2 className="text-2xl font-black text-primary flex items-center gap-2">
                                <Settings className="w-6 h-6" />
                                반디 설정하기
                            </h2>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsSettingsOpen(false)}>
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] hide-scrollbar">
                            {/* 목소리 설정 */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
                                    <Volume2 className="w-5 h-5" />
                                    반디의 목소리 선택
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {voices.slice(0, 6).map((voice, idx) => (
                                        <Button
                                            key={idx}
                                            variant={selectedVoice === idx ? "default" : "outline"}
                                            className={cn(
                                                "h-14 rounded-2xl font-bold transition-all",
                                                selectedVoice === idx ? "bg-primary shadow-lg scale-105" : "hover:border-primary/50"
                                            )}
                                            onClick={() => {
                                                setSelectedVoice(idx);
                                                localStorage.setItem("bandi-voice", idx.toString());
                                                // 즉시 테스트 발화
                                                const testMsg = "반디 목소리예요!";
                                                const utterance = new SpeechSynthesisUtterance(testMsg);
                                                utterance.voice = voices[idx];
                                                window.speechSynthesis.cancel();
                                                window.speechSynthesis.speak(utterance);
                                            }}
                                        >
                                            {voice.name.includes("Male") ? "👦 남성 " : "👧 여성 "}
                                            소리 {idx + 1}
                                        </Button>
                                    ))}
                                    {voices.length === 0 && (
                                        <p className="col-span-2 text-sm text-slate-400 text-center font-bold">목소리를 불러오는 중입니다...</p>
                                    )}
                                </div>
                            </section>

                            {/* 글씨체 설정 */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    글씨 모양 선택
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { id: "font-nanum-gothic", name: "표준 정석체 (나눔고딕)", class: "font-nanum-gothic" },
                                        { id: "font-nanum-myeongjo", name: "인자한 명조체 (나눔명조)", class: "font-nanum-myeongjo" },
                                        { id: "font-black-han-sans", name: "진하고 굵은체 (블랙한산스)", class: "font-black-han-sans" },
                                        { id: "font-gowun-batang", name: "부드러운 바탕체 (고운바탕)", class: "font-gowun-batang" },
                                        { id: "font-nanum-pen", name: "다정한 손글씨 (나눔펜)", class: "font-nanum-pen" }
                                    ].map((font) => (
                                        <Button
                                            key={font.id}
                                            variant={selectedFont === font.id ? "default" : "outline"}
                                            className={cn(
                                                "w-full h-16 rounded-2xl text-xl font-bold justify-start px-6",
                                                font.class,
                                                selectedFont === font.id ? "bg-primary shadow-lg border-transparent" : "hover:bg-slate-50"
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

                        <div className="p-6 bg-slate-50 text-center">
                            <Button className="w-full h-16 rounded-2xl text-xl font-black bg-slate-800" onClick={() => setIsSettingsOpen(false)}>
                                설정 완료
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === "home" && (
                    <ScrollArea className="h-full px-4 py-4 hide-scrollbar">
                        <div className="space-y-8 max-w-lg mx-auto pb-64">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                        <Avatar className={cn(
                                            "w-[70px] h-[70px] border-2 shadow-sm animate-float",
                                            msg.role === "ai" ? "border-primary/20" : "border-slate-100"
                                        )}>
                                            <AvatarImage src={msg.role === "ai" ? "/gyeot.png" : ""} />
                                            <AvatarFallback className={msg.role === "ai" ? "bg-primary/10" : "bg-slate-200"}>
                                                {msg.role === "ai" ? <Sparkles className="w-6 h-6 text-primary" /> : <span className="text-lg font-bold">나</span>}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className={cn(
                                            "p-4 rounded-[32px] text-xl md:text-2xl font-bold leading-tight shadow-lg max-w-[85%] px-[20px] py-[10px]",
                                            msg.role === "user"
                                                ? "bg-primary !text-primary-foreground rounded-br-none"
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
                )}

                {activeTab === "report" && (
                    <ScrollArea className="h-full px-6 py-8 hide-scrollbar">
                        <div className="max-w-md mx-auto space-y-8 pb-32 font-bold text-slate-800">
                            <h2 className="text-3xl font-black">오늘의 곁 리포트 📋</h2>

                            <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-primary/5 space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Sparkles className="w-6 h-6" />
                                    <span className="text-xl">반디의 요약</span>
                                </div>
                                <p className="text-2xl leading-relaxed text-slate-700">
                                    "할머니, 오늘 기분도 좋으시고 약도 잘 챙겨 드셨네요! 산책 다녀오신 것도 정말 잘하셨어요. 대화도 많이 해서 반디가 기뻐요."
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-6 rounded-[32px] border-2 border-blue-100 flex flex-col items-center gap-2">
                                    <Activity className="w-8 h-8 text-blue-500" />
                                    <span className="text-slate-500 text-sm">활동량</span>
                                    <span className="text-2xl text-blue-700 font-black">충분함</span>
                                </div>
                                <div className="bg-green-50 p-6 rounded-[32px] border-2 border-green-100 flex flex-col items-center gap-2">
                                    <Pill className="w-8 h-8 text-green-500" />
                                    <span className="text-slate-500 text-sm">약 복용</span>
                                    <span className="text-2xl text-green-700 font-black">완료</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[32px] shadow-lg border border-slate-100 italic font-medium">
                                <h3 className="text-xl mb-4 text-slate-600 font-black not-italic">오늘의 대화 패턴</h3>
                                <div className="flex items-end gap-2 h-32 px-4 shadow-inner bg-slate-50 rounded-2xl pt-4">
                                    {[30, 60, 45, 90, 70, 40, 80].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-slate-400 px-2 font-bold">
                                    <span>오전</span><span>정오</span><span>오후</span>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                )}

                {activeTab === "emergency" && (
                    <div className="h-full px-6 py-12 flex flex-col items-center space-y-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-4xl font-black text-red-600 animate-pulse">도움이 필요하신가요?</h2>
                            <p className="text-xl font-bold text-slate-500 italic">아래 버튼을 3초간 꾹 눌러주세요</p>
                        </div>

                        <button className="w-64 h-64 bg-red-500 rounded-full shadow-[0_30px_60px_rgba(239,68,68,0.4)] border-[15px] border-red-100 active:scale-90 transition-transform flex flex-col items-center justify-center gap-2 group">
                            <AlertCircle className="w-24 h-24 text-white group-active:animate-ping" />
                            <span className="text-3xl font-black text-white">긴급출동</span>
                        </button>

                        <div className="w-full max-w-sm space-y-4">
                            <div className="bg-white p-5 rounded-3xl shadow-md border-2 border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold">보호자 (박아들)</p>
                                        <p className="text-xl font-black text-slate-700">010-1234-5678</p>
                                    </div>
                                </div>
                                <Button size="sm" className="rounded-full bg-blue-500 font-black">전화</Button>
                            </div>

                            <div className="bg-white p-5 rounded-3xl shadow-md border-2 border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold">내 위치 확인</p>
                                        <p className="text-lg font-black text-slate-700">집 (서울 종로구)</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="rounded-full font-black">지도</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 컨트롤 레이어 (입력 및 내비게이션 통합) */}
            <div className="my-[15px]">
                {activeTab === "home" && (
                    <div className="px-6 py-6 mb-[10px] bg-gradient-to-t from-white via-white to-transparent">
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
                                <Button className="w-14 h-14 rounded-full" onClick={() => handleSendMessage()}>
                                    <Send className="w-6 h-6" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-around items-center max-w-[200px] mx-auto">
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
                                            "w-28 h-28 rounded-full shadow-[0_15px_40px_rgba(var(--primary),0.3)] transition-all duration-500 relative z-30",
                                            isListening ? "bg-red-500 ring-8 ring-red-100 scale-90" : "bg-primary hover:scale-105 active:scale-95"
                                        )}
                                        onClick={toggleVoice}
                                    >
                                        {isListening ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-1 bg-white rounded-full animate-pulse mb-2" />
                                                <span className="text-lg font-black text-white">듣는 중</span>
                                            </div>
                                        ) : (
                                            <Mic className="w-16 h-16 text-white" />
                                        )}
                                    </Button>
                                </div>
                                <Button
                                    variant="outline"
                                    className="h-28 px-8 rounded-[32px] border-2 border-slate-100 flex flex-col items-center justify-center gap-2 bg-white/50 hover:bg-white shadow-sm transition-all"
                                    onClick={() => setShowKeyboard(true)}
                                >
                                    <Keyboard className="w-8 h-8 text-slate-400" />
                                    <span className="text-lg font-black text-slate-600 leading-none text-center">글자로<br />쓰기</span>
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* 네이티브 하단 내비게이션 바 */}
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