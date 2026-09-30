// utils/fileTypes.ts
export const FILE_TYPES = [
  "image",
  "video",
  "docx",
  "xlsx",
  "pdf",
  "other",
] as const;

export type FileType = (typeof FILE_TYPES)[number];
