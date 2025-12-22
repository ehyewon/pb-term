// src/composables/useAuth.js
import { reactive } from "vue";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth as firebaseAuth } from "@/firebase";

/* ===============================
   Vue 앱 로그인 상태
================================ */
const authState = reactive({
    isLogin: localStorage.getItem("isLogin") === "true",
    email: localStorage.getItem("loginEmail") || "",
});

export function useAuth() {
    function login(email) {
        authState.isLogin = true;
        authState.email = email;

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("loginEmail", email);
    }

    function logout() {
        authState.isLogin = false;
        authState.email = "";

        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("autoLogin");
    }

    return {
        auth: authState,
        login,
        logout,
    };
}

/* ===============================
   Firebase Google 로그인
================================ */
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    return result.user;
}

export async function logoutFromGoogle() {
    await signOut(firebaseAuth);
}
