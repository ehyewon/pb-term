<template>
  <div class="auth-wrapper">
    <div class="card-stack">

      <hr style="margin:16px 0;opacity:0.3" />

      <!-- 🔥 카드만 transition -->
      <transition name="card-slide" mode="out-in">
        <!-- 로그인 카드 -->
        <div v-if="!showSignup" key="login" class="auth-card login-card">
          <h2>로그인</h2>

          <input v-model="loginId" placeholder="아이디(이메일)" />
          <input v-model="loginPw" type="password" placeholder="비밀번호" />

          <label class="check-row">
            <input type="checkbox" v-model="saveId" />
            아이디 저장 (자동 로그인)
          </label>

          <button class="main-btn" @click="handleLogin">로그인</button>

          <p class="switch">
            계정이 없으신가요?
            <span @click="toggle">회원가입</span>
          </p>

          <!-- 소셜 로그인 영역 -->
          <div class="social-login">
            <!-- Google 아이콘 버튼 -->
            <div class="google-icon-btn" @click="handleGoogleLogin">
              <img src="/google-icon.png" alt="Google 로그인" />
            </div>
             <div class="social-label">구글 계정으로 간편 로그인하기</div>
          </div>
        </div>

        <!-- 회원가입 카드 -->
        <div v-else key="signup" class="auth-card signup-card">
          <h2>회원가입</h2>

          <input v-model="signId" placeholder="아이디(이메일)" />
          <input v-model="signPw" type="password" placeholder="비밀번호" />
          <input v-model="signPw2" type="password" placeholder="비밀번호 확인" />

          <label class="check-row">
            <input type="checkbox" v-model="agree" />
            약관에 동의하십니까? (필수)
          </label>

          <button class="main-btn" @click="handleSignup">회원가입</button>

          <p class="switch">
            이미 계정이 있으신가요?
            <span @click="toggle">로그인</span>
          </p>
        </div>
      </transition>
    </div>

    <div v-if="successMsg" class="success-popup">
      {{ successMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "@/composables/useToast";
import { useAuth, loginWithGoogle } from "@/composables/useAuth";

/* ===============================
   기본 설정
================================ */
const router = useRouter();
const { showToast } = useToast();
const { login } = useAuth();

/* ===============================
   상태
================================ */
const showSignup = ref(false);
const successMsg = ref("");

const loginId = ref("");
const loginPw = ref("");
const saveId = ref(false);

const signId = ref("");
const signPw = ref("");
const signPw2 = ref("");
const agree = ref(false);

/* ===============================
   유틸
================================ */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidApiKey = (key) =>
  /^[a-f0-9]{32}$/.test(key);

/* ===============================
   자동 로그인
================================ */
onMounted(() => {
  const savedId = localStorage.getItem("savedId");
  const autoLogin = localStorage.getItem("autoLogin");

  if (savedId) {
    loginId.value = savedId;
    saveId.value = true;
  }

  if (savedId && autoLogin === "true") {
    login(savedId);
    router.push("/");
  }
});

/* ===============================
   아이디 저장
================================ */
watch(saveId, (checked) => {
  if (checked && loginId.value) {
    localStorage.setItem("savedId", loginId.value);
  } else {
    localStorage.removeItem("savedId");
    localStorage.removeItem("autoLogin");
  }
});

/* ===============================
   카드 전환
================================ */
const toggle = () => {
  successMsg.value = "";
  showSignup.value = !showSignup.value;
};

/* ===============================
   회원가입
================================ */
async function handleSignup() {
  if (!signId.value || !signPw.value || !signPw2.value) {
    showToast("모든 항목을 입력해주세요.");
    return;
  }

  if (!isValidEmail(signId.value)) {
    showToast("이메일 형식이 올바르지 않습니다.");
    return;
  }

  if (!isValidApiKey(signPw.value)) {
    showToast("비밀번호에는 TMDB API Key를 입력해주세요.");
    return;
  }

  if (signPw.value !== signPw2.value) {
    showToast("API Key가 서로 일치하지 않습니다.");
    return;
  }

  if (!agree.value) {
    showToast("약관에 동의해야 합니다.");
    return;
  }

  try {
    await axios.get("https://api.themoviedb.org/3/movie/popular", {
      params: { api_key: signPw.value },
    });
  } catch {
    showToast("유효하지 않은 TMDB API Key입니다.");
    return;
  }

  successMsg.value = "🎉 회원가입 완료!";
  setTimeout(() => {
    successMsg.value = "";
    showSignup.value = false;
  }, 1200);
}

/* ===============================
   로그인
================================ */
async function handleLogin() {
  if (!loginId.value || !loginPw.value) {
    showToast("이메일과 API Key를 입력해주세요.");
    return;
  }

  if (!isValidEmail(loginId.value)) {
    showToast("이메일 형식이 올바르지 않습니다.");
    return;
  }

  try {
    await axios.get("https://api.themoviedb.org/3/movie/popular", {
      params: { api_key: loginPw.value },
    });

    login(loginId.value);

    if (saveId.value) {
      localStorage.setItem("autoLogin", "true");
    }

    successMsg.value = "🎉 로그인 성공!";
    setTimeout(() => {
      successMsg.value = "";
      router.push("/");
    }, 500);
  } catch {
    showToast("TMDB API Key가 올바르지 않습니다.");
  }
}

/* ===============================
   Google 로그인
================================ */
async function handleGoogleLogin() {
  try {
    const user = await loginWithGoogle();
    login(user.email);

    successMsg.value = "🎉 Google 로그인 성공!";
    setTimeout(() => {
      successMsg.value = "";
      router.push("/");
    }, 500);
  } catch {
    showToast("Google 로그인에 실패했습니다.");
  }
}

</script>

<style scoped>
.auth-wrapper {
  width: 100%;
  height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #141414;
}

.card-stack {
  width: 480px;
  perspective: 1200px;
}

.auth-card {
  padding: 40px;
  background: #1e1e1e;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.card-slide-enter-active,
.card-slide-leave-active {
  transition: all 0.6s ease;
}

.card-slide-enter-from {
  opacity: 0;
  transform: translateX(80px) rotateY(-25deg);
}

.card-slide-leave-to {
  opacity: 0;
  transform: translateX(-80px) rotateY(25deg);
}

input {
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: #2a2a2a;
  color: white;
}

.check-row {
  font-size: 14px;
  color: #ccc;
}

.main-btn {
  padding: 14px;
  background: #e50914;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.switch {
  font-size: 14px;
  color: #bbb;
}

.switch span {
  color: white;
  cursor: pointer;
  font-weight: bold;
}

.success-popup {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: #e50914;
  padding: 18px 28px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bold;
  color: white;
}

/* ===============================
   소셜 로그인 영역
================================ */
.social-login {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.social-label {
  font-size: 13px;
  color: #aaa;
}

.google-icon-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.google-icon-btn img {
  width: 28px;
  height: 28px;
}

.google-icon-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
}

.google-icon-btn:active {
  transform: scale(0.95);
}

</style>
