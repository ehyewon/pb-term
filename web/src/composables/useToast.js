// src/composables/useToast.js
import { ref } from "vue";

const message = ref("");
const visible = ref(false);

export function useToast() {
    const showToast = (msg, duration = 2000) => {
        message.value = msg;
        visible.value = true;

        setTimeout(() => {
            visible.value = false;
        }, duration);
    };

    return {
        message,
        visible,
        showToast
    };
}
