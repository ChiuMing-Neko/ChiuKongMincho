import fs from "node:fs/promises";
import path from "node:path";

const files = [
  {
    name: "big5-1.txt",
    tag: "big5_1",
  },
  {
    name: "gb_t_12345.txt",
    tag: "gb_t_12345",
  },
  {
    name: "jf7000.txt",
    tag: "jf7000",
  },
  {
    name: "jf7000_yue.txt",
    tag: "jf7000_yue",
  },
  {
    name: "jf7000_name.txt",
    tag: "jf7000_name",
  },
  {
    name: "joyokanji.txt",
    tag: "joyo_kanji",
  },
  {
    name: "jinmeiyo.txt",
    tag: "jinmeiyo_kanji",
  },
  // {
  //   name: "gb_t_2312.txt",
  //   tag: "gb_t_2312",
  // },
];

/**
 * @type {Map<string, Set<string>>}
 */
const characterMap = new Map();

/**
 * @param {string} character
 * @param {string} charSetName
 */
const addItemToCharacterMap = (character, charSetName) => {
  const charTags = characterMap.get(character) ?? new Set();
  charTags.add(charSetName);
  characterMap.set(character, charTags);
};

const processJF = async () => {
  const fileNames = ["jf7000.txt", "jf7000_yue.txt", "jf7000_name.txt"];
  const filePaths = fileNames.map((name) => ({
    name: path.resolve("../data/pre_process", name),
    raw: path.resolve("../data/pre_process", `raw_${name}`),
  }));
  await Promise.all(filePaths.map(async (filePath) => {
    const content = await fs.readFile(filePath.raw, "utf-8");
    const characters = content.split(" ").map((char) =>
      `${char}\t${char.codePointAt(0).toString(16).toUpperCase()}`
    );
    await fs.writeFile(filePath.name, characters.join("\n"));
  }));
};

const readAJ = async () => {
  const filePath = path.resolve("../data/pre_process", "aj17.txt");
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split(/\r?\n/g);
  for (const line of lines) {
    // Skip
    if (line.startsWith("#") || !line) {
      continue;
    }

    // Skip
    const [_cid, dataString] = line.split("\t");
    if (
      !dataString.includes("U+")
      || dataString.includes("Adobe-Japan1")
      || dataString.includes("Standardized_Variants")
      || dataString.includes("cid")
      || dataString.includes("N/A")
      || dataString.includes("aalt")
    ) {
      continue;
    }

    const [_codepoint, character] = dataString.split(" ");
    // Skip edge case
    if (!character) {
      continue;
    }
    addItemToCharacterMap(character, "aj1-7");
  }
};

/**
 * @param {string} filename
 * @param {string} tag
 */
const readFile = async (filename, tag) => {
  const filePath = path.resolve("../data/pre_process", filename);
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split(/\r?\n/g);

  for (const line of lines) {
    if (line.startsWith("#") || !line) {
      continue;
    }
    const [character] = line.split("\t");
    addItemToCharacterMap(character, tag);
  }
};

const writeFile = async () => {
  const filePath = path.resolve("../data", "chardata.txt");
  const lines = ["#Unicode\tChar\tTags"];
  const sortedContents = [...characterMap.entries()]
    .sort(([a], [b]) => (
      a.codePointAt(0) - b.codePointAt(0)
    ))
    .filter((item) => {
      const tagSet = item[1];
      if (tagSet.size === 1 && tagSet.has("aj1-7")) {
        return false;
      }
      return true;
    })
    .reduce((/** @type {string[]} */ acc, [char, tags]) => {
      const tagString = [...tags].sort().join(",");
      acc.push(`${char.codePointAt(0).toString(16).toUpperCase()}\t${char}\t${tagString}`);
      return acc;
    }, lines);
  await fs.writeFile(filePath, sortedContents.join("\n"));
};

const createData = async () => {
  await processJF();
  await Promise.all([readAJ(), ...files.map(({ name, tag }) => readFile(name, tag))]);
  await writeFile();
};

createData();

export {};
