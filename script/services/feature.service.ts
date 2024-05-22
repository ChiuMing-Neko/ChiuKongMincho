import consola from "consola";
import path from "path";
import fs from "fs/promises";
import { masterDir } from "@/utils/paths.util";
import FontDataInterface from "@/utils/fontdata.interface";
import { getFontVariants } from "@/utils/fontinfo.util";

class FeatureService {
  public static async constructVariantsTable(variant: string) {
    const fontData = await FontDataInterface.getInstance();
    const fontVariants = getFontVariants().filter((v) => v !== variant);
    const { mappingData } = fontData;
    const substitionMap: Map<string, string[]> = new Map();

    mappingData.forEach((mapInfo) => {
      for (const localVariant of fontVariants) {
        if (mapInfo[localVariant] !== mapInfo[variant]) {
          const substitutionSet = substitionMap.get(localVariant) ?? [];
          const syntax = `substitute \\${mapInfo[variant]} by \\${mapInfo[localVariant]};`;
          substitutionSet.push(syntax);
          substitionMap.set(localVariant, substitutionSet);
        }
      }
    });

    return substitionMap;
  }

  public static convertToGSUBSyntax(lookupName: string, substitutionSet: string[]) {
    const contents = substitutionSet.map((syntax) => `  ${syntax}`).join("\n");
    return `lookup ${lookupName} useExtension {\n${contents}\n} ${lookupName};`;
  }

  /** Dev ONLY */
  public static async writeDevGSUBfile(variant: string) {
    const filePath = path.resolve(masterDir, "vf", "DEV_GSUB.fea");
    const lineStrings: string[] = [];
    const substitionMap = await FeatureService.constructVariantsTable(variant);
    const fontVariants = getFontVariants().filter((v) => v !== variant);

    fontVariants.forEach((localVariant) => {
      if (!substitionMap.has(localVariant)) {
        throw new Error("No substitution set found for variant");
      }
      const featureName = (() => {
        switch (localVariant) {
          case "CL":
            return "ss01";
          case "MN":
            return "ss02";
          case "JP":
            return "ss03";
          default:
            return "";
        }
      })();
      const substitutionSet = substitionMap.get(localVariant)!;
      const lookupName = `${variant}_to_${localVariant}`;
      const lookupSyntax = this.convertToGSUBSyntax(lookupName, substitutionSet);
      lineStrings.push(lookupSyntax);
      lineStrings.push("\n");
      lineStrings.push(`feature ${featureName} {\n  lookup ${lookupName};\n} ${featureName};`);
      lineStrings.push("\n");
    });

    const writeString = lineStrings.join("\n");
    await fs.writeFile(filePath, writeString, "utf-8");

    consola.info(`Wrote GSUB file for ${variant}`);
  }
}

export default FeatureService;
