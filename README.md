# GYEOT (곁) - 시니어를 위한 AI 안전 동행 서비스

## 🌟 프로젝트 개요
'곁'은 홀로 지내시는 어르신들의 일상을 보살피고, 따뜻한 대화를 통해 정서적 지지와 실시간 안전 모니터링을 제공하는 AI 동행 서비스입니다. '곁'에 있다는 안심과 즐거움을 어르신과 가족에게 선물합니다.

## 🚀 주요 기능
1.  **다정한 AI 손주 '반디'와의 대화**
    - Google Gemini AI 모델을 기반으로 한 자연스럽고 따뜻한 음성/텍스트 대화.
    - 어르신 맞춤형 말투와 주제로 정서적 교감 지원.
2.  **실시간 건강 및 위험 분석**
    - 대화 맥락을 실시간으로 분석하여 어르신의 상태를 파악.
    - 활동 로그 및 감정 상태를 지속적으로 기록.
3.  **긴급 상황 대응 체계**
    - '긴급호출' 버튼을 통한 즉각적인 도움 요청 기능.
    - 사고 및 응급 상황에 대비한 직관적인 SOS 인터페이스.
5.  **동적 입체 호칭 시스템 (최신 업데이트)**
    - 사용자가 직접 자신의 호칭(예: '대장', '손오공')을 설정 가능.
    - 설정된 호칭은 아바타에 즉시 반영되며, AI(반디)와의 대화 중 고유 명칭으로 사용.
6.  **감성형 AI 페르소나 정교화**
    - 반복적인 기계적 인사를 배제하고 맥락에 따른 자연스러운 대화 흐름 구현.
    - 손주 또는 연인과 같은 친밀하고 다정한 대화 스타일 적용.
7.  **활동 리포트 및 메모**
    - 어르신의 활동 패턴을 확인할 수 있는 일간 리포트 (직관적인 카드형 모바일 UI 적용).
    - 텍스트로 자유롭게 기록할 수 있는 메모(글쓰기) 기능.
8.  **사용자 친화적 모바일 UI/UX (최신 업데이트)**
    - 모바일 화면에 최적화된 풀스크린 설정 모달.
    - 시인성을 높인 큼직한 폰트, 알약 형태(Pill-shape) 버튼, 파스텔 톤(연보라) 포인트 컬러 디자인 적용.

## 🛠 기술 스택
-   **Frontend**: Next.js 16, React 19, Tailwind CSS 4
-   **UI/Components**: shadcn/ui, Radix UI, Lucide React, Framer Motion (애니메이션)
-   **Artificial Intelligence**: Google Gemini API (Generative AI)
-   **Backend & DB**: Next.js API Routes, Firebase (Firestore, Auth)
-   **Optimization**: Next PWA 지원 (설치 및 오프라인 접근성)

## 📦 설치 및 실행 방법
1.  **의존성 설치**
    ```bash
    npm install
    ```
2.  **환경 변수 설정**
    `.env.local` 파일을 생성하고 다음 정보를 입력하세요.
    ```env
    # AI 엔진 설정
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

    # Firebase 설정
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    ... (나머지 Firebase 설정)
    ```
3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
4.  **웹 접속**
    브라우저에서 `http://localhost:3000`으로 접속하여 서비스를 시작합니다.

## 📁 디렉토리 구조
-   `app/`: 서비스 핵심 페이지 및 API
    -   `home/`: AI '반디' 통합 대시보드
    -   `api/chat/`: Gemini 기반 대화 엔진
-   `components/`: UI 라이브러리 및 재사용 가능한 컴포넌트
-   `lib/`: 외부 서비스 연동 및 유틸리티
-   `public/`: 로고, 아이콘 등 정적 리소스

## 🤝 기여 방법
이 프로젝트에 기여하고 싶다면 이슈를 생성하거나 Pull Request를 제출해 주세요. 모든 기여를 환영합니다!

