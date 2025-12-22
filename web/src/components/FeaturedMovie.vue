<template>
  <div class="featured" :style="backgroundStyle">
    <div class="overlay"></div>

    <div class="content">
      <h1>{{ movie?.title }}</h1>
      <p>{{ movie?.overview }}</p>

      <div class="buttons">
        <button class="play-btn">▶ 재생</button>

        <!-- 상세보기 버튼 -->
        <button class="detail-btn" @click="openDetail(movie)">
          상세보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";

// movie prop
const props = defineProps({
  movie: Object,
});

// Home.vue에서 제공하는 openDetail 함수 받기
const openDetail = inject("openDetail");

// 배경 스타일
const backgroundStyle = computed(() => ({
  backgroundImage: `url(https://image.tmdb.org/t/p/original${props.movie?.backdrop_path})`,
}));
</script>

<style scoped>
.featured {
  height: 70vh;
  background-size: cover;
  background-position: center;
  position: relative;
  color: white;
}

/* 어두운 그라데이션 */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2));
}

.content {
  position: absolute;
  bottom: 80px;
  left: 40px;
  max-width: 600px;
}

h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 12px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.85;
}

/* 버튼 영역 */
.buttons {
  display: flex;
  gap: 12px;
}

.play-btn,
.detail-btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* 재생 버튼 */
.play-btn {
  background: #fff;
  color: #000;
}

.play-btn:hover {
  background: #e5e5e5;
}

/* 상세보기 버튼 */
.detail-btn {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.detail-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
