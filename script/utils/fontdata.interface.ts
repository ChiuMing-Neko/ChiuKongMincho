import consola from "consola";
import ExcelJs from "exceljs";
import fs from "fs/promises";
import path from "path";
import {
  getFontname,
  getFontRefSourceDirName,
  getFontSourceDataName,
  getFontSourceDirName,
  getFontVariants,
  getFontVersion,
} from "./fontinfo.util";
import { hexToNumber } from "./helpers.util";
import { sourcesDir } from "./paths.util";

interface MappingInfo {
  [variantName: string]: number | undefined;
}

interface UVSInfo {
  cid: number;
  collection: string;
}

interface GlyphInfo {
  codepoint: string;
  selector?: string;
  collection?: string;
  glyphName: string;
}

class FontDataInterface {
  /* Properties */

  static #instance: FontDataInterface;
  /** @type Map<codepoint, MappingInfo> */
  #mappingData: Map<string, MappingInfo>;
  /** @type Map<codepoint, Map<selector, UVSInfo>> */
  #uvsInfoData: Map<string, Map<string, UVSInfo>>;
  /** @type Map<cid, GlyphInfo> */
  #newGlyphInfoData: Map<number, GlyphInfo>;

  /* Constructor, Initialization, and getInstance */

  private constructor() {
    this.#mappingData = new Map();
    this.#uvsInfoData = new Map();
    this.#newGlyphInfoData = new Map();
  }

  private async initialize() {
    // Output to console
    consola.info("Start to initialize and load fontdata...");

    // Initialize basic variables
    const fontSourceDirName = getFontSourceDirName();
    const fontSourceDataName = getFontSourceDataName();

    // Validate process env
    if (!fontSourceDirName || !fontSourceDataName) {
      throw new Error("Invalid Configuration");
    }

    // Get variants info
    const variants = getFontVariants();

    // Load ref source before initialize if existed
    if (getFontRefSourceDirName()) {
      await this.loadDataFromRefSource(variants);
    }

    // Initialize Path
    const dataDir = path.resolve(sourcesDir, fontSourceDirName);
    const fontDataPath = path.resolve(dataDir, `${fontSourceDataName}.xlsx`);

    // Initialize workbook
    const workbook = new ExcelJs.Workbook();
    consola.info("Open excel sheet...");
    await workbook.xlsx.readFile(fontDataPath);
    consola.info("Excel sheet is now opened.");

    // Initialize worksheet
    const mappingWorksheet = workbook.getWorksheet("Mapping");
    const uvsWorksheet = workbook.getWorksheet("UVS");
    const newGlyphWorksheet = workbook.getWorksheet("New_Glyph");

    if (!(mappingWorksheet && uvsWorksheet && newGlyphWorksheet)) {
      throw new Error("Invalid format");
    }

    // Insert Mapping Data
    this.loadMappingInfoFromWorksheet(mappingWorksheet, variants);
    // Insert UVS Data
    this.loadUVSInfoFromWorksheet(uvsWorksheet);
    // Insert New Glyph Info data
    this.loadNewGlyphInfoFromWorksheet(newGlyphWorksheet);

    // Output to console
    consola.info("fontdata interface is initialized.");
  }

  public static async getInstance() {
    if (!this.#instance) {
      this.#instance = new FontDataInterface();
      await this.#instance.initialize();
    }
    return this.#instance;
  }

  /* Getters and Setters */

