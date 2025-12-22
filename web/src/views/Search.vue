<template>
  <div class="search-page">
    <h1 class="title">🎬 영화 검색</h1>

    <!-- 검색 -->
    <div class="search-bar">
      <input
        v-model="keyword"
        placeholder="영화를 검색하세요"
        @keyup.enter="searchMovies"
      />
      <button @click="searchMovies">검색</button>
    </div>

    <!-- 최근 검색어 -->
    <div v-if="recentKeywords.length" class="recent">
      <span
        v-for="word in recentKeywords"
        :key="word"
        @click="clickRecent(word)"
      >
        {{ word }}
      </span>
    </div>

    <!-- 필터 -->
    <div class="filter-row">
      <div class="filters">
        <select v-model="genre">
          <option value="">장르 전체</option>
          <option v-for="g in genres" :key="g.id" :value="g.id">
            {{ g.name }}
          </option>
        </select>

        <select v-model="rating">
          <option value="">평점 전체</option>
          <option value="6">6점 이상</option>
          <option value="7">7점 이상</option>
          <option value="8">8점 이상</option>
        </select>

        <select v-model="sort">
          <option value="">정렬 전체</option>
          <option value="popularity.desc">인기순</option>
          <option value="release_date.desc">최신 개봉순</option>
          <option value="vote_average.desc">평점 높은 순</option>
          <option value="vote_average.asc">평점 낮은 순</option>
        </select>
      </div>

      <button class="reset-btn" @click="resetFilter">초기화</button>
    </div>

    <!-- 영화 목록 -->
    <div class="movie-grid">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
        mode="wishlist"
      />
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="loading-wrap">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>

    <!-- TOP -->
    <button v-if="showTop" class="top-btn" @click="goTop">TOP</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import { useAuth } from "@/composables/useAuth.js";

/* ================= 상태 ================= */
const keyword = ref("");
const movies = ref([]);
const baseMovies = ref([]);

const genre = ref("");
const rating = ref("");
const sort = ref("");

const page = ref(1);
const loading = ref(false);
const isSearchMode = ref(false);
const showTop = ref(false);

/* ================= 최근 검색 ================= */
const { auth } = useAuth();
const recentKey = computed(() =>
  auth.email ? `recentKeywords_${auth.email}` : null
);
const recentKeywords = ref([]);

/* ================= 장르 ================= */
const genres = ref([
  { id: 28, name: "액션" },
  { id: 35, name: "코미디" },
  { id: 18, name: "드라마" },
  { id: 10749, name: "로맨스" },
  { id: 53, name: "스릴러" },
  { id: 878, name: "SF" }
]);

