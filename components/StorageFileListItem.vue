<script setup lang="ts">
// import { Database } from "@/types/storage";
import { FileObject } from "@/types/FileObject";

const props = defineProps<{
  file: FileObject;
  // file: Database;
}>();
</script>

<template>
  <li class="file">{{ file.name }}</li>
</template>

<style lang="scss" scoped></style>
