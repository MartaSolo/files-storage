import { ref } from "vue";

export const useButtonText = () => {
  const isTextDisplayed = ref(false);

  const showText = () => {
    isTextDisplayed.value = true;
  };

  const hideText = () => {
    isTextDisplayed.value = false;
  };

  return {
    isTextDisplayed,
    showText,
    hideText,
  };
};
