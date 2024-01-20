import consola from "consola";
import { existsSync } from "fs";
import fs from "fs/promises";
import { difference, isEqual } from "lodash";
import path from "path";
import {
  getFontname,
  getFontRawSourceNames,
  getFontRefSourceDirName,
  getFontSourceDirName,
  getFontVariants,
  getRefFontMasterFontNames,
  getRefFontRawSourceNames,
} from "@/utils/fontinfo.util";
import { dependenciesDir, masterDir, pythonDir, sourcesDir, tempDir } from "@/utils/paths.util";
import { getPythonAlias, runPythonTerminal } from "@/utils/python.util";
import FontDataInterface from "@/utils/fontdata.interface";

class BuildMasterService {
  public static async validateGlyphFromSource(targetSrcDirName?: string, filenames?: string[]) {
    try {
      const fontdata = await FontDataInterface.getInstance();
      const sourceDirName = targetSrcDirName ?? getFontSourceDirName();
      const sourceFileNames = filenames ?? getFontRawSourceNames();
      const glyphlistsPromises = sourceFileNames.map((filename) => {
        const command = [
          getPythonAlias(),
          "sourcefiles.py",
          "--glyphlist",
          `--filepath ${path.resolve(sourcesDir, sourceDirName)}`,
          `--filename ${filename}`,
        ];
        return runPythonTerminal(command, { workDir: pythonDir, stdio: "pipe" });
      });
      const glyphlists = await Promise.all(glyphlistsPromises);
      // Validate the source and warn the potential problem in source
      consola.info("Start to validate raw font source...");
      if (isEqual(glyphlists[0], glyphlists[1])) {
        const getSourceCIDs = (glyphlist: string[]) => (
          glyphlist
            .filter((cidValue) => cidValue !== ".notdef")
            .map((cidValue) => {
              const cidString = cidValue.match(/\d+/g)?.join("");
              if (!cidString) throw new Error("Not CID");
              return parseInt(cidString, 10);
            })
            .sort((a, b) => a - b)
        );
        const extraLightSourceCIDs = getSourceCIDs(glyphlists[0]);
        const heavySourceCIDs = getSourceCIDs(glyphlists[1]);
        const fontdataCIDs = Array.from(fontdata.newGlyphInfoData.keys()).sort();
        const compareExtraLightResult = isEqual(extraLightSourceCIDs, fontdataCIDs);
        const compareHeavyResult = isEqual(heavySourceCIDs, fontdataCIDs);
        if (!compareExtraLightResult || !compareHeavyResult) {
          const diffArray = [
            ...difference(extraLightSourceCIDs, fontdataCIDs),
            ...difference(heavySourceCIDs, fontdataCIDs),
          ];
          consola.warn(`CID Mismatched. Please check: [${diffArray.join(", ")}]`);
        } else {
          consola.info("Source file pass validation");
        }
      } else {
        const diffArray = difference(glyphlists[0], glyphlists[1]);
        consola.error(`Mismatch cid [${diffArray.join(", ")}]`);
        throw new Error("Type Mismatch");
      }
    } catch (err) {
      consola.error(err);
      throw err;
    }
  }

  public static async constructFontVariableMasterInstance() {
    const fontname = getFontname();
    const fontdata = await FontDataInterface.getInstance();
    const sourceDirName = getFontSourceDirName();
    const refSourceDirName = getFontRefSourceDirName();
    const sourceRawNames = getFontRawSourceNames();
    const refSourceRawNames = getRefFontRawSourceNames();
    const cidLayerNames = getRefFontMasterFontNames();
    const newGlyphInfo = fontdata.newGlyphInfoData;

    const prepareVFMasterPromises = [
      BuildMasterService.prepareFontMasters({
        source: path.resolve(sourcesDir, sourceDirName, sourceRawNames[0]),
        target: path.resolve(sourcesDir, refSourceDirName, refSourceRawNames[0]),
        destination: path.resolve(masterDir, "vf", `${fontname}-EL.VF.pfa`),
        cidLayerName: cidLayerNames[0],
        operationSignature: "EL",
        replaceGlyph: Array.from(newGlyphInfo.keys()),
      }),
      BuildMasterService.prepareFontMasters({
        source: path.resolve(sourcesDir, sourceDirName, sourceRawNames[1]),
        target: path.resolve(sourcesDir, refSourceDirName, refSourceRawNames[1]),
        destination: path.resolve(masterDir, "vf", `${fontname}-H.VF.pfa`),
        cidLayerName: cidLayerNames[1],
        operationSignature: "H",
        replaceGlyph: Array.from(newGlyphInfo.keys()),
      }),
    ];
    await Promise.all(prepareVFMasterPromises);
  }

  public static async constructFontStaticMasterInstance() {
    const fontdata = await FontDataInterface.getInstance();
    // TODO
  }

