import { splitFileName } from "@/utils/helpers/splitFileName";

describe("splitFileName", () => {
  it.each([
    { fileName: "beach.jpg", name: "beach", extension: ".jpg" },
    { fileName: "beach_(2).jpg", name: "beach_(2)", extension: ".jpg" },
    { fileName: "archive.tar.gz", name: "archive.tar", extension: ".gz" },
  ])(
    "splits $fileName into name and extension",
    ({ fileName, name, extension }) => {
      expect(splitFileName(fileName)).toStrictEqual({ name, extension });
    }
  );

  it("returns an empty extension when there is no dot", () => {
    expect(splitFileName("README")).toStrictEqual({
      name: "README",
      extension: "",
    });
  });

  it("treats a leading dot as part of the name, not an extension", () => {
    expect(splitFileName(".env")).toStrictEqual({
      name: ".env",
      extension: "",
    });
  });
});
