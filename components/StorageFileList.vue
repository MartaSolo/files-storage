<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();
const layoutType = useLayoutType();
const selectedFiles = useSelectedFiles();

const computedClass = computed(() => {
  return layoutType.value === "grid"
    ? "files__list--grid"
    : "files__list--list";
});

const {
  data: fileList,
  refresh,
  error: fileListError,
} = await useFetch<FileObject[]>(`/api/files`, {
  query: { key: sortColumn, order: sortOrder },
});

const updateList = () => {
  refresh();
};
</script>

<template>
  <section class="files">
    <BaseLoader v-if="!fileList" />
    <ErrorMessage
      v-else-if="fileListError"
      title="Something went wrong"
      description="We are sorry, but your files cannot be displayed at the moment."
    />
    <template v-else>
      <div class="files__menu">
        <MultipleFilesMenu v-if="selectedFiles" />
        <LayoutSwitcher />
        <SortFileList @set-sort-options="updateList" />
      </div>
      <div class="files__list" :class="computedClass">
        <StorageFileListItem
          v-for="file in fileList"
          :key="file.id"
          :file="file"
          @update-file-list="updateList"
        />
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.files__menu {
  padding: 0 2rem 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}
.files__list {
  overflow-y: scroll;
  height: calc(100vh - 230px);
  padding: 0 1rem 1rem 0;
  @include mediumScreen {
    height: calc(100vh - 222px);
  }
}

.files__list--grid {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr;
  justify-items: center;
  gap: 1.5rem;
  @include xsmallScreen {
  }
  @include smallScreen {
    grid-template-columns: 1fr 1fr;
  }
  @include mediumScreen {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @include largeScreen {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @include xlargeScreen {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @include xxlargeScreen {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
</style>
