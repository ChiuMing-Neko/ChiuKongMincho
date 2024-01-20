interface Command {
  execute(): Promise<void>;
}

export default Command;
