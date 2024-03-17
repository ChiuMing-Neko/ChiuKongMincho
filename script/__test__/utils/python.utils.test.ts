import assert from "node:assert";
import os from "node:os";
import { before, describe, it, mock } from "node:test";
import { getPythonAlias, initializePython, runPythonTerminal } from "@/utils/python.util";

describe("Utils: Python Utils' getPythonAlias()", () => {
  it("Should able to return 'python' if platform is windows", () => {
    mock.method(os, "platform").mock.mockImplementationOnce(() => "win32");
    assert.strictEqual(getPythonAlias(), "python");
  });

  it("Should able to return 'python3' if platform is not windows", () => {
    mock.method(os, "platform").mock.mockImplementationOnce(() => "linux");
    assert.strictEqual(getPythonAlias(), "python3");
  });
});

describe("Utils: Python Utils' initializePython()", () => {
  it("Should able to initialize python virtural env", async () => {
    await initializePython();
  });
});

describe("Utils: Python Utils' runPythonTerminal()", () => {
  before(async () => {
    await initializePython();
  });

  it("Should able to activate Python's venv", async () => {
    const pythonAlias = getPythonAlias();
    const command = [pythonAlias, "--version"];
    await runPythonTerminal(command);
  });
});
