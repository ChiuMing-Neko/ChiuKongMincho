import fontConfig from "../../fontconfig.json";

export const getFontname = () => fontConfig.fontname ?? "";

export const getFontFullname = () => fontConfig.fontFullname ?? "";

export const getFontVersion = () => fontConfig.fontVersion ?? "";

export const getFontVariants = () => {
  const variants = fontConfig.fontVariants;
  if (!variants.length) {
    return [""];
  }
  return variants;
};

export const getFontSourceDataName = () => fontConfig.fontDataName;

export const getFontSourceDirName = () => fontConfig.sourceDirName;

export const getFontRefSourceDirName = () => fontConfig.refSourceDirName;

export const getFontRawSourceNames = () => fontConfig.sourceRawFontNames;

export const getRefFontRawSourceNames = () => fontConfig.refSourceRawFontNames;

export const getRefFontMasterFontNames = () => fontConfig.refSourceMasterFontNames;
