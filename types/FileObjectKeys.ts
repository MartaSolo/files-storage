import type { FileObject, FileMetadata } from "@supabase/storage-js";

export type FileObjectKeys = keyof FileObject;

export type FileObjectMetadataKeys = keyof Pick<
  FileMetadata,
  "mimetype" | "size"
>;
