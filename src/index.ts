import { defineCommand, runMain } from "citty";

const main = defineCommand({
  meta: {
    name: "yoi",
    version: "1.0.0",
    description: "yōi: A terminal-based workspace manager for developers.",
  },
  args: {
    "print-path": {
      type: "boolean",
      description: "Print the path of the current workspace and exit.",
    },
  },
  run: () => import("./commands/new.js"),
});

runMain(main);
