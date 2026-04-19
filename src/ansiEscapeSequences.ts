const ESC = "\u001b[";

export const cursor = {
  up: (n = 1) => process.stdout.write(`${ESC}${n}A`),
  down: (n = 1) => process.stdout.write(`${ESC}${n}B`),
  forward: (n = 1) => process.stdout.write(`${ESC}${n}C`),
  backward: (n = 1) => process.stdout.write(`${ESC}${n}D`),
  clearLine: () => process.stdout.write(`${ESC}2K`),
};

export const setTextColorTo = (
  color:
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "default",
) => {
  switch (color) {
    case "black":
      process.stdout.write(`${ESC}30m`);
      break;
    case "red":
      process.stdout.write(`${ESC}31m`);
      break;
    case "green":
      process.stdout.write(`${ESC}32m`);
      break;
    case "yellow":
      process.stdout.write(`${ESC}33m`);
      break;
    case "blue":
      process.stdout.write(`${ESC}34m`);
      break;
    case "magenta":
      process.stdout.write(`${ESC}35m`);
      break;
    case "cyan":
      process.stdout.write(`${ESC}36m`);
      break;
    case "white":
      process.stdout.write(`${ESC}37m`);
      break;
    case "default":
      process.stdout.write(`${ESC}39m`);
      break;
  }
};

export const setTextStyleTo = (
  style: "bold" | "underline" | "inverse" | "strikethrough" | "default",
) => {
  switch (style) {
    case "bold":
      process.stdout.write(`${ESC}1m`);
      break;
    case "underline":
      process.stdout.write(`${ESC}4m`);
      break;
    case "inverse":
      process.stdout.write(`${ESC}7m`);
      break;
    case "strikethrough":
      process.stdout.write(`${ESC}9m`);
      break;
    case "default":
      process.stdout.write(`${ESC}0m`);
      break;
  }
};
