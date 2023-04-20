import { FileObject } from "@supabase/storage-js";
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

  // sort fetched data
  data.sort((e1: FileObject, e2: FileObject) => {
    const a = e1[query.key] ? e1[query.key] : e1.metadata[query.key];
    const b = e2[query.key] ? e2[query.key] : e2.metadata[query.key];
    const sortOrder = query.order === "asc" ? 1 : -1;
    if (query.key === "name") {
      return sortOrder === 1 ? a.localeCompare(b) : b.localeCompare(a);
    }
    return a < b ? -sortOrder : a > b ? sortOrder : 0;
  });

  return data;
});
