import { FileObject } from "@supabase/storage-js";

export type FileObjectKeys = keyof FileObject;
export type FileObjectMetadataKeys = keyof FileObject["metadata"];
