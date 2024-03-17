import { parentPort } from "worker_threads";
import { runPythonTerminal } from "@/utils/python.util";

parentPort?.on("message", async (task) => {
  try {
    const output = await runPythonTerminal(task.args, task.options);
    parentPort?.postMessage({ output });
  } catch (err) {
    parentPort?.postMessage({ error: err });
  }
});
