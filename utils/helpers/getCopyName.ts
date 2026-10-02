import { splitFileName } from "@/utils/helpers/splitFileName";

export const parseCopyNameAndNumber = (name: string) => {
  const markerIndex = name.indexOf("_(");
  const endsWithBracket = name.endsWith(")");

  if (markerIndex === -1 && !endsWithBracket) {
    return { base: name, copyNumber: 0 };
  }

  const copyNumber = Number(name.slice(markerIndex + 2, -1));

  if (!Number.isInteger(copyNumber) || copyNumber < 1) {
    return { base: name, copyNumber: 0 };
  }

  return { base: name.slice(0, markerIndex), copyNumber };
};

export const getCopyName = (fileName: string, existingNames: string[]) => {
  const { name, extension } = splitFileName(fileName);
  const { base } = parseCopyNameAndNumber(name);

  let highestCopyNumber = 0;

  for (const existingName of existingNames) {
    const parts = splitFileName(existingName);
    const copy = parseCopyNameAndNumber(parts.name);
    const isSameFamily = copy.base === base && parts.extension === extension;

    if (isSameFamily) {
      highestCopyNumber = Math.max(highestCopyNumber, copy.copyNumber);
    }
  }

  return `${base}_(${highestCopyNumber + 1})${extension}`;
};
