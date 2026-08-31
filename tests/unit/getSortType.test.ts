import { getSortType } from "@/utils/helpers/getSortTypes";
import {
  mockFileObject,
  mockFileObjectVariants,
} from "../fixtures/supabase/fileObject";

describe("test getSortType", () => {
  it("for a single file it returns the file type in the array", () => {
    const file = mockFileObject();
    expect(getSortType(file)).toStrictEqual(["image"]);
  });

  it("for a folder (metadata is null) it returns an empty array", () => {
    const folder = mockFileObject({ metadata: null });
    expect(getSortType(folder)).toStrictEqual([]);
  });

  it("for multiple files it returns the array of unique types", () => {
    const files = mockFileObjectVariants([
      { name: "b.pdf", metadata: { mimetype: "image/jpeg" } },
      { name: "a.pdf", metadata: { mimetype: "application/pdf" } },
      { name: "c.pdf", metadata: { mimetype: "image/png" } },
    ]);

    expect(getSortType(files)).toStrictEqual(["image", "application"]);
  });

  it("for an empty files array it returns an empty array", () => {
    expect(getSortType([])).toStrictEqual([]);
  });
});
