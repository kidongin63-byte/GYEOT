// app/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const steps = [
    { title: "환영해요!", desc: "저는 할머니의 건강을 지켜드리는 '곁'이에요." },
    { title: "약속해요", desc: "도움이 필요할 때 가족에게 소식을 전해드려요." },
    { title: "시작할까요?", desc: "아래 버튼을 누르면 저와 만날 수 있어요." },
  ];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else router.push("/home");
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="w-48 h-48 bg-primary/20 rounded-full flex items-center justify-center text-6xl">
        🤝
      </div>

      <Card className="p-8 w-full text-center space-y-4 border-none shadow-sm">
        <h2 className="text-3xl font-bold">{steps[step - 1].title}</h2>
        <p className="text-xl text-slate-600 leading-relaxed">
          {steps[step - 1].desc}
        </p>
      </Card>

      <Button
        size="lg"
        className="w-full h-20 text-2xl font-bold rounded-3xl"
        onClick={nextStep}
      >
        {step === 3 ? "확인했어요" : "네, 알겠어요"}
      </Button>
    </div>
  );
}