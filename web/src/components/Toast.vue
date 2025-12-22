<template>
  <div v-if="visible" class="toast">
    {{ message }}
  </div>
</template>

<script setup>
import { useToast } from "@/composables/useToast.js";

const { message, visible } = useToast();
</script>

<style scoped>
.toast {
  position: fixed;

  /* ⭐ 화면 중앙 근처로 이동 */
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* ⭐ 크기 증가 */
  max-width: 420px;
  padding: 18px 26px;

  /* ⭐ 더 진한 배경 + 블러 */
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);

  color: #fff;
  font-size: 20px;
  font-weight: 600;
  text-align: center;

  border-radius: 14px;
  z-index: 9999;

  animation: toastFade 0.35s ease-out;
}

/* 자연스러운 fade-in + 살짝 올라오는 애니메이션 */
@keyframes toastFade {
  from {
    opacity: 0;
    transform: translate(-50%, -40%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
</style>
