import { getCopyName } from "@/utils/helpers/getCopyName";

describe("getCopyName", () => {
  it.each([
    {
      description: "adds _(1) when no copies exist",
      fileName: "beach.jpg",
      existing: ["report.pdf", "beach.jpg", "file.xlsx"],
      expected: "beach_(1).jpg",
    },
    {
      description: "adds _(1) when the list is empty",
      fileName: "beach.jpg",
      existing: [],
      expected: "beach_(1).jpg",
    },
    {
      description: "continues numbering when copying the original",
      fileName: "beach.jpg",
      existing: ["beach_(1).jpg", "beach_(2).jpg", "beach.jpg"],
      expected: "beach_(3).jpg",
    },
    {
      description: "continues numbering when copying a copy",
      fileName: "beach_(2).jpg",
      existing: ["beach_(1).jpg", "beach_(2).jpg", "beach.jpg"],
      expected: "beach_(3).jpg",
    },
    {
      description: "uses the highest number when there are gaps",
      fileName: "beach.jpg",
      existing: ["beach.jpg", "beach_(5).jpg", "beach_(1).jpg"],
      expected: "beach_(6).jpg",
    },
    {
      description: "compares copy numbers numerically",
      fileName: "beach.jpg",
      existing: ["beach.jpg", "beach_(9).jpg", "beach_(10).jpg"],
      expected: "beach_(11).jpg",
    },
    {
      description: "ignores copies with a different extension",
      fileName: "beach.pdf",
      existing: ["beach_(1).jpg", "beach.pdf", "beach.jpg"],
      expected: "beach_(1).pdf",
    },
    {
      description: "ignores files with a different base name",
      fileName: "beach.jpg",
      existing: ["beach.jpg", "beachball_(3).jpg", "my_beach_(2).jpg"],
      expected: "beach_(1).jpg",
    },
    {
      description: "works for files without an extension",
      fileName: "README",
      existing: ["README", "README_(1)"],
      expected: "README_(2)",
    },
    {
      description: "treats a non-numeric suffix as part of the name",
      fileName: "beach_(abc).jpg",
      existing: ["beach_(abc).jpg", "beach.pdf", "beach_(1).jpg"],
      expected: "beach_(abc)_(1).jpg",
    },
    {
      description: "treats a zero suffix as part of the name",
      fileName: "beach_(0).jpg",
      existing: ["beach_(0).jpg"],
      expected: "beach_(0)_(1).jpg",
    },
  ])("$description", ({ fileName, existing, expected }) => {
    expect(getCopyName(fileName, existing)).toBe(expected);
  });

  it("does not modify the list of existing names", () => {
    const existing = ["beach.jpg", "beach_(1).jpg"];

    getCopyName("beach.jpg", existing);

    expect(existing).toEqual(["beach.jpg", "beach_(1).jpg"]);
  });
});
