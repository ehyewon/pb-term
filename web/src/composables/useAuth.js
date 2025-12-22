// src/composables/useAuth.js
import { reactive } from "vue";

const auth = reactive({
    isLogin: localStorage.getItem("isLogin") === "true",
    email: localStorage.getItem("loginEmail") || "",
});

export function useAuth() {
    function login(email) {
        auth.isLogin = true;
        auth.email = email;

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("loginEmail", email);
    }

    function logout() {
        auth.isLogin = false;
        auth.email = "";

        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("autoLogin");
    }

    return { auth, login, logout };
}



// web/src/composables/useAuth.js
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/firebase";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
};

export const logout = async () => {
    await signOut(auth);
};