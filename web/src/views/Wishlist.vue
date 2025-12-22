<script setup>
import { useWishlist } from "@/composables/useWishlist.js";
import MovieCard from "@/components/MovieCard.vue";

const { wishlist, toggleWishlist } = useWishlist();

/* ===============================
   🔥 찜 목록에서 즉시 삭제
=============================== */
function removeMovie(id) {
  const movie = wishlist.value.find(m => m.id === id);
  if (!movie) return;

  toggleWishlist(movie);
}
</script>

<template>
  <div class="wishlist-container">

    <div v-if="wishlist.length === 0" class="empty">
      아직 찜한 영화가 없어요
    </div>

    <div class="movie-grid">
      <MovieCard
        v-for="movie in wishlist"
        :key="movie.id"
        :movie="movie"
        mode="wishlist"
        @removed="removeMovie"
      />
    </div>
  </div>
</template>

<style scoped>
.wishlist-container {
  padding: 40px 50px;
  color: #fff;
}

.title {
  font-size: 26px;
  margin-bottom: 25px;
  font-weight: bold;
}

.empty {
  margin-top: 60px;
  font-size: 22px;
  text-align: center;
  opacity: 0.8;
}

/* ⭐ 찜 목록 그리드 */
.movie-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 40px;
  padding-bottom: 40px;
}

@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
}
</style>
