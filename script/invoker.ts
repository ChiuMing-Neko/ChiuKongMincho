import type Command from "./typedef/command";

class Invoker {
  #command: Map<string, Command>;

  public constructor() {
    this.#command = new Map();
  }

  public register(flag: string, command: Command) {
    this.#command.set(flag, command);
  }

  public async execute(argv: string[]) {
    const flag = argv[2];
    const command = this.#command.get(flag);
    if (!command) {
      throw new TypeError(`command ${flag} is not registered.`);
    }
    await command.execute();
  }
}

export default Invoker;
