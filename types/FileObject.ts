// works
export interface Metadata {
  cacheControl: string;
  contentLength: number;
  eTag: string;
  httpStatusCode: number;
  lastModified: string;
  mimetype: string;
  size: number;
}

export interface FileObject {
  created_at: string;
  id: string;
  last_accessed_at: string;
  name: string;
  updated_at: string;
  metadata: {
    [key: string]: Metadata;
  };
}

// doesn't work

// export interface Metadata {
//   cacheControl: string;
//   contentLength: number;
//   eTag: string;
//   httpStatusCode: number;
//   lastModified: string;
//   mimetype: string;
//   size: number;
// }

// export interface FileObject {
//   created_at: string;
//   id: string;
//   last_accessed_at: string;
//   name: string;
//   updated_at: string;
//   metadata: Metadata;
// }

// doesn't work

// export interface FileObject {
//   created_at: string;
//   id: string;
//   last_accessed_at: string;
//   name: string;
//   updated_at: string;
//   metadata: {
//     cacheControl: string;
//     contentLength: number;
//     eTag: string;
//     httpStatusCode: number;
//     lastModified: string;
//     mimetype: string;
//     size: number;
//   };
// }