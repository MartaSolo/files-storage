import { FileObject } from "@supabase/storage-js";

export interface FilesFetchedObject {
  files: FileObject[];
  fileTypes: string[];
}
