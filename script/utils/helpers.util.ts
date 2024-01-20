import fs from "fs/promises";

export const hexToNumber = (hex: string) => parseInt(hex, 16);

export const delay = (ms: number) => (
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
);

export const waitForFileWriteCompletion = async (filePath: string) => {
  let lastSize = null;
  let newSize = (await fs.stat(filePath)).size;
  while (newSize !== lastSize) {
    // eslint-disable-next-line no-await-in-loop
    await delay(100); // wait for 100ms before checking again
    lastSize = newSize;
    // eslint-disable-next-line no-await-in-loop
    newSize = (await fs.stat(filePath)).size;
  }
};
