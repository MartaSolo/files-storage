import type { FileObject } from "@supabase/storage-js";

/**
 * FileObject's own `metadata` field is typed as a full FileMetadata object
 * (or null), not a partial one. This type relaxes the object case to
 * Partial, so tests can override a single metadata field (e.g. mimetype)
 * without TypeScript demanding every other metadata property too.
 * `null` is still allowed as-is, to simulate a folder entry (real Supabase
 * responses use `metadata: null` for folders, never a missing mimetype).
 */
type FileObjectOverrides = Partial<Omit<FileObject, "metadata">> & {
  metadata?: Partial<NonNullable<FileObject["metadata"]>> | null;
};

/**
 * Default metadata used by mockFileObject. Exported separately in case
 * a test needs to reference the base shape directly (rare, usually you
 * won't need this, mockFileObject already merges overrides for you).
 */
export const mockFileMetadata = {
  cacheControl: "max-age=3600",
  contentLength: 1367242,
  eTag: '"66353e8a5fdba11d03e32282ede60a13"',
  httpStatusCode: 200,
  lastModified: "2026-07-14T15:21:58.000Z",
  mimetype: "image/jpeg",
  size: 1367242,
};

/**
 * Creates a single mock FileObject with sensible defaults.
 *
 * Use this whenever a test needs one FileObject and only cares about
 * a specific field or two. Pass an `overrides` object to change just
 * the fields relevant to your test case; everything else falls back
 * to the defaults below.
 *
 * `metadata` is merged (not replaced): if you only override
 * `metadata.mimetype`, every other metadata field still comes from
 * mockFileMetadata, no need to spread it yourself. Pass `metadata: null`
 * explicitly to simulate a folder entry, real files always have metadata.
 *
 * @example
 * // Default mock file
 * const file = mockFileObject();
 *
 * @example
 * // Override a top-level field
 * const file = mockFileObject({ name: "invoice.pdf" });
 *
 * @example
 * // Override just one metadata field, rest of metadata stays default
 * const file = mockFileObject({ metadata: { mimetype: "application/pdf" } });
 *
 * @example
 * // Simulate a folder entry (real API sends metadata: null, never a
 * // missing mimetype inside an existing metadata object)
 * const folder = mockFileObject({ metadata: null });
 */
export function mockFileObject(
  overrides: FileObjectOverrides = {}
): FileObject {
  const metadata =
    overrides.metadata === null
      ? null
      : { ...mockFileMetadata, ...overrides.metadata };

  return {
    name: "test-file.pdf",
    id: "mock-id",
    updated_at: "2026-01-01T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    last_accessed_at: "2026-01-01T00:00:00Z",
    ...overrides,
    metadata,
  };
}

/**
 * Creates an array of `count` mock FileObjects, all sharing the same
 * overrides (if provided). Each file still gets a unique `name` and `id`
 * (test-file-1.pdf, test-file-2.pdf, ...) so they don't collide.
 *
 * Use this when a test just needs "N generic files" and doesn't care
 * about differences between them, e.g. testing pagination or a count.
 *
 * @example
 * // 3 generic files with unique names/ids
 * const files = mockFileObjectList(3);
 *
 * @example
 * // 3 files, all sharing the same metadata override
 * const files = mockFileObjectList(3, { metadata: { size: 100 } });
 */
export function mockFileObjectList(
  count: number,
  overrides: FileObjectOverrides = {}
): FileObject[] {
  return Array.from({ length: count }, (_, i) =>
    mockFileObject({
      name: `test-file-${i + 1}.pdf`,
      id: `mock-id-${i + 1}`,
      ...overrides,
    })
  );
}

/**
 * Creates an array of mock FileObjects from a list of per-item overrides,
 * one entry per FileObject. Unlike mockFileObjectList, each item can have
 * its own distinct fields; anything you don't specify still falls back to
 * the base mockFileObject defaults.
 *
 * Use this when a test needs files that differ from each other in a
 * meaningful way, e.g. testing sorting, filtering, or search logic.
 *
 * @example
 * // Files with different names and created_at dates, for sort testing
 * const files = mockFileObjectVariants([
 *   { name: "b.pdf", created_at: "2026-01-02T00:00:00Z" },
 *   { name: "a.pdf", created_at: "2026-01-01T00:00:00Z" },
 *   { name: "c.pdf", created_at: "2026-01-03T00:00:00Z" },
 * ]);
 *
 * @example
 * // Files that only differ by mimetype, rest of metadata stays default
 * const files = mockFileObjectVariants([
 *   { name: "b.pdf", metadata: { mimetype: "image/jpeg" } },
 *   { name: "a.pdf", metadata: { mimetype: "application/pdf" } },
 *   { name: "c.pdf", metadata: { mimetype: "image/png" } },
 * ]);
 */
export function mockFileObjectVariants(
  overridesList: FileObjectOverrides[]
): FileObject[] {
  return overridesList.map((overrides, i) =>
    mockFileObject({
      name: `test-file-${i + 1}.pdf`,
      id: `mock-id-${i + 1}`,
      ...overrides,
    })
  );
}
