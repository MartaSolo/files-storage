import { FileObject } from "@supabase/storage-js";
import { FilesQueryParams } from "~~/types/FilesQueryParams";
import { serverSupabaseClient } from "#supabase/server";
import { getSortType } from "@/utils/helpers/getSortTypes";
import type { SortOrder } from "@/types/SortOrder";
import type {
  FileObjectKey,
  FileObjectMetadataKey,
} from "@/types/FileObjectKeys";

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
    const fileMetadata = file.metadata || {};
    const fileName = file.name.toLowerCase();
    const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".");

    // Name filter - early return if name doesn't match
    if (name && !fileNameWithoutExtension.includes(name.toLowerCase())) {
      return false;
    }

    // Type filter
    if (types) {
      const typesArray = types.split(",");
      const fileType = fileMetadata.mimetype?.split("/")[0];
      if (!typesArray.includes(fileType)) return false;
    }

    // Size filters
    const fileSize = fileMetadata.size || 0;
    if (minSize && fileSize < minSize * MB_TO_BYTES) return false;
    if (maxSize && fileSize > maxSize * MB_TO_BYTES) return false;

    // Date filters
    if (dates) {
      const [minDate, maxDate] = dates.split(",").map((date) => new Date(date));
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
  key: FileObjectKey | FileObjectMetadataKey,
  order: SortOrder
): FileObject[] => {
  const sortOrder = order === "asc" ? 1 : -1;

  return [...files].sort((e1, e2) => {
    const a =
      key in e1
        ? e1[key as FileObjectKey]
        : e1.metadata[key as FileObjectMetadataKey];
    const b =
      key in e2
        ? e2[key as FileObjectKey]
        : e2.metadata[key as FileObjectMetadataKey];

    if (key === "name") {
      return sortOrder === 1 ? a.localeCompare(b) : b.localeCompare(a);
    }

    return (a < b ? -1 : a > b ? 1 : 0) * sortOrder;
  });
};

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);
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
  const fileTypes = getSortType(undefined, files);

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
