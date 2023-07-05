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
        <!-- v-if="selectedFiles" added to get rid of hydration errors caused by useSelectedFiles composable -->
        <MultipleFilesMenu
          v-if="selectedFiles"
          class="files__menu--multiple"
          :file-list="fileList"
          @files-action="updateList"
        />
        <FileFilters class="files__menu--filters" />
        <SortFileList
          class="files__menu--sort"
          @set-sort-options="updateList"
        />
        <LayoutSwitcher class="files__menu--switcher" />
      </div>
      <div class="files__list" :class="computedClass">
        <StorageFileListItem
          v-for="file in fileList"
          :key="file.id"
          :file="file"
          :file-list="fileList"
          @update-file-list="updateList"
        />
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.files__menu {
  padding: 0 0 1rem 0;
  display: grid;
  grid-template-columns: 1fr 40px;
  grid-template-rows: auto auto;
  grid-template-areas:
    "multiple filters"
    "sort switcher";
  gap: 1rem;
  @include mediumScreenPlus {
    grid-template-columns: 330px 1fr 300px 40px;
    grid-template-rows: auto;
    grid-template-areas: "multiple filters sort switcher";
    padding: 0 2rem 1rem 0rem;
    gap: 0.6rem;
  }
  @include largeScreen {
    padding: 0 2rem 1rem 2rem;
    gap: 1rem;
  }
}

.files__menu--multiple {
  grid-area: multiple;
}

.files__menu--filters {
  grid-area: filters;
  justify-self: center;
  align-self: center;
}
.files__menu--sort {
  grid-area: sort;
  align-self: center;
}
.files__menu--switcher {
  grid-area: switcher;
  align-self: center;
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
