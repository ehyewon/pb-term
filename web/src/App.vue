<template>
  <div>
    <Header />

    <main class="page-container">
      <div class="inner-container">
        <router-view />
      </div>
    </main>

    <Toast />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Toast from "@/components/Toast.vue";
</script>

<style>
body {
  background-color: #141414;
  color: white;
  margin: 0;
}

/* 헤더 공간 확보 */
.page-container {
  padding-top: 80px;
  min-height: 100vh;
  box-sizing: border-box;
}

/* ⭐ 아주 살짝만 여백을 두는 컨테이너 */
.inner-container {
  max-width: 1800px;   /* ⭐ 넓게 유지함 → 화면 거의 꽉 차보임 */
  margin: 0 auto;
  padding: 0 20px;      /* ⭐ 딱 이 정도면 “살짝 들어온 느낌” */
  box-sizing: border-box;
}
</style>
