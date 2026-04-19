import { defineCommand, runMain, type ArgsDef } from "citty";
import { newCommand } from "./commands/new.js";

export const definedArguments = {
  printCreatedPath: {
    type: "boolean",
    description: "Print the path of the created workspace and exit.",
  },
} satisfies ArgsDef;

export const main = defineCommand({
  meta: {
    name: "yoi",
    version: "1.0.0",
    description: "yōi: A terminal-based workspace manager for developers.",
  },
  args: definedArguments,
  run: newCommand,
});

runMain(main);
