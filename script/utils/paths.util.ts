import path from "path";

export const rootDir = path.resolve(__dirname, "../../");
export const scriptDir = path.resolve(rootDir, "script");
export const sourcesDir = path.resolve(rootDir, "sources");
export const masterDir = path.resolve(rootDir, "master");
export const outputDir = path.resolve(rootDir, "output");
export const tempDir = path.resolve(rootDir, "temp");
export const pythonDir = path.resolve(scriptDir, "python");
export const workerDir = path.resolve(scriptDir, "worker");
export const dependenciesDir = path.resolve(scriptDir, "dependencies");
