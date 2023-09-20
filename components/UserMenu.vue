<script setup lang="ts">
const UserIcon = resolveComponent("UserIcon");

const router = useRouter();
const { logout } = useLogoutUser();

const isMenuOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogOut = () => {
  try {
    logout();
    router.push("/");
  } catch (e: any) {
    throw new Error(e.message);
  }
};
</script>

<template>
  <button
    ref="root"
    class="user"
    aria-label="user menu"
    @click="toggleMenu"
    @keyup.esc="isMenuOpen = false"
  >
    <UserIcon />
  </button>
  <Transition name="menu" :duration="300">
    <template v-if="isMenuOpen">
      <div ref="list" class="menu__list">
        <button class="menu__item--button" @click="handleLogOut">
          Log out
        </button>
        <NuxtLink to="/your-profile" class="menu__item--button"
          >Your profile</NuxtLink
        >
      </div>
    </template>
  </Transition>
</template>

<style lang="scss" scoped>
.user {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid $color-green-dark;
  position: relative;
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
}
.menu__list--item:last-child {
  border-bottom: none;
}

.menu__item--button:focus {
  background-color: $color-green-light-hover;
}

.menu__item--button {
  padding: 0 20px 0 20px;
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: $color-green-light-hover;
  }
}

.menu__list--item:first-child .menu__item--button {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.menu__list--item:last-child .menu__item--button {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
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
