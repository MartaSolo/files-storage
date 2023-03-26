<script setup lang="ts">
import { FileObject } from "@/types/FileObject";

const props = defineProps<{
  file: FileObject;
}>();
</script>

<template>
  <li class="file">{{ file.name }}</li>
</template>

<style lang="scss" scoped></style>
