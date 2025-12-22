<template>
  <div class="movie-card" @click="handleClick">
    <!-- ❤️ 찜 아이콘 -->
    <div v-if="isWishlisted(movie.id)" class="wish-icon">❤️</div>

    <img :src="imgUrl" :alt="movie.title" class="poster" />

    <!-- 🎬 검색 페이지에서만 영화 제목 -->
    <p v-if="mode === 'search'" class="movie-title">
      {{ movie.title }}
    </p>

    <!-- ⭐ 홈/인기에서만 찜 버튼 -->
    <button
      v-if="mode !== 'wishlist' && mode !== 'search'"
      class="wish-btn"
      @click.stop="toggleWishlist(movie)"
    >
      {{ isWishlisted(movie.id) ? "찜 취소" : "찜하기" }}
    </button>
  </div>
</template>

<script setup>
import { inject, computed } from "vue";
import { useWishlist } from "@/composables/useWishlist.js";

const props = defineProps({
  movie: Object,
  mode: {
    type: String,
    default: "default" // default | wishlist | search
  }
});

const openDetail = inject("openDetail");
const { isWishlisted, toggleWishlist } = useWishlist();

const handleClick = () => {
  if (props.mode === "wishlist" || props.mode === "search") {
    toggleWishlist(props.movie);
  } else {
    openDetail?.(props.movie);
  }
};

const imgUrl = computed(() =>
  props.movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : "/no-image.png"
);
</script>

<style scoped>
/* =========================
   🎬 카드 기본 (모든 화면 공통)
========================= */
.movie-card {
  width: 100%;              /* 🔥 grid column 폭을 그대로 사용 */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

/* 포스터 */
.poster {
  width: 100%;
  aspect-ratio: 2 / 3;      /* 🔥 반응형 핵심 */
  object-fit: cover;
  border-radius: 10px;
}

/* 검색 페이지 제목 */
.movie-title {
  margin-top: 10px;
  font-size: 15px;
  text-align: center;
  color: #eee;
}

/* ❤️ 찜 아이콘 */
.wish-icon {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 22px;
  color: #ff4b4b;
  z-index: 5;
}

/* 찜 버튼 */
.wish-btn {
  width: 100%;
  margin-top: 8px;
  height: 38px;
  border-radius: 6px;
  border: none;
  background: #222;
  color: white;
}

/* =========================
   📱 모바일
========================= */
@media (max-width: 480px) {
  .movie-title {
    font-size: 13px;
  }
}

/* =========================
   📱 태블릿
========================= */
@media (min-width: 768px) and (max-width: 1023px) {
  .movie-title {
    font-size: 14px;
  }
}
</style>