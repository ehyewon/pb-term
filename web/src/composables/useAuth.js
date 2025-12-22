// src/composables/useAuth.js
import { reactive } from "vue";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth as firebaseAuth, db } from "@/firebase";

/* ===============================
   Vue 앱 로그인 상태
================================ */
const authState = reactive({
    isLogin: false,
    email: "",
    currentUser: null, // 🔥 추가
});

/* ===============================
   Firebase Auth 상태 감시 (🔥 핵심)
================================ */
onAuthStateChanged(firebaseAuth, async (user) => {
    if (!user) {
        authState.isLogin = false;
        authState.email = "";
        authState.currentUser = null;
        return;
    }

    // ✅ Vue 상태 갱신
    authState.isLogin = true;
    authState.email = user.email;
    authState.currentUser = user;

    // ✅ Firestore users 저장 / 갱신
    await setDoc(
        doc(db, "users", user.uid),
        {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoUrl: user.photoURL,
            provider: "google",
            lastLoginAt: serverTimestamp(),   // 🔥 매 로그인 갱신
            createdAt: serverTimestamp(),     // 최초 로그인
        },
        { merge: true } // ⭐ 없으면 생성, 있으면 업데이트
    );
});

/* ===============================
   composable export
================================ */
export function useAuth() {
    function logout() {
        authState.isLogin = false;
        authState.email = "";
        authState.currentUser = null;
    }
    // 🔥 Web 자동 로그인 차단 (핵심)
    localStorage.removeItem("isLogin");
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("user");

    return {
        auth: authState,
        logout,
    };
}

/* ===============================
   Google 로그인 / 로그아웃
================================ */
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
}

export async function logoutFromGoogle() {
    await signOut(firebaseAuth);
}
