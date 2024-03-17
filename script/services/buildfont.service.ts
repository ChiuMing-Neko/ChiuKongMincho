import path from "path";
import { runPythonTerminal } from "@/utils/python.util";
import { getFontname } from "@/utils/fontinfo.util";
import { masterDir } from "@/utils/paths.util";

class BuildFontService {
  public static async buildFontDev() {
    // Placeholder for fast generate dev font
    const vfDir = path.resolve(masterDir, "vf");
    const fontname = getFontname();
    const weights = ["EL", "H"];
    const buildVFBasePromises = weights.map(async (weight) => {
      const command = [
        "makeotf",
        `-f ${fontname}-${weight}.VF.pfa`,
        "-omitMacNames",
        `-ff ${fontname}.${weight}.fea`,
        `-mf ${path.resolve(masterDir, "FontMenuNameDB.VF")}`,
        "-r -nS -cs 1",
        `-ch ${path.resolve(masterDir, `${fontname}CL.cmap`)}`,
        `-ci ${path.resolve(masterDir, `${fontname}_sequences.txt`)}`,
        `-o ${path.resolve(vfDir, `${fontname}VF-${weight}-Master.otf`)}`,
      ];
      await runPythonTerminal(command, { workDir: vfDir });
    });
    await Promise.all(buildVFBasePromises);

    // Build dev VF font
    const buildVFCommand = [
      "buildcff2vf -c -d",
      `${fontname}.designspace`,
    ];
    await runPythonTerminal(buildVFCommand, { workDir: vfDir });
  }

  public static buildPresetFromScratch() {
    //
  }

  public static buildVariableFontFromMaster() {
    //
  }

  public static buildStaticFontFromMaster() {
    //
  }

  public static buildFullFontFromMaster() {
    //
  }
}

export default BuildFontService;