  public static async constructMappingFile() {
    const fontdata = await FontDataInterface.getInstance();
    const fontVariants = getFontVariants();

    // Write raw files
    await fontdata.writeMappingData(fontVariants);

    // Prepare beforce execute
    const fontSourceDirName = getFontSourceDirName();
    if (!fontSourceDirName) throw new Error();
    const fontSourceDir = path.resolve(sourcesDir, fontSourceDirName);
    const fontSourceFiles = await fs.readdir(fontSourceDir);
    const mappingFiles = fontSourceFiles.filter((filename) => filename.endsWith(".cmap"));

    // Run
    const operationPromises = mappingFiles.map(async (filename) => {
      // Resolve path
      const sourceFilePath = path.resolve(fontSourceDir, filename);
      const destinationFilePath = path.resolve(masterDir, filename);

      // Prepare command
      const command = [
        "perl",
        "cmap-tool.pl",
        `< ${sourceFilePath} >`,
        `${destinationFilePath}`,
      ];

      // Run
      await runPythonTerminal(command, { workDir: dependenciesDir, stdio: "ignore" });
    });
    await Promise.all(operationPromises);
    consola.info("CMAP created.");

    // Clean temp files
    const dependencyFiles = await fs.readdir(dependenciesDir);
    const cleanPromises = dependencyFiles
      .filter((filename) => filename.startsWith(getFontname()))
      .map(async (filename) => {
        const filePath = path.resolve(dependenciesDir, filename);
        fs.unlink(filePath);
      });
    await Promise.all(cleanPromises);
    consola.info("Temp files cleared.");
  }

  public static async constructVariationSequenceFile() {
    const fontdata = await FontDataInterface.getInstance();
    const fontname = getFontname();
    const sourceFileDirPath = path.resolve(sourcesDir, getFontSourceDirName());
    const destinationDirPath = masterDir;

    // Write Files
    await fontdata.writeUVSData();

    // Retrieve Files and Move
    const filename = `${fontname}_sequences.txt`;
    const sourcePath = path.resolve(sourceFileDirPath, filename);
    const destinationPath = path.resolve(destinationDirPath, filename);
    await fs.copyFile(sourcePath, destinationPath);
  }

  /* Helpers */

  private static async prepareFontMasters(args: {
    /** Font file that conatains new glyphs intent to merge into master */
    source: string;
    /** Font file that will be merged */
    target: string;
    /** Final destination of prepared font files */
    destination: string;
    cidLayerName: string;
    operationSignature: string;
    replaceGlyph: number[];
    unusedGlyphs?: number[];
  }) {
    const maxBatchSize = 1000; // Make it below 8192 char limit in windows
    const {
      source,
      target,
      destination,
      cidLayerName,
      operationSignature,
      replaceGlyph,
      unusedGlyphs,
    } = args;
    const cleanMergeTarget = path.resolve(tempDir, `cleanTarget-${operationSignature}.pfa`);
    const deleteGlyphs = unusedGlyphs
      ? Array.from(new Set([...replaceGlyph, ...unusedGlyphs])).sort()
      : [...replaceGlyph].sort();

    // Create dir if temp dir did not exist
    if (!existsSync(tempDir)) {
      await fs.mkdir(tempDir, { recursive: true });
    }

    // Batch operaions to prepare clean target source
    let currentFile = target;
    let batchNumber = 0;
    for (let i = 0; i < deleteGlyphs.length; i += maxBatchSize) {
      const batch = deleteGlyphs.slice(i, i + maxBatchSize);
      const isLastBatch = i + maxBatchSize >= deleteGlyphs.length;
      const nextFile = isLastBatch
        ? cleanMergeTarget
        : path.resolve(tempDir, `temp_${operationSignature}_${batchNumber}.pfa`);
      // tx -t1 -gx {/cid} input.ps > output.ps
      const deleteCommand = [
        "tx",
        "-t1",
        "-gx",
        `${batch.map((cid) => `/${cid}`).join(",")}`,
        `${currentFile}`,
        ">",
        `${nextFile}`,
      ];
      // In order to prevent racing condition in batch operation, await in loop is a must.
      // eslint-disable-next-line no-await-in-loop
      await runPythonTerminal(deleteCommand, { workDir: tempDir, stdio: "inherit" });
      if (currentFile !== target) {
        // eslint-disable-next-line no-await-in-loop
        await fs.unlink(currentFile);
      }
      currentFile = nextFile;
      batchNumber += 1;
    }

    // Merge Font

    // Prepare mapping file
    const mappingPath = path.resolve(tempDir, `temp_${operationSignature}.mapping.txt`);
    const mappingContent = [
      `mergeFonts ${cidLayerName}`,
      "0\t.notdef",
      ...replaceGlyph.map((cid) => `${cid}\tIdentity.${cid}`),
      "",
    ].join("\n");
    await fs.writeFile(mappingPath, mappingContent, "utf-8");
    // mergeFonts font.out font.src map1.merge font1.merge
    const mergeFontCommand = [
      "mergefonts",
      destination,
      cleanMergeTarget,
      mappingPath,
      source,
    ];
    await runPythonTerminal(mergeFontCommand, { workDir: tempDir, stdio: "inherit" });

    // Clear temp files
    await Promise.all([
      fs.unlink(cleanMergeTarget),
      fs.unlink(mappingPath),
    ]);
  }
}

export default BuildMasterService;
