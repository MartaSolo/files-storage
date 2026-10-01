import type { ConcreteComponent } from "vue";

export type FileActionId =
  "copyLink" | "copyFile" | "downloadFile" | "deleteFile" | "renameFile";

export interface FileActions {
  id: FileActionId;
  label: string;
  svg: string | ConcreteComponent;
}
