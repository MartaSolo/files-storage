import { FileObject } from "@supabase/storage-js";
import { FileObjectKeys } from "@/types/FileObjectKeys";
import { SortOrder } from "@/types/SortOrder";
import { QueryParams } from "@/types/QueryParams";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  let files: FileObject[];

  // fetch data from supabase
  const { data, error } = await client.storage.from("files").list("public", {
    limit: 100,
    offset: 0,
  });
  if (error) throw error;

  files = data;

  const query = getQuery(event);

  const { key, order, name, types, minSize, maxSize, dates } = query as {
    key: FileObjectKeys;
    order: SortOrder;
    name: string;
    types: string;
    minSize: number;
    maxSize: number;
    dates: string;
  };

  // sort fetched data
  files.sort((e1: FileObject, e2: FileObject) => {
    const a = e1[key] ? e1[key] : e1.metadata[key];
    const b = e2[key] ? e2[key] : e2.metadata[key];
    const sortOrder = order === "asc" ? 1 : -1;
    if (key === "name") {
      return sortOrder === 1 ? a.localeCompare(b) : b.localeCompare(a);
    }
    return a < b ? -sortOrder : a > b ? sortOrder : 0;
  });

  // filter fetched data

  if (name) {
    const nameFiltered = files.filter((file) => {
      const indexToSplitFileName = file.name.lastIndexOf(".");
      const fileName = file.name.substring(0, indexToSplitFileName);

      return fileName.toLowerCase().includes(name.toLowerCase());
    });
    files = nameFiltered;
  }

  if (types) {
    const typesArray = types.split(",");

    const typesFiltered = files.filter((file) => {
      return typesArray.some((type: string) => {
        const fileType = file.metadata.mimetype.split("/")[0];
        return fileType === type;
      });
    });
    files = typesFiltered;
  }

  if (minSize || maxSize) {
    const minSizeBytes = minSize * 1000000;
    const maxSizeBytes = maxSize * 1000000;
    const sizeFiltered = files.filter((file) => {
      return (
        file.metadata.size >= minSizeBytes && file.metadata.size <= maxSizeBytes
      );
    });
    files = sizeFiltered;
  }

  if (dates) {
    const datesArray = dates.split(",");
    const minDate = new Date(datesArray[0]);
    const maxDate = new Date(datesArray[1]);

    const datesFiltered = files.filter((file) => {
      return (
        new Date(file.created_at) >= minDate &&
        new Date(file.created_at) <= maxDate
      );
    });
    files = datesFiltered;
  }

  return files;
});
