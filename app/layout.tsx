// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GYEOT - 당신의 곁",
  description: "시니어를 위한 AI 안전 동행",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} max-w-md mx-auto min-h-screen border-x bg-background shadow-lg`}>
        <header className="p-6 text-center">
          <h1 className="text-4xl font-bold text-primary tracking-tighter">GYEOT</h1>
          <p className="text-sm text-slate-500 font-medium">당신의 곁에 항상 있을게요</p>
        </header>
        <main className="pb-20">{children}</main>
      </body>
    </html>
  );
}