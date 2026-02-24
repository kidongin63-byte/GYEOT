// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GYEOT - 당신의 곁",
  description: "시니어를 위한 AI 안전 동행",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen bg-background max-w-[430px] mx-auto shadow-2xl border-x`}>
        <main>{children}</main>
      </body>
    </html>
  );
}