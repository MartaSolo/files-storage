<script setup lang="ts">
import { UserMenuOptions } from "@/types/UserMenuOptions";

const router = useRouter();
const { logout } = useLogoutUser();
const { checkProfileImage } = useProfileImage();
const profileImageSource = useProfileImageSource();
const { notify } = useNotification();

const options: UserMenuOptions[] = [
  { id: "your-profile", label: "Got to your profile" },
  { id: "logout", label: "Logout" },
];

const isMenuOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const highlightedIndex = ref(0);

const prevIndex = computed(() => {
  return highlightedIndex.value === 0
    ? options.length - 1
    : highlightedIndex.value - 1;
});

const nextIndex = computed(() => {
  return highlightedIndex.value === options.length - 1
    ? 0
    : highlightedIndex.value + 1;
});

const highlightPrev = () => {
  highlightedIndex.value = prevIndex.value;
};

const highlightNext = () => {
  highlightedIndex.value = nextIndex.value;
};

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleOptionByKeyboard = () => {
  if (isMenuOpen.value) {
    handleOption(highlightedIndex.value);
  } else {
    isMenuOpen.value = true;
  }
};

const redirectToYourProfile = () => {
  router.push("/your-profile");
  isMenuOpen.value = false;
};

const handleLogout = () => {
  try {
    logout();
    router.push("/");
  } catch (e: any) {
    notify("error", error.message);
  }
  isMenuOpen.value = false;
};

const handleOption = (index: number) => {
  switch (index) {
    case 0:
      return redirectToYourProfile();
    case 1:
      return handleLogout();
  }
};

onMounted(() => {
  checkProfileImage();
});
</script>

<template>
  <div ref="root" class="menu">
    <button
      class="menu__button"
      aria-label="user menu"
      role="combobox"
      aria-controls="listbox-container"
      aria-owns="listbox-container"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
      @keydown.up.prevent="highlightPrev"
      @keydown.down.prevent="highlightNext"
      @keydown.enter.prevent="handleOptionByKeyboard"
      @keydown.space.prevent="handleOptionByKeyboard"
      @keydown.esc="isMenuOpen = false"
      @keydown.tab="isMenuOpen = false"
    >
      <img
        class="menu__image"
        :src="profileImageSource"
        width="50"
        height="50"
      />
    </button>
    <Transition name="menu" :duration="300">
      <ul
        v-if="isMenuOpen"
        id="listbox-container"
        class="menu__list"
        role="listbox"
      >
        <li
          v-for="(option, index) in options"
          :key="option.id"
          class="menu__list--item"
          :class="{
            active: highlightedIndex === index,
          }"
          @click="handleOption(index)"
          @mouseover="highlightedIndex = index"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.menu__button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid $color-green-dark;
  position: relative;
  @include largeScreen {
    width: 50px;
    height: 50px;
  }
}

.menu__image {
  border-radius: 50%;
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.menu__list {
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: 9999;
  background-color: $color_white;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.menu__list--item {
  border-bottom: 1px solid $color-green-light;
  padding: 0 20px 0 20px;
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: $color-green-light-hover;
  }
  &.active {
    background-color: $color-green-light-hover;
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
