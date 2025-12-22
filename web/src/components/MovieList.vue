<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import MovieCard from "./MovieCard.vue";

const props = defineProps({
  title: String,
  movies: Array
});

const scrollContainer = ref(null);

// --- 슬라이드 이동 ---
const slideAmount = () => {
  if (!scrollContainer.value) return 600;
  return scrollContainer.value.clientWidth * 0.8;
};

const slideLeft = () => {
  scrollContainer.value.scrollBy({ left: -slideAmount(), behavior: "smooth" });
};

const slideRight = () => {
  scrollContainer.value.scrollBy({ left: slideAmount(), behavior: "smooth" });
};

// --- 자동 슬라이드 ---
let autoSlideTimer = null;

const startAutoSlide = () => {
  autoSlideTimer = setInterval(slideRight, 5000);
};

const stopAutoSlide = () => {
  if (autoSlideTimer) clearInterval(autoSlideTimer);
};

onMounted(startAutoSlide);
onBeforeUnmount(stopAutoSlide);
</script>

<template>
  <section class="movie-list">
    <h2 class="list-title">{{ title }}</h2>

    <div class="slider-wrapper" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
      <button class="slide-btn left" @click="slideLeft">〈</button>

      <div class="list-container" ref="scrollContainer">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          mode="default"
        />
      </div>

      <button class="slide-btn right" @click="slideRight">〉</button>
    </div>
  </section>
</template>

<style scoped>
.movie-list {
  margin: 40px 0;
}

.list-title {
  font-size: 22px;
  margin-bottom: 14px;
  font-weight: bold;
  padding-left: 10px;
}

/* 전체 래퍼 */
.slider-wrapper {
  position: relative;
  overflow: hidden;
  padding: 0 40px;
}

/* ⭐ 핵심: flex + 가로 스크롤 + 세로 고정 */
.list-container {
  display: flex;
  flex-direction: row;
  gap: 24px;

  overflow-x: auto;
  overflow-y: hidden;

  padding-bottom: 10px;
  height: 380px; /* 카드 높이 */

  scroll-behavior: smooth;
}

.list-container::-webkit-scrollbar {
  display: none;
}

/* 카드 고정 크기 */
.movie-card {
  flex: 0 0 220px !important;
}

/* 화살표 버튼 */
.slide-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.55);
  border: none;
  color: white;
  font-size: 28px;
  width: 48px;
  height: 90px;
  cursor: pointer;
  z-index: 10;
  border-radius: 6px;
}

.slide-btn.left { left: 0; }
.slide-btn.right { right: 0; }

.slide-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  color: black;
}
</style>
