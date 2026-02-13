// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

// .env.local에 저장한 키값을 불러옵니다.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 앱 초기화 (중복 실행 방지)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// --- [ 1. 인증 로직 ] ---

// 구글 로그인 (박아들, 이주무관용)
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
};

// 익명 로그인 (김할머니가 번거로운 가입 없이 시작할 때)
export const signInUserAnonymously = async () => {
    return await signInAnonymously(auth);
};

// --- [ 2. Firestore 데이터 저장 (CRUD) ] ---

/**
 * 1단계: 사용자 정보 생성 (users 컬렉션)
 * 김할머니 정보, 동의 여부, AI 학습 기초 데이터를 저장합니다.
 */
export const createUserProfile = async (userId: string, data: any) => {
    return await updateDoc(doc(db, "users", userId), {
        ...data,
        agreedAt: serverTimestamp(), // 동의 시각 저장
        status: "safe", // 초기 상태는 항상 '안전'
    });
};

/**
 * 2단계: 대화 기록 저장 (conversations 컬렉션)
 * AI와 할머니의 따뜻한 대화를 저장합니다.
 */
export const saveConversation = async (userId: string, message: string, sender: "user" | "ai") => {
    return await addDoc(collection(db, "conversations"), {
        userId,
        message,
        sender,
        timestamp: serverTimestamp(),
    });
};

/**
 * 3단계: 이상징후 로그 생성 (alerts 컬렉션)
 * Level 1(주의), 2(경고), 3(위험)으로 구분합니다.
 */
export const createAlert = async (userId: string, level: 1 | 2 | 3, reason: string) => {
    return await addDoc(collection(db, "alerts"), {
        userId,
        level,
        reason,
        isResolved: false, // 이주무관이 확인했는지 여부
        createdAt: serverTimestamp(),
    });
};