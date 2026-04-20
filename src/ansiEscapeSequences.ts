const ESC = "\u001b[";

export const cursor = {
  up: (n = 1) => process.stderr.write(`${ESC}${n}A`),
  down: (n = 1) => process.stderr.write(`${ESC}${n}B`),
  forward: (n = 1) => process.stderr.write(`${ESC}${n}C`),
  backward: (n = 1) => process.stderr.write(`${ESC}${n}D`),
  clearLine: () => process.stderr.write(`${ESC}2K`),
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
    | "default"
    | number,
) => {
  switch (color) {
    case "black":
      process.stderr.write(`${ESC}30m`);
      break;
    case "red":
      process.stderr.write(`${ESC}31m`);
      break;
    case "green":
      process.stderr.write(`${ESC}32m`);
      break;
    case "yellow":
      process.stderr.write(`${ESC}33m`);
      break;
    case "blue":
      process.stderr.write(`${ESC}34m`);
      break;
    case "magenta":
      process.stderr.write(`${ESC}35m`);
      break;
    case "cyan":
      process.stderr.write(`${ESC}36m`);
      break;
    case "white":
      process.stderr.write(`${ESC}37m`);
      break;
    case "default":
      process.stderr.write(`${ESC}39m`);
      break;
    default:
      if (typeof color === "number" && color >= 0 && color <= 255) {
        process.stderr.write(`${ESC}38;5;${color}m`);
      }
      break;
  }
};

export const setTextStyleTo = (
  style: "bold" | "underline" | "inverse" | "strikethrough" | "default",
) => {
  switch (style) {
    case "bold":
      process.stderr.write(`${ESC}1m`);
      break;
    case "underline":
      process.stderr.write(`${ESC}4m`);
      break;
    case "inverse":
      process.stderr.write(`${ESC}7m`);
      break;
    case "strikethrough":
      process.stderr.write(`${ESC}9m`);
      break;
    case "default":
      process.stderr.write(`${ESC}0m`);
      break;
  }
};

export const utils = {
  showCursor: () => process.stderr.write(`${ESC}?25h`),
  hideCursor: () => process.stderr.write(`${ESC}?25l`),
};

export const resetAllTTYStates = () => {
  setTextStyleTo("default");
  utils.showCursor();
};
