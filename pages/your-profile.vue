<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
});

const router = useRouter();
const userData = useUserData();

onMounted(() => {
  if (!userData.value.id) {
    router.push({ path: "/" });
  }
});
</script>

<template>
  <section class="profile">
    <div class="profile__content">
      <div>your profile - coming soon...</div>
      <div>
        <BaseButton label="Go to your private storage" to="/" />
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.profile {
  display: flex;
  justify-content: center;
  padding-top: 150px;
}

.profile__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 500px;
}
</style>
