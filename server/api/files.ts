import type { FileObject } from "@supabase/storage-js";
import type { FilesQueryParams } from "~~/types/FilesQueryParams";
import { serverSupabaseClient } from "#supabase/server";
import { getSortType } from "@/utils/helpers/getSortTypes";
import type { SortOrder } from "@/types/SortOrder";
import { sortValueGetters } from "@/types/SortOptions";
import type { SortColumn } from "@/types/SortOptions";

const MB_TO_BYTES = 1000000;

/**
 * Filters the list of files based on provided query parameters.
 * @param files - Array of FileObject to filter
 * @param filters - Filter parameters
 * @returns Filtered array of FileObject
 */
const filterFiles = (
  files: FileObject[],
  filters: Partial<FilesQueryParams>
): FileObject[] => {
  const { name, types, minSize, maxSize, dates } = filters;

  return files.filter((file) => {
    const fileMetadata = file.metadata || null;
    const fileName = file.name.toLowerCase();
    const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".");

    // Name filter - early return if name doesn't match
    if (name && !fileNameWithoutExtension.includes(name.toLowerCase())) {
      return false;
    }

    // Type filter
    if (types) {
      const typesArray = types.split(",");
      const fileType = fileMetadata?.mimetype.split("/")[0] || "";
      if (!typesArray.includes(fileType)) return false;
    }

    // Size filters
    const fileSize = fileMetadata?.size || 0;
    if (minSize && fileSize < minSize * MB_TO_BYTES) return false;
    if (maxSize && fileSize > maxSize * MB_TO_BYTES) return false;

    // Date filters
    if (dates) {
      const dateValues = dates.split(",");
      if (dateValues.length !== 2) return false;
      const [minDate, maxDate] = dateValues.map((date) => new Date(date)) as [
        Date,
        Date,
      ];

      if (!file.created_at) return false;
      const fileDate = new Date(file.created_at);

      if (fileDate < minDate || fileDate > maxDate) return false;
    }

    return true;
  });
};

/**
 * Sorts the list of files based on the given key and order.
 * @param files - Array of FileObject to sort
 * @param key - Key to sort by
 * @param order - Sort order (asc/desc)
 * @returns Sorted array of FileObject
 */
const sortFiles = (
  files: FileObject[],
  key: SortColumn,
  order: SortOrder
): FileObject[] => {
  const getValue = sortValueGetters[key];
  const direction = order === "asc" ? 1 : -1;

  return [...files].sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1; // empty (eg. folders) at the end
    if (valueB == null) return -1;

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * direction;
    }
    if (typeof valueA === "number" && typeof valueB === "number") {
      return (valueA - valueB) * direction;
    }
    return 0;
  });
};

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const query = getQuery(event) as unknown as FilesQueryParams;

  const { key, order, name, types, minSize, maxSize, dates, storage } = query;
  const storageObject = JSON.parse(storage.toString());

  // Fetch data from Supabase
  const { data: files, error } = await client.storage
    .from(storageObject.bucket)
    .list(storageObject.folder, { limit: 100, offset: 0 });

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }

  if (!files?.length) {
    return { files: [], fileTypes: [] };
  }

  // Get file types
  const fileTypes = getSortType(files);

  // Apply filtering & sorting
  const filteredFiles = filterFiles(files, {
    name,
    types,
    minSize,
    maxSize,
    dates,
  });

  const sortedFiles = sortFiles(filteredFiles, key, order);

  return { files: sortedFiles, fileTypes };
});
