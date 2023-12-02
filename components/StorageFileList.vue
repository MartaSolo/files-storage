<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import { FilterParams } from "@/types/FilterParams";
import { QueryParams } from "@/types/QueryParams";
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();
const layoutType = useLayoutType();
const selectedFiles = useSelectedFiles();
const { storage } = useStorage();

const filters = ref<FilterParams>({
  name: "",
  types: [],
  sizeMin: 0,
  sizeMax: MAX_FILE_SIZE_MB,
  dates: [],
});

const computedClass = computed(() => {
  return layoutType.value === "grid"
    ? "files__list--grid"
    : "files__list--list";
});

const queryParameters = computed(() => {
  const queryObject: QueryParams = {
    key: sortColumn.value,
    order: sortOrder.value,
    storage: storage.value,
  };
  if (filters.value.name) {
    queryObject.name = filters.value.name;
  }
  if (filters.value.types?.length) {
    queryObject.types = filters.value.types.join(",");
  }
  if (filters.value.sizeMin) {
    queryObject.minSize = filters.value.sizeMin;
  }
  if (filters.value.sizeMax && filters.value.sizeMax < 5) {
    queryObject.maxSize = filters.value.sizeMax;
  }
  if (filters.value.dates?.length) {
    queryObject.dates = filters.value.dates.join(",");
  }
  return queryObject;
});

const {
  data: fileList,
  refresh,
  error: fileListError,
} = await useFetch<FileObject[]>(`/api/files`, {
  query: queryParameters,
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
        <FileFilters
          v-model="filters"
          class="files__menu--filters"
          :file-list="fileList"
          @set-filters-options="updateList"
        />
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
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "multiple"
    "sort";
  gap: 1rem;
  justify-items: center;
  @include smallScreen {
    grid-template-columns: 1fr 40px;
    grid-template-rows: auto auto;
    grid-template-areas:
      "multiple filters"
      "sort switcher";
    justify-items: start;
  }
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
  display: none;
  @include smallScreen {
    display: block;
    grid-area: filters;
    justify-self: center;
    align-self: center;
  }
}

.files__menu--sort {
  grid-area: sort;
  align-self: center;
}

.files__menu--switcher {
  @include smallScreen {
    grid-area: switcher;
    align-self: center;
  }
}

.files__list {
  overflow-y: auto;
  height: calc(100vh - 230px);
  padding: 0 1rem 3rem 0;
  @include mediumScreen {
    height: calc(100vh - 222px);
    padding: 0 1rem 1rem 0;
  }
}

.files__list--grid {
  display: grid;
  grid-template-rows: 200px;
  grid-template-columns: 1fr;
  justify-items: center;
  gap: 1.5rem;
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

<style lang="scss">
.button .files__menu--switcher {
  display: none;
  @include smallScreen {
    display: flex;
  }
}
</style>
