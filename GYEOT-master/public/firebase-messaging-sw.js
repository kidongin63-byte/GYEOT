// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-sw.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-sw.js');

// 초기화 코드는 .env와 별개로 Firebase 콘솔의 설정값을 그대로 넣어야 합니다.
firebase.initializeApp({
    apiKey: "...",
    // ... 나머지 정보
});

const messaging = firebase.messaging();