import { FileObject } from "@supabase/storage-js";

export type FileObjectKey = keyof FileObject;
export type FileObjectMetadataKey = keyof FileObject["metadata"];