  /** Return a copy of mapping data */
  public get mappingData() {
    return new Map(this.#mappingData);
  }

  /** Return a copy of uvs data */
  public get uvsInfoData() {
    return new Map(this.#uvsInfoData);
  }

  /** Return a copy of new glyphs info */
  public get newGlyphInfoData() {
    return new Map(this.#newGlyphInfoData);
  }

  /* Public Methods */

  public getSortedMappingData() {
    return FontDataInterface.sortFontDataMap(this.mappingData);
  }

  public getSortedUVSData() {
    // Sort Outer
    const sortedMap = FontDataInterface.sortFontDataMap(this.uvsInfoData);

    // Sort Inner
    sortedMap.forEach((selectorMap, codepoint) => {
      const sortedSelectorMap = FontDataInterface.sortFontDataMap(selectorMap);
      sortedMap.set(codepoint, sortedSelectorMap);
    });

    return sortedMap;
  }

  public getUnusedGlyphCIDs() {
    // Placeholder, all Ext-A and URO Han characters cid range to prevent GSUB bug in fea files
    const cidRangeInConcern = ["2445-47515"];

    // Prepare used cid set
    const usedCIDs = new Set<number>();
    this.#mappingData.forEach((mappingInfo) => {
      Object.values(mappingInfo).forEach((cid) => {
        if (cid) usedCIDs.add(cid);
      });
    });
    this.#uvsInfoData.forEach((uvsInfoMap) => {
      uvsInfoMap.forEach((uvsInfo) => {
        usedCIDs.add(uvsInfo.cid);
      });
    });
    this.#newGlyphInfoData.forEach((_glyphInfo, cid) => usedCIDs.add(cid));

    // Prepare unused cid set
    const unusedCIDs = new Set<number>();
    cidRangeInConcern.forEach((rangeInfo) => {
      const [startStr, endStr] = rangeInfo.includes("-")
        ? rangeInfo.split("-").map((value) => value.trim())
        : [rangeInfo, rangeInfo];

      const startPt = parseInt(startStr, 10);
      const endPt = parseInt(endStr, 10);

      if (Number.isNaN(startPt) || Number.isNaN(endPt)) {
        throw new Error(`Invalid range string: ${rangeInfo}`);
      }

      for (let i = startPt; i <= endPt; i += 1) {
        if (!usedCIDs.has(i)) unusedCIDs.add(i);
      }
    });

