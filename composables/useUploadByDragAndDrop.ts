import { useSupabaseUser } from "#imports";

export const useUploadByDragAndDrop = (
  maxFileSizeMB: number,
  maxFilesNumber: number
) => {
  const client = useSupabaseClient();
  const { storage } = useStorage();
  const user = useSupabaseUser();

  const isDragActive = ref(false);
  const errorMessages = ref<string[]>([]);
  const uploadedFiles = ref<string[]>([]);
  const notUploadedFiles = ref<string[]>([]);
  const root = ref<HTMLElement | null>(null);

  const maxFileSizeBytes = computed(() => {
    return maxFileSizeMB * 1000000;
  });

  const resetState = () => {
    errorMessages.value = [];
    uploadedFiles.value = [];
    notUploadedFiles.value = [];
  };

  const handleDrag = (e: DragEvent) => {
    if (e.type === "dragenter" || e.type === "dragover") {
      isDragActive.value = true;
      resetState();
    }
    if (e.type === "dragleave") {
      isDragActive.value = false;
    }
  };

  const numberOfFilesExceeded = (
    listOfFiles: FileList | DataTransferItemList
  ) => {
    if (listOfFiles.length > maxFilesNumber) {
      errorMessages.value.push(
        `You can upload up to ${maxFilesNumber} files at a time!`
      );
      return true;
    } else {
      return false;
    }
  };

  const uploadFileToSupabase = async (file: File) => {
    const { error } = await client.storage
      .from(storage.value.bucket)
      .upload(`${storage.value.folder}/${file.name}`, file);
    if (error) {
      errorMessages.value.push(`Error: ${error?.message}`);
      notUploadedFiles.value.push(file.name);
    } else {
      uploadedFiles.value.push(file.name);
    }
  };

  const addExceededSizeErrorMessage = () => {
    errorMessages.value.push(`Error: some files have exceeded size`);
  };

  const handleDrop = async (e: DragEvent) => {
    e.stopPropagation();
    isDragActive.value = false;

    if (e.dataTransfer?.items) {
      if (numberOfFilesExceeded(e.dataTransfer.items)) return;

      const uploads = [...e.dataTransfer.items]
        .filter((item) => item.kind === "file")
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)
        .map((file) => {
          if (file.size < maxFileSizeBytes.value) {
            return uploadFileToSupabase(file);
          } else {
            addExceededSizeErrorMessage();
            notUploadedFiles.value.push(file.name);
            return Promise.resolve();
          }
        });

      await Promise.all(uploads);
    } else if (e.dataTransfer?.files) {
      if (numberOfFilesExceeded(e.dataTransfer.files)) return;

      const uploads = [...e.dataTransfer.files].map((file) => {
        if (file.size < maxFileSizeBytes.value) {
          return uploadFileToSupabase(file);
        } else {
          addExceededSizeErrorMessage();
          notUploadedFiles.value.push(file.name);
          return Promise.resolve();
        }
      });

      await Promise.all(uploads);
    }
  };

  const handleUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (!target.files || numberOfFilesExceeded(target.files)) return;

    const uploads = [...target.files].map((file) => {
      if (file.size < maxFileSizeBytes.value) {
        return uploadFileToSupabase(file);
      } else {
        addExceededSizeErrorMessage();
        notUploadedFiles.value.push(file.name);
        return Promise.resolve();
      }
    });

    await Promise.all(uploads);
  };

  const handleKeydown = (e: KeyboardEvent) => {
    const input = root.value?.querySelector("#file") as HTMLInputElement | null;
    if (e.code === "Enter") {
      resetState();
      input?.click();
    }
  };

  watch(user, resetState);

  return {
    isDragActive,
    errorMessages,
    uploadedFiles,
    notUploadedFiles,
    root,
    handleDrag,
    handleDrop,
    handleKeydown,
    resetState,
    handleUpload,
  };
};
