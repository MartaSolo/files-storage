import { FileObject } from "@supabase/storage-js";
import { serverSupabaseClient } from "#supabase/server";
import { getSortType } from "@/utils/helpers/getSortTypes";
import { TypesQueryParams } from "~~/types/TypesQueryParams";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const query = getQuery(event);

  const { storage } = query as unknown as TypesQueryParams;

  const storageObject = JSON.parse(storage.toString());

  let files: FileObject[];

  const { data, error } = await client.storage
    .from(storageObject.bucket)
    .list(storageObject.folder, {
      limit: 100,
      offset: 0,
    });
  if (error) throw error;

  files = data;

  const fileTypes = getSortType(undefined, files);

  return fileTypes;
});