/* ================= 최초 로드 ================= */
onMounted(async () => {
  await loadDiscover();

  if (recentKey.value) {
    recentKeywords.value = JSON.parse(
      localStorage.getItem(recentKey.value) || "[]"
    );
  }

  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/* ================= DISCOVER ================= */
async function loadDiscover() {
  if (loading.value) return;
  loading.value = true;

  const res = await axios.get(
    "https://api.themoviedb.org/3/discover/movie",
    {
      params: {
        language: "ko-KR",
        region: "KR",
        page: page.value
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    }
  );

  movies.value.push(...res.data.results);
  baseMovies.value.push(...res.data.results);
  page.value++;
  loading.value = false;
}

/* ================= SEARCH ================= */
async function loadSearch() {
  if (loading.value) return;
  loading.value = true;

  const res = await axios.get(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: keyword.value,
        language: "ko-KR",
        region: "KR",
        page: page.value
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
      }
    }
  );

  movies.value.push(...res.data.results);
  page.value++;
  loading.value = false;
}

/* ================= ❌ 실시간 저장 제거 ================= */
watch(keyword, async (val) => {
  page.value = 1;
  movies.value = [];

  if (!val.trim()) {
    isSearchMode.value = false;
    baseMovies.value = [];
    await loadDiscover();
    return;
  }

  isSearchMode.value = true;
  await loadSearch();
});

/* ================= 🔥 검색 버튼 / 엔터 ================= */
function searchMovies() {
  if (!keyword.value.trim()) return;

  page.value = 1;
  movies.value = [];
  isSearchMode.value = true;

  saveRecent(keyword.value);
  loadSearch();
}

/* ================= 최근 검색 ================= */
function saveRecent(word) {
  if (!recentKey.value) return;

  let list = JSON.parse(localStorage.getItem(recentKey.value) || "[]");
  list = list.filter(v => v !== word);
  list.unshift(word);
  if (list.length > 5) list.pop();

  localStorage.setItem(recentKey.value, JSON.stringify(list));
  recentKeywords.value = list;
}

function clickRecent(word) {
  keyword.value = word;

  page.value = 1;
  movies.value = [];
  isSearchMode.value = true;

  saveRecent(word);
  loadSearch();
}

/* ================= 필터 ================= */
const filteredMovies = computed(() => {
  let result = movies.value
    .filter(m =>
      genre.value ? m.genre_ids.includes(Number(genre.value)) : true
    )
    .filter(m =>
      rating.value ? m.vote_average >= Number(rating.value) : true
    );

  if (!sort.value) return result;

  return [...result].sort((a, b) => {
    if (sort.value === "popularity.desc") return b.popularity - a.popularity;
    if (sort.value === "release_date.desc")
      return new Date(b.release_date) - new Date(a.release_date);
    if (sort.value === "vote_average.desc")
      return b.vote_average - a.vote_average;
    if (sort.value === "vote_average.asc")
      return a.vote_average - b.vote_average;
    return 0;
  });
});

/* ================= 초기화 ================= */
function resetFilter() {
  keyword.value = "";
  genre.value = "";
  rating.value = "";
  sort.value = "";

  movies.value = [];
  baseMovies.value = [];
  page.value = 1;
  isSearchMode.value = false;
  loadDiscover();
}

/* ================= 스크롤 ================= */
function handleScroll() {
  showTop.value = window.scrollY > 300;

  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 300
  ) {
    isSearchMode.value ? loadSearch() : loadDiscover();
  }
}

function goTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>


<style scoped>
.search-page {
  padding: 10px 10px 60px;
  color: white;
}

.title {
  font-size: 28px;
  margin-bottom: 14px;
}

/* ======================
   검색 바
====================== */
.search-bar {
  display: flex;
  gap: 10px;
}

.search-bar input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
}

.search-bar button {
  padding: 12px 20px;
  background: #e50914;
  border: none;
  border-radius: 8px;
  color: white;
}

/* ======================
   최근 검색어
====================== */
.recent {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.recent span {
  background: #333;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
}

/* ======================
   필터
====================== */
.filter-row {
  display: flex;
  align-items: center;
  margin-top: 18px;
  gap: 12px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filters select {
  padding: 10px;
  border-radius: 6px;
  background: #222;
  color: white;
  border: none;
}

.reset-btn {
  margin-left: auto;
  padding: 10px 14px;
  background: #444;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* ======================
   🎬 영화 그리드 (기본 PC)
====================== */
.movie-grid {
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* PC */
  gap: 48px;
}

/* ======================
   ⬆ TOP 버튼
====================== */
.top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  padding: 12px 16px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  z-index: 9999;
}

/* ======================
   🔄 로딩
====================== */
.loading-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0 20px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #e50914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #aaa;
  letter-spacing: 1px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =====================================================
   📱 반응형 브레이크포인트
===================================================== */

/* 태블릿 */
@media (max-width: 1199px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
}

/* 모바일 */
@media (max-width: 768px) {
  .title {
    font-size: 22px;
  }

  .search-bar {
    flex-direction: column;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-wrap: wrap;
  }

  .reset-btn {
    margin-left: 0;
    width: 100%;
  }

  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .top-btn {
    bottom: 20px;
    right: 20px;
    padding: 10px 14px;
  }
}

/* 소형 모바일 */
@media (max-width: 360px) {
  .movie-grid {
    grid-template-columns: 2fr;
  }

  .title {
    font-size: 20px;
  }
}
</style>

