/**
 * @typedef VariationSequence
 * @property {string} selector
 * @property {string} collection
 * @property {string} cid
 */

/**
 * @typedef CharacterData
 * @property {string} unicode
 * @property {string} character
 * @property {VariationSequence[]} uvs
 * @property {string[]} tag
 */

class CharacterDataInterface {
  /** @type {CharacterDataInterface} */
  static #instance;
  /** @type {Map<string, CharacterData>} */
  #data;

  constructor() {
    this.#data = new Map();
  }

  get data() {
    return this.#data;
  }

  static getInstance() {
    if (!CharacterDataInterface.#instance) {
      CharacterDataInterface.#instance = new CharacterDataInterface();
    }
    return this.#instance;
  }

  async initialize() {
    await Promise.all([this.readCharData(), this.readIVD()]);
  }

  async readData() {
    await this.readCharData();
    await this.readIVD();
  }

  async readCharData() {
    /** @param {string} tag */
    const handleTag = (tag) => {
      const isCID = /^-?\d+$/.test(tag);
      return isCID ? ["new_glyphs"] : tag.split(",");
    };

    /** @param {string} filePath */
    const readData = async (filePath) => {
      const response = await fetch(filePath);
      const data = await response.text();
      const lines = data.split(/\r?\n/g);

      for (const line of lines) {
        if (line.startsWith("#") || !line) continue;
        const [codepoint, character, tags] = line.split("\t");
        const characterInfo = this.#data.get(codepoint) ?? {
          unicode: codepoint,
          character,
          uvs: [],
          tag: [],
        };
        characterInfo.tag = Array.from(new Set([...characterInfo.tag, ...handleTag(tags)])).sort();
        this.#data.set(codepoint, characterInfo);
      }
    };

    const filePaths = ["data/chardata.txt", "data/new_glyphs.txt"];
    await Promise.all(filePaths.map(async (filePath) => readData(filePath)));

    this.#data = new Map(
      [...this.#data.entries()].sort(([a], [b]) => parseInt(a, 16) - parseInt(b, 16)),
    );
  }

  async readIVD() {
    const response = await fetch("data/ivd.txt");
    const data = await response.text();
    const lines = data.split(/\r?\n/g);

    for (const line of lines) {
      if (line.startsWith("#") || !line) continue;
      const [identifier, collection, cid] = line.split("; ");
      const [codepoint, selector] = identifier.split(" ");
      const characterInfo = this.#data.get(codepoint);
      if (!characterInfo) continue; // Do not consider the case outside scope
      characterInfo.uvs = [...characterInfo.uvs, {
        selector,
        collection: collection === "Standardized_Variants" ? "SVS" : collection,
        cid,
      }];
      this.#data.set(codepoint, characterInfo);
    }
  }
}

export default CharacterDataInterface;
