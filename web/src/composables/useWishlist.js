// src/composables/useWishlist.js
import { ref, watch } from "vue";
import { useAuth } from "@/composables/useAuth.js";

/* ==================================
   🔥 전역 싱글톤 상태 (중요!!)
================================== */
const wishlist = ref([]);   // ⭐ 여기!!!

export function useWishlist() {
    const { auth } = useAuth();

    /* ===============================
       🔑 계정별 localStorage key
    =============================== */
    const getKey = () => {
        return auth.email
            ? `wishlist_${auth.email}`
            : "wishlist_guest";
    };

    /* ===============================
       📦 localStorage 로드
    =============================== */
    const loadWishlist = () => {
        const data = localStorage.getItem(getKey());
        wishlist.value = data ? JSON.parse(data) : [];
    };

    /* ===============================
       ⭐ 최초 1회 로드
    =============================== */
    if (wishlist.value.length === 0) {
        loadWishlist();
    }

    /* ===============================
       🔄 로그인/로그아웃 시 갱신
    =============================== */
    watch(
        () => auth.email,
        () => {
            loadWishlist();
        }
    );

    /* ===============================
       💾 변경 시 자동 저장
    =============================== */
    watch(
        wishlist,
        (val) => {
            localStorage.setItem(getKey(), JSON.stringify(val));
        },
        { deep: true }
    );

    /* ===============================
       ❤️ 찜 여부
    =============================== */
    const isWishlisted = (id) => {
        return wishlist.value.some(m => m.id === id);
    };

    /* ===============================
       🔥 추가 / 즉시 삭제
    =============================== */
    const toggleWishlist = (movie) => {
        const idx = wishlist.value.findIndex(m => m.id === movie.id);

        if (idx === -1) {
            wishlist.value.push(movie);
        } else {
            wishlist.value.splice(idx, 1); // ⭐ 이게 즉시 반영됨
        }
    };

    return {
        wishlist,
        toggleWishlist,
        isWishlisted,
    };
}
