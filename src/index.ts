import fs from "fs";
import os from "os";
import keys from "./rawKeyboardInputs.js";
import {
  cursor,
  setTextColorTo,
  setTextStyleTo,
} from "./ansiEscapeSequences.js";

const PROJECTS_PARENT_FOLDER = os.homedir() + "/Documents/Projects";

console.log("\n  yōi... \n\n");
if (!fs.existsSync(PROJECTS_PARENT_FOLDER)) {
  console.error(
    `[!] Specified projects parent folder(${PROJECTS_PARENT_FOLDER}) does not exist!`,
  );
  process.exit(1);
}

const projectFolders = fs.readdirSync(PROJECTS_PARENT_FOLDER).filter((file) => {
  const filePath = `${PROJECTS_PARENT_FOLDER}/${file}`;
  return fs.statSync(filePath).isDirectory();
});

let currentSelectedIndex = 0;
const renderProjectFolders = () => {
  for (let i = 0; i < projectFolders.length + 1; i++) {
    cursor.up(1);
    cursor.clearLine();
  }

  projectFolders.forEach((folder) => {
    if (folder === projectFolders[currentSelectedIndex]) {
      process.stdout.write(" >  ");
      setTextColorTo("cyan");
      setTextStyleTo("underline");
      console.log(folder);
      setTextColorTo("default");
      setTextStyleTo("default");
    } else {
      process.stdout.write("    ");
      setTextColorTo("default");
      setTextStyleTo("default");
      console.log(folder);
    }
  });
};

console.log("[?] Select project folder you want to create new workspace in: ");
console.log("\n".repeat(projectFolders.length + 1));
renderProjectFolders();

process.stdin.setRawMode(true);

process.stdin.on("data", (key: Buffer) => {
  const str = key.toString();
  console.log(JSON.stringify(str));
  switch (str) {
    case keys.ctrl.c:
      process.exit(0);

    case keys.enter:
      console.log("Enter key pressed");
      break;

    case keys.up:
    case keys.ctrl.p:
      currentSelectedIndex = Math.max(currentSelectedIndex - 1, 0);
      renderProjectFolders();
      break;

    case keys.down:
    case keys.ctrl.n:
      currentSelectedIndex = Math.min(
        currentSelectedIndex + 1,
        projectFolders.length - 1,
      );
      renderProjectFolders();
      break;

    default:
      console.log(`Pressed key: ${str}`);
      break;
  }
});
