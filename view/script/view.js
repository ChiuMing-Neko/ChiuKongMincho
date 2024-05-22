/** @typedef {import("./charInterface.js").CharacterData} CharacterData */
/** @typedef {Map<string, CharacterData>} DataMap */
/**
 * @typedef FilterOption
 * @property {string} input
 * @property {{ tags: string[], isExactMatch: boolean }} tagsOption
 */

import { h, render } from "https://esm.sh/preact";
import { useEffect, useState } from "https://esm.sh/preact/hooks";
import htm from "https://esm.sh/htm";
import CharacterDataInterface from "./charInterface.js";

const html = htm.bind(h);

const View = () => {
  const charDataInterface = CharacterDataInterface.getInstance();
  /** @type {[boolean, Function]} */
  const [isLoaded, setIsLoaded] = useState(false);
  /** @type {[DataMap, Function]} */
  const [data, setData] = useState();
  /** @type {[number, Function]} */
  const [currentPage, setCurrentPage] = useState(1);
  /** @type {[number, Function]} */
  const [dataPerPage, setDataPerPage] = useState(300);
  /** @type {[FilterOption, Function]} */
  const [filterCondition, setFilterCondition] = useState({
    character: "",
    tagsOption: { tags: [], isExactMatch: false },
  });

  useEffect(() => {
    const fetchData = async () => {
      await charDataInterface.readData();
      setIsLoaded(true);
      setData(charDataInterface.data);
      console.log(charDataInterface.data);
    };
    fetchData();
  }, []);

  const filteredData = () => {
    /** @param {string} text */
    const isCodepoint = (text) => {
      const patterns = [
        // U+ pattern
        /^U\+[0-9A-F]{4,6}$/,
        // Pure hex string pattern
        /^[0-9A-F]{4,6}$/,
      ];
      return patterns.some((pattern) => pattern.test(text));
    };
    const { input, tagsOption } = filterCondition;
    const { tags, isExactMatch } = tagsOption;

    if (input) {
      const codepoint = isCodepoint(input.toUpperCase())
        ? input.toUpperCase().replace("U+", "")
        : input.codePointAt(0).toString(16).toUpperCase();
      const filtered = [...data.values()].filter((charData) => {
        const { unicode } = charData;
        return codepoint === unicode;
      });
      return filtered;
    }

    if (tags.length) {
      const filtered = [...data.values()].filter((charData) => {
        const { tag: charTags } = charData;
        if (isExactMatch) {
          return (
            tags.length === new Set(charTags).size &&
            tags.every((tag) => charTags.includes(tag))
          );
        } else {
          return tags.some((tag) => charTags.includes(tag));
        }
      });
      return filtered;
    }

    return [...data.values()];
  };

  /** @param {CharacterData} charData */
  const renderItem = (charData) => {
    const { unicode, character, uvs, tag } = charData;
    return html`
      <div class="card">
        <div class="header">
          <p class="card-title">U+${unicode} ${character}</p>
          <div class="card-badges">
            ${tag.map((tag) => html`<span class="badge">${tag}</span>`)}
          </div>
        </div>
        <div class="card-body">
          <div class="pure-g">
            <div class="pure-u-1-8">
              <div class="card-style-item">
                <div class="character cl-variant">${character}</div>
                <span class="label">CL</span>
              </div>
            </div>
            <div class="pure-u-1-8">
              <div class="card-style-item">
                <div class="character mn-variant">${character}</div>
                <span class="label">MN</span>
              </div>
            </div>
            <div class="pure-u-1-8">
              <div class="card-style-item">
                <div class="character jp-variant">${character}</div>
                <span class="label">JP</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="pure-g">
            ${uvs.map((value) => {
              const { selector, collection, cid } = value;
              const variantChar = `${character}${String.fromCodePoint(
                parseInt(selector, 16)
              )}`;
              return html`
                <div class="pure-u-1-12">
                  <div class="character-uvs uvs-container">${variantChar}</div>
                  <div class="label-group">
                    <div class="label">U+${unicode} ${selector}</div>
                    <div class="label">${collection}</div>
                    <div class="label">${cid}</div>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  };

  return html`
    <div>
      <div class="nav"></div>
      <div class="content">
        ${isLoaded &&
        data.size &&
        filteredData()
          .slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage)
          .map((charData) => renderItem(charData))}
      </div>
      <div class="pagination-container">
        <div class="pagination">
          ${isLoaded &&
          data.size &&
          html`
            <div class="pagination-controls">
              <button
                class="first-page"
                ${currentPage === 1 ? "disabled" : ""}
                onClick=${() => {
                  setCurrentPage(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                First
              </button>
              <button
                class="prev-page"
                ${currentPage === 1 ? "disabled" : ""}
                onClick=${() => {
                  setCurrentPage(currentPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Previous
              </button>
              <div class="page-input">
                <span>Page</span>
                <input
                  type="number"
                  min="1"
                  max="${Math.ceil(filteredData().length / dataPerPage)}"
                  value="${currentPage}"
                  onkeydown=${(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(parseInt(e.target.value));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                />
                <button
                  onclick=${() => {
                    setCurrentPage(parseInt(e.target.previousSibling.value));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Go
                </button>
                <span
                  >of ${Math.ceil(filteredData().length / dataPerPage)}</span
                >
              </div>
              <button
                class="next-page"
                ${currentPage === Math.ceil(filteredData().length / dataPerPage)
                  ? "disabled"
                  : ""}
                onClick=${() => {
                  setCurrentPage(currentPage + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Next
              </button>
              <button
                class="last-page"
                ${currentPage === Math.ceil(filteredData().length / dataPerPage)
                  ? "disabled"
                  : ""}
                onClick=${() => {
                  setCurrentPage(
                    Math.ceil(filteredData().length / dataPerPage)
                  );
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Last
              </button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

const start = () => {
  render(html`<${View} />`, document.body);
};

start();
