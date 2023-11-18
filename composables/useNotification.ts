type Theme = "success" | "error" | "";

const theme = ref<Theme>("");
const text = ref("");
const isOpen = ref(false);
const time = ref(10000);
const timeout = ref();

export const useNotification = () => {
  const notify = (type: Theme, message: string) => {
    clearTimeout(timeout.value);

    isOpen.value = true;
    text.value = message;
    theme.value = type;

    timeout.value = setTimeout(() => {
      closeNotification();
    }, time.value);
  };

  const closeNotification = () => {
    isOpen.value = false;
  };

  return {
    theme,
    text,
    isOpen,
    notify,
    closeNotification,
  };
};
