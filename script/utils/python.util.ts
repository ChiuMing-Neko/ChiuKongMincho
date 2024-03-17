import consola from "consola";
import fs from "fs";
import { spawn } from "node:child_process";
import { platform } from "node:os";
import path from "path";
import { Worker } from "worker_threads";
import { pythonDir, workerDir } from "./paths.util";

/** Helper functions */

/**
 * Return the default python alias based on platform that execute the code
 */
export const getPythonAlias = () => (platform() === "win32" ? "python" : "python3");

/**
 * Check Python Version and Environment of local machine
 * @param requiredVersion Minimum Python version requirement @default 3.12.0
 */
export const checkPythonVersion = async (requiredVersion: string = "3.12.0"): Promise<void> => (
  new Promise((resolve, reject) => {
    const pythonAlias = getPythonAlias();
    const childProcess = spawn(pythonAlias, ["--version"]);

    let versionOutput = "";

    childProcess.stdout.on("data", (chunk) => {
      versionOutput += chunk;
    });

    childProcess.on("close", (code, _signal) => {
      // Check version, also able to check python env
      if (code === 0) {
        const versionMatch = versionOutput.match(/Python (\d+\.\d+\.\d+)/);
        if (versionMatch) {
          const currentVersion = versionMatch[1].split(".");
          const minVersion = requiredVersion.split(".");
          for (let i = 0; i < currentVersion.length; i += 1) {
            if (currentVersion[i] > minVersion[i]) {
              resolve();
            } else if (currentVersion[i] < minVersion[i]) {
              reject(new Error(`${versionMatch[1]} is not compatible to this script.`));
            }
          }
          resolve();
        }
      } else {
        reject(new Error(`Process exited with code: ${code}`));
      }
    });

    childProcess.on("error", (err) => reject(err));
  })
);

/**
 * Check python venv is installed in the project
 */
export const checkIsPythonVenvInstalled = () => {
  const virtualEnvPath = path.resolve(pythonDir, "virtualenv");
  return fs.existsSync(virtualEnvPath);
};

/** Utils tools */

/**
 * Warpper that run command in terminal with python venv
 * It may return the logging data
 * @param args Commands
 * @param workDir Execute Directory
 */
export const runPythonTerminal = async (
  args: string[],
  options: {
    shell?: boolean;
    workDir?: string;
    stdio?: "pipe" | "overlapped" | "ignore" | "inherit";
  } = {},
): Promise<string[] | PromiseLike<string[]>> => (
  new Promise((resolve, reject) => {
    const { shell, workDir, stdio } = options;
    let outputData: Array<string> = [];
    const errorData: Array<string> = [];

    // Initialize
    const systemPlatform = platform();
    const virtualEnvPath = path.resolve(pythonDir, "virtualenv");
    const activatePath = path.resolve(
      virtualEnvPath,
      systemPlatform === "win32" ? "Scripts" : "bin",
      systemPlatform === "win32" ? "activate.bat" : "activate",
    );
    const activateCommand = `${systemPlatform === "win32" ? "" : "source "}${activatePath}`;
    const command = `${activateCommand} && ${args.join(" ")}`;

    // Spawn process
    const childProcess = spawn(
      command,
      {
        shell: shell ?? true,
        cwd: workDir ?? pythonDir,
        stdio: stdio ?? "inherit",
        env: process.env,
      },
    );

    // Receive output from python
    childProcess.stdout?.on("data", (chunk) => {
      outputData = outputData.concat(chunk.toString().trim().split(/\r?\n/));
    });

    childProcess.stderr?.on("data", (chunk) => {
      errorData.push(chunk.toString());
    });

    // Exit Process
    childProcess.on("close", (code, _signal) => {
      if (errorData.length) {
        errorData.forEach((value) => consola.error(value));
        reject();
      }

      if (code === 0) {
        resolve(outputData);
      } else {
        consola.error(errorData);
        reject(new Error(`Process exited with code: ${code}`));
      }
    });

    childProcess.on("error", (err) => reject(err));
  })
);

export const runPythonTerminalWorker = async (
  args: string[],
  options: {
    workDir?: string;
    stdio?: "pipe" | "overlapped" | "ignore" | "inherit";
  } = {},
): Promise<string[] | PromiseLike<string[]>> => (
  new Promise((resolve, reject) => {
    const worker = new Worker(
      path.resolve(workerDir, "runpython.worker.ts"),
      {
        workerData: null,
        execArgv: [
          "--require ts-node/register",
          "--require tsconfig-paths/register",
        ],
      },
    );

    worker.on("message", (message) => {
      if (message.error) {
        reject(new Error(message.error));
      } else {
        resolve(message.output);
      }
    });

    worker.on("error", () => reject());
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    worker.postMessage({ args, options });
  })
);

/**
 * Initialize Python env
 */
export const initializePython = async (): Promise<void> => {
  try {
    // Check python version
    await checkPythonVersion();
    // If there is python's venv, terminate the process
    if (checkIsPythonVenvInstalled()) return;

    // Call child process
    const PromisifiedChildProcess = new Promise<void>((resolve, reject) => {
      // Initialize
      const pythonAlias = getPythonAlias();
      const virtualEnvPath = path.resolve(pythonDir, "virtualenv");

      // Spawn child process to create python venv
      const childProcess = spawn(
        pythonAlias,
        [
          "-m",
          "venv",
          virtualEnvPath,
        ],
        {
          stdio: "inherit",
          cwd: pythonDir,
        },
      );

      childProcess.on("exit", (code, _signal) => {
        if (code === 0) {
          if (checkIsPythonVenvInstalled()) {
            resolve();
          } else {
            reject(new Error("Some unknown error occur during init venv"));
          }
        } else {
          reject(new Error(`Process exited with code: ${code}`));
        }
      });

      childProcess.on("error", (err) => reject(err));
    });
    await PromisifiedChildProcess;

    // Install Dependencies
    const installCommand = [getPythonAlias(), "-m", "pip", "install", "-r", "requirements.txt"];
    await runPythonTerminal(installCommand, { workDir: pythonDir });
  } catch (err) {
    consola.error(err);
    throw err;
  }
};
