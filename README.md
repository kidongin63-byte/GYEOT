# GYEOT (곁) - 시니어를 위한 AI 안전 동행 서비스

## 🌟 프로젝트 개요
'곁'은 혼자 계시는 어르신들의 일상을 살피고, 따뜻한 대화를 통해 정서적 지지와 실시간 안전 모니터링을 제공하는 AI 동행 서비스입니다. '곁'에 있다는 안심과 즐거움을 어르신과 가족에게 선물합니다.

## 🚀 주요 기능
1.  **다정한 AI 손주 '반디'와의 대화**
    - Groq AI(Llama 3.1) 모델을 기반으로 한 자연스럽고 따뜻한 음성/텍스트 대화.
    - 어르신 맞춤형 말투와 주제로 정서적 교감 지원.
2.  **실시간 건강 및 위험 분석**
    - 대화 맥락을 실시간으로 분석하여 위험도(Level 1~3: 정상, 우울, 응급)를 판단.
    - Firebase를 통한 지속적인 활동 로그 저장.
3.  **긴급 상황 자동 에스컬레이션**
    - 이상 징후 감지 시 보호자(박아들) 및 담당 관리자(이주무관)에게 즉시 알림 생성.
    - 사고 및 응급 상황에 대한 빠른 대응 체계 구축.
4.  **시니어 친화적 UI/UX**
    - 시력이 약하신 어르신들을 위한 큰 폰트와 고대비 색상 적용.
    - 복잡한 메뉴 없이 '말하기' 버튼 하나로 시작하는 직관적인 경험.
5.  **활동 리포트 제공**
    - 보호자가 어르신의 최근 활동 시간과 걸음 수 등을 간편하게 확인할 수 있는 대시보드.

## 🛠 기술 스택
-   **Frontend**: Next.js 15, React 19, Tailwind CSS 4
-   **UI/Components**: shadcn/ui, Radix UI, Lucide React
-   **Artificial Intelligence**: Groq API (Llama-3.1-70b-versatile)
-   **Backend & DB**: Next.js API Routes, Firebase (Firestore, Auth, Cloud Messaging)
-   **Optimization**: Next PWA 지원 (배경 설치 및 오프라인 접근성 향상)

## 📦 설치 및 실행 방법
1.  **의존성 설치**
    ```bash
    npm install
    ```
2.  **환경 변수 설정**
    `.env.local` 파일을 생성하고 다음 정보를 입력하세요.
    ```env
    # AI 엔진 설정
    GROQ_API_KEY=your_groq_api_key_here

    # Firebase 설정
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
3.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
4.  **웹 접속**
    브라우저에서 `http://localhost:3000`으로 접속하여 서비스를 시작합니다.

## 📁 디렉토리 구조
-   `app/`: 서비스 핵심 페이지 및 API
    -   `page.tsx`: 초기 온보딩 및 시작 화면
    -   `home/`: AI '반디'와의 메인 인터페이스
    -   `api/chat/`: Llama-3.1 기반 대화 분석 엔진
-   `components/`: UI 라이브러리 및 재사용 가능한 컴포넌트
-   `lib/`: Firebase 연동 및 비즈니스 유틸리티
-   `public/`: 로고, 폰트, 이미지 등 정적 리소스

## 🤝 기여 방법
이 프로젝트에 기여하고 싶다면 이슈를 생성하거나 Pull Request를 제출해 주세요. 모든 기여를 환영합니다!
