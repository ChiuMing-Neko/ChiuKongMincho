import consola from "consola";
import Invoker from "./invoker";
import { BuildCommand, BuildDevCommand } from "./commands";
import { initializePython } from "./utils/python.util";

const main = async () => {
  const invoker = new Invoker();
  invoker.register("--build", new BuildCommand());
  invoker.register("--build-dev", new BuildDevCommand());

  consola.info("Starting script...");
  await initializePython();
  await invoker.execute(process.argv);
};

(async () => {
  try {
    await main();
  } catch (err) {
    throw new Error(undefined, { cause: err });
  }
})();
