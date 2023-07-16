import { FileObject } from "@supabase/storage-js";
import { FilterParams } from "@/types/FilterParams";

export const useFilterFiles = () => {
  const filter = (files: FileObject[], filters: FilterParams) => {
    if (filters.name) {
      const nameFiltered = files.filter((file) => {
        const fileName = useFileName(file.name);
        return fileName.name.toLowerCase().includes(filters.name.toLowerCase());
      });
      files = nameFiltered;
    }

    if (filters.types.length > 0) {
      const typeFiltered = files.filter((file) => {
        const fileType = useSortType(file);
        return filters.types.includes(fileType.type.toString());
      });
      files = typeFiltered;
    }

    if (filters.sizeMin || filters.sizeMax) {
      const minSizeBytes = filters.sizeMin * 1000000;
      const maxSizeBytes = filters.sizeMax * 1000000;
      const sizeFiltered = files.filter((file) => {
        return (
          file.metadata.size >= minSizeBytes &&
          file.metadata.size <= maxSizeBytes
        );
      });
      files = sizeFiltered;
    }

    if (Array.isArray(filters.dates) && filters.dates.length === 2) {
      const minDate = new Date(filters.dates[0]);
      const maxDate = new Date(filters.dates[1]);

      const dateFiltered = files.filter((file) => {
        return (
          new Date(file.created_at) >= minDate &&
          new Date(file.created_at) <= maxDate
        );
      });
      files = dateFiltered;
    }

    return files;
  };

  return { filter };
};