    return unusedCIDs;
  }

  public async writeMappingData(fontVariants?: string[]) {
    // Initialize required variables
    const variants = fontVariants ?? getFontVariants();
    const fontSourceDirName = getFontSourceDirName();

    // Validate Input
    if (!variants.length) {
      throw new Error("Invalid Argument.");
    }

    // Validate Env
    if (!fontSourceDirName) {
      throw new Error("Invalid Env");
    }

    // Intialize data
    const sortedMap = this.getSortedMappingData();
    const targetDir = path.resolve(sourcesDir, fontSourceDirName);
    const lines: { [variantName: string]: string[] } = {};

    // Prepare content
    sortedMap.forEach((mappingInfo, codepoint) => {
      const codepointString = `<${codepoint.padStart(8, "0")}>`;
      variants.forEach((variant) => {
        const cid = mappingInfo[variant];
        if (!cid) {
          throw new Error(`Invalid Mapping Info occurred at ${variant} of ${codepoint}`);
        }
        const variantLines = lines[variant] ?? [];
        variantLines.push(`${codepointString}\t${cid.toString()}`);
        lines[variant] = variantLines;
      });
    });

    // Write content
    const writePromises = variants.map(async (variant) => {
      // Initialize data
      const fontname = `${getFontname()}${variant}`;
      const fontversion = `${getFontVersion()}`;

      // Read Template
      const cmapTemplatePath = path.resolve(targetDir, "cmap_template.txt");
      const cmapContent = await fs.readFile(cmapTemplatePath, "utf-8");

      // Regexes
      const fontnamePlaceholderRegex = /\{FontNameContent\}/g;
      const fontversionPlaceholderRegex = /\{FontVersionContent\}/g;
      const mappingPlaceholderRegex = /([ \t]*)\{ReplaceMappingContent\}/;

      // Get indent
      const indentMatch = cmapContent.match(mappingPlaceholderRegex);
      const indent = indentMatch ? indentMatch[1] : "";

      // Prepare file content
      const mappingInfoContent = lines[variant].map((line) => `${indent}${line}`).join("\n");
      const resultContent = cmapContent
        .replace(fontnamePlaceholderRegex, fontname)
        .replace(fontversionPlaceholderRegex, fontversion)
        .replace(mappingPlaceholderRegex, mappingInfoContent);

      // Write file
      const variantMapPath = path.resolve(targetDir, `${fontname}.cmap`);
      await fs.writeFile(variantMapPath, resultContent, "utf-8");
    });
    await Promise.all(writePromises);
  }

  public async writeUVSData() {
    // Initialize required variables
    const fontSourceDirName = getFontSourceDirName();

    // Validate Env
    if (!fontSourceDirName) {
      throw new Error("Invalid Env");
    }

    // Initialize
    const targetDir = path.resolve(sourcesDir, fontSourceDirName);
    const fontname = getFontname();
    const sortedMap = this.getSortedUVSData();
    const ivsLines: string[] = [];
    const svsLines: string[] = [];

    // Prepare file content
    sortedMap.forEach((uvsInfoMap, codepoint) => {
      uvsInfoMap.forEach((uvsInfo, selector) => {
        const { cid, collection } = uvsInfo;
        const lineContent = `${codepoint} ${selector}; ${collection}; CID+${cid}`;
        if (collection === "Standardized_Variants") {
          svsLines.push(lineContent);
        } else {
          ivsLines.push(lineContent);
        }
      });
    });

    // Write file
    const writeContent = ["#IVSes", ...ivsLines, "#SVSes", ...svsLines, "#EOF", ""].join("\n");
    const writePath = path.resolve(targetDir, `${fontname}_sequences.txt`);
    await fs.writeFile(writePath, writeContent, "utf-8");
  }

  /* Private Methods */

  private async loadDataFromRefSource(variants: string[]) {
    // Initialize required variables and validate
    const fontRefSourceDirName = getFontRefSourceDirName();
    if (!fontRefSourceDirName) {
      throw new Error("Ref Source Dir is not defined.");
    }

    consola.info("Load info from ref source...");

    // Initialize
    const refSourceDir = path.resolve(sourcesDir, fontRefSourceDirName);
    const filelist = await fs.readdir(refSourceDir);
    const mapfileName = filelist.find((filename) => filename === "utf32.map");
    const uvsfileNames = filelist.filter((filename) => filename.endsWith("_sequences.txt"));

    if (!mapfileName || !uvsfileNames.length) {
      throw new Error("Invalid File structure");
    }

    // Load files
    const mapfilePromise = (async () => {
      consola.info(`Read ${mapfileName}...`);

      // Initialize
      const mapfilePath = path.resolve(refSourceDir, mapfileName);
      const mapRawContent = await fs.readFile(mapfilePath, "utf-8");

      // Perform Operation
      mapRawContent.split(/\r?\n/).forEach((line) => {
        if (!line.startsWith("#") && line.trim()) {
          const [codepointString, cidString] = line.split("\t").map((value) => value.trim());
          this.addItemToMappingData(
            {
              codepoint: codepointString
                .replace(/[<>]/g, "")
                .replace(/^0+/, "")
                .padStart(4, "0"),
              cid: parseInt(cidString, 10),
            },
            variants,
          );
        }
      });
    })();

    const uvsfilePromises = uvsfileNames.map(async (filename) => {
      consola.info(`Read ${filename}...`);

      // Initialize
      const uvsfilePath = path.resolve(refSourceDir, filename);
      const uvsRawContent = await fs.readFile(uvsfilePath, "utf-8");

      // Perform Operation
      uvsRawContent.split(/\r?\n/).forEach((line) => {
        if (!line.startsWith("#") && line.trim()) {
          const [sequence, collection, identifier] = line.split(";").map((value) => value.trim());
          const [codepoint, selector] = sequence.split(" ");
          const cid = parseInt(identifier.replace(/^\D+/g, ""), 10);
          this.addItemToUVSInfoData(
            {
              cid,
              codepoint,
              selector,
              collection,
            },
            true,
          );
        }
      });
    });

    await Promise.all([mapfilePromise, ...uvsfilePromises]);
    consola.info("Ref sources are loaded.");
  }

  private loadMappingInfoFromWorksheet(worksheet: ExcelJs.Worksheet, fontVariants?: string[]) {
    const header = FontDataInterface.getWorksheetHeader(worksheet);
    const variants = fontVariants ?? getFontVariants();
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const assignedVariants: string[] = [];
        const codepoint = row.getCell(header["Unicode"]).text;
        const cid = parseInt(row.getCell(header["CID"]).text, 10);
        variants.forEach((variant) => {
          const variantMarker = row.getCell(header[variant]).text.toUpperCase();
          if (variantMarker === "TRUE") {
            assignedVariants.push(variant);
          }
        });
        if (assignedVariants.length) {
          this.addItemToMappingData({ codepoint, cid }, assignedVariants);
        }
      }
    });
  }

  private loadUVSInfoFromWorksheet(worksheet: ExcelJs.Worksheet) {
    const header = FontDataInterface.getWorksheetHeader(worksheet);
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const codepoint = row.getCell(header["Unicode"]).text;
        const selector = row.getCell(header["VS"]).text;
        const cid = parseInt(row.getCell(header["CID"]).text, 10);
        const collection = row.getCell(header["集合"]).text;
        if (selector !== "/") {
          this.addItemToUVSInfoData(
            {
              cid,
              codepoint,
              selector,
              collection,
            },
            true,
          );
        }
      }
    });
  }

  private loadNewGlyphInfoFromWorksheet(worksheet: ExcelJs.Worksheet) {
    const header = FontDataInterface.getWorksheetHeader(worksheet);
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cid = parseInt(row.getCell(header["CID"]).text, 10);
        const codepoint = row.getCell(header["Unicode"]).text;
        const selector = row.getCell(header["VS"]).text;
        const collection = row.getCell(header["集合"]).text;
        const glyphName = row.getCell(header["替換字圖名稱"]).text;
        if (this.#newGlyphInfoData.has(cid)) {
          consola.warn(
            `Duplicate cid "${cid}" is detected. Are you sure "${glyphName}" has unique cid?`,
          );
        }
        this.#newGlyphInfoData.set(
          cid,
          {
            codepoint,
            selector: selector !== "/" ? selector : undefined,
            collection: collection !== "/" ? collection : undefined,
            glyphName,
          },
        );
      }
    });
    // Perform further operation
    this.loadMappingInfoFromWorksheet(worksheet);
    this.loadUVSInfoFromWorksheet(worksheet);
  }

  /* Helpers */

  private static sortFontDataMap<T>(targetMap: Map<string, T>) {
    const sortMethod = (a: [string, unknown], b: [string, unknown]) => (
      hexToNumber(a[0]) - hexToNumber(b[0])
    );
    return new Map(Array.from(targetMap).sort((a, b) => sortMethod(a, b)));
  }

  private addItemToMappingData(
    data: {
      codepoint: string;
      cid: number;
    },
    variants: string[],
  ) {
    // Validate Arguments
    if (!variants.length) {
      throw new Error("Invalid Argument. Expect variants has at least 1 item.");
    }

    // Perform Operation
    const { codepoint, cid } = data;
    const mappingInfo = this.#mappingData.get(codepoint) ?? {};
    variants.forEach((variant) => {
      mappingInfo[variant] = cid;
    });

    this.#mappingData.set(codepoint, mappingInfo);
  }

  private addItemToUVSInfoData(
    data: {
      cid: number;
      codepoint: string;
      selector: string;
      collection: string;
    },
    forceOverwritten: boolean = false,
  ) {
    const { cid, codepoint, selector, collection } = data;

    const sequenceInfo = this.#uvsInfoData.get(codepoint) ?? new Map<string, UVSInfo>();
    this.#uvsInfoData.set(codepoint, sequenceInfo);

    const glyphInfo = sequenceInfo.get(selector) ?? {
      cid,
      collection,
    };

    // Handle the case that has potential Duplicate selector
    if (sequenceInfo.has(selector)) {
      if (glyphInfo.cid !== cid) {
        consola.warn(
          `Potential duplicate UVS with cid mismatch at "U+${codepoint} ${selector}". Existing record's cid has "${glyphInfo.cid}" while insert value has "${cid}".`,
        );
        if (forceOverwritten) {
          consola.warn("Overwrite the existing record");
          glyphInfo.cid = cid;
        } else {
          consola.warn("Preserve the existing record, drop operation on this insert record");
        }
      }
    }

    sequenceInfo.set(selector, glyphInfo);
  }

  private static getWorksheetHeader(worksheet: ExcelJs.Worksheet) {
    const header: { [headerName: string]: number } = {};
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      const cellValue = cell.value;
      if (typeof cellValue === "string") {
        header[cellValue] = colNumber;
      }
    });
    return header;
  }
}

export default FontDataInterface;
