# 🎬 PB-TERM – Netflix Clone Web & Mobile(WEB 코드)

PB-TERM은 **TMDB API**와 **Firebase**를 활용한  
Netflix 스타일의 영화 정보 **웹(Web) + 모바일(Mobile)** 통합 프로젝트입니다.  

웹(WebApp)과 모바일(MobileApp)이 **동일한 Firebase 프로젝트**를 공유하여  
로그인, 찜 목록, 검색 기록이 사용자별로 연동됩니다.

---

## 📌 프로젝트 개요

- **Web**: Vue.js 기반 SPA
- **Mobile**: Flutter 기반 Android 앱
- **Backend / DB**: Firebase Authentication + Cloud Firestore
- **External API**: TMDB API
- **배포**: JCloud

---

## 🛠 기술 스택

### 🌐 Web
- Vue 3
- Vite
- Vue Router
- Axios
- TMDB API
- Firebase (Authentication, Firestore)

### 📱 Mobile
- Flutter
- Firebase Authentication (Google Login)
- Cloud Firestore

---

## 📂 프로젝트 구조 (Web)

```text
web/
├─ dist/
├─ public/
├─ src/
│ ├─ api/
│ │ └─ movieApi.js
│ ├─ assets/
│ │ ├─ base.css
│ │ ├─ global.css
│ │ └─ main.css
│ ├─ components/
│ │ ├─ FeaturedMovie.vue
│ │ ├─ Header.vue
│ │ ├─ MovieCard.vue
│ │ ├─ MovieDetail.vue
│ │ ├─ MovieList.vue
│ │ └─ Toast.vue
│ ├─ composables/
│ │ ├─ useAuth.js
│ │ ├─ useToast.js
│ │ └─ useWishlist.js
│ ├─ router/
│ │ └─ index.js
│ ├─ views/
│ │ ├─ Home.vue
│ │ ├─ Popular.vue
│ │ ├─ Search.vue
│ │ ├─ Signin.vue
│ │ └─ Wishlist.vue
│ ├─ App.vue
│ ├─ firebase.js
│ └─ main.js
├─ index.html
└─ package.json
```
---

## 🚀 실행 방법 (Web)

### 1️⃣ 패키지 설치
```bash
npm install

```
---
## 🚀 개발 서버 실행 (Web)

- 패키지 설치

- npm install

서버 실행

npm run dev
---

개발 서버 실행 후 브라우저에서 로컬 주소로 접속하여 확인할 수 있습니다.

## 🌐 배포 정보

배포 서버: JCloud

배포 주소:
http://113.198.66.68:10239

Web 애플리케이션은 JCloud 서버에서 실행 중이며,
브라우저를 통해 접속하여 확인할 수 있습니다.