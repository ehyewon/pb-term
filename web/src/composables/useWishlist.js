import { ref, watch } from "vue";
import { useAuth } from "@/composables/useAuth.js";
import {
    collection,
    addDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "firebase/firestore";
import { auth as firebaseAuth, db } from "@/firebase";

/* ==================================
   🔥 전역 싱글톤 상태 (유지)
================================== */
const wishlist = ref([]);

export function useWishlist() {
    const { auth } = useAuth(); // auth.email 용

    /* ===============================
       🔑 계정별 localStorage key (유지)
    =============================== */
    const getKey = () => {
        return auth.email
            ? `wishlist_${auth.email}`
            : "wishlist_guest";
    };

    /* ===============================
       📦 localStorage 로드 (유지)
    =============================== */
    const loadWishlist = () => {
        const data = localStorage.getItem(getKey());
        wishlist.value = data ? JSON.parse(data) : [];
    };

    /* ===============================
       ⭐ 최초 1회 로드 (유지)
    =============================== */
    if (wishlist.value.length === 0) {
        loadWishlist();
    }

    /* ===============================
       🔄 로그인/로그아웃 시 갱신 (유지)
    =============================== */
    watch(
        () => auth.email,
        () => {
            loadWishlist();
        }
    );

    /* ===============================
       💾 변경 시 localStorage 자동 저장 (유지)
    =============================== */
    watch(
        wishlist,
        (val) => {
            localStorage.setItem(getKey(), JSON.stringify(val));
        },
        { deep: true }
    );

    /* ===============================
       ❤️ 찜 여부 (유지)
    =============================== */
    const isWishlisted = (id) => {
        return wishlist.value.some(m => m.id === id);
    };

    /* ===============================
       🔥 찜 추가 / 삭제 (Firestore 연동 추가)
    =============================== */
    const toggleWishlist = async (movie) => {
        const user = firebaseAuth.currentUser; // 🔥 핵심

        if (!user) {
            alert("로그인이 필요합니다");
            return;
        }

        const idx = wishlist.value.findIndex(m => m.id === movie.id);

        // 🔴 이미 찜 → 삭제
        if (idx !== -1) {
            wishlist.value.splice(idx, 1);

            // Firestore 삭제
            const q = query(
                collection(db, "favorites"),
                where("userUid", "==", user.uid),
                where("movieId", "==", movie.id)
            );

            const snapshot = await getDocs(q);
            snapshot.forEach(doc => deleteDoc(doc.ref));
        }
        // 🟢 새로 찜 → 추가
        else {
            wishlist.value.push(movie);

            // Firestore 저장
            await addDoc(collection(db, "favorites"), {
                userUid: user.uid,
                movieId: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
                createdAt: serverTimestamp(),
            });
        }
    };

    return {
        wishlist,
        toggleWishlist,
        isWishlisted,
    };
}
