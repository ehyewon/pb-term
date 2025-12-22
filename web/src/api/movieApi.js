import axios from "axios";

const API_KEY = "b4303f4fca2d461848894c447fbf6a72";
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * 인기 영화 가져오기
 */
export async function getPopular(page = 1) {
    const res = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}

/**
 * 액션 영화 가져오기
 */
export async function getAction(page = 1) {
    const res = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
            api_key: API_KEY,
            with_genres: 28,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}

/**
 * 높은 평점 영화 가져오기
 */
export async function getTopRated(page = 1) {
    const res = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}

/**
 * 🔥 영화 상세 정보 가져오기 (러닝타임 여기 있음!)
 */
export async function getMovieDetail(movieId) {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
        },
    });
    return res.data;
}

/**
 * 🔥 비슷한 영화 가져오기 (선택)
 */
export async function getSimilarMovies(movieId, page = 1) {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
            page
        },
    });
    return res.data.results;
}
/**
 * 🎬 영화 예고편 가져오기
 */
export async function getMovieVideos(movieId) {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
        params: {
            api_key: API_KEY,
            language: "ko-KR",
        },
    });
    return res.data.results;
}

