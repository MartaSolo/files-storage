import { FileObject } from "@supabase/storage-js";
import { FileObjectKeys } from "~~/types/FileObjectKeys";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  // fetch data from supabase
  const { data, error } = await client.storage.from("files").list("public", {
    limit: 100,
    offset: 0,
  });
  if (error) throw error;

  const query = getQuery(event);

  const { key, order } = query as {
    key: FileObjectKeys;
    order: "asc" | "desc";
  };

  // sort fetched data
  data.sort((e1: FileObject, e2: FileObject) => {
    const a = e1[key] ? e1[key] : e1.metadata[key];
    const b = e2[key] ? e2[key] : e2.metadata[key];
    const sortOrder = order === "asc" ? 1 : -1;
    if (key === "name") {
      return sortOrder === 1 ? a.localeCompare(b) : b.localeCompare(a);
    }
    return a < b ? -sortOrder : a > b ? sortOrder : 0;
  });

  return data;
});
