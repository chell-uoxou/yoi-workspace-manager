import fs from "fs";
import os from "os";
import readline from "readline";

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
let selectedFolder = "";
const renderProjectFolders = () => {
  for (let i = 0; i < projectFolders.length; i++) {
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

const askFolderName = () => {
  let folderName = "";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  rl.question("[?] Enter new project folder name: ", (answer) => {
    folderName = answer.trim();
    if (folderName.length === 0) {
      console.error("[!] Folder name cannot be empty!");
      rl.close();
      askFolderName();
      return;
    }

    const newFolderPath = `${PROJECTS_PARENT_FOLDER}/${selectedFolder}/${folderName}`;
    if (fs.existsSync(newFolderPath)) {
      console.error("[!] A folder with the same name already exists!");
      rl.close();
      askFolderName();
      return;
    }

    fs.mkdirSync(newFolderPath);
    console.log(`Created new project folder: ${newFolderPath}`);
    rl.close();
  });
};

console.log("[?] Select project folder you want to create new workspace in: ");
console.log("\n".repeat(projectFolders.length + 1));
renderProjectFolders();

process.stdin.setRawMode(true);

const a = process.stdin.on("data", (key: Buffer) => {
  const str = key.toString();
  switch (str) {
    case keys.ctrl.c:
      process.exit(0);

    case keys.enter:
      const currentSelectedFolder = projectFolders[currentSelectedIndex];
      if (currentSelectedFolder === undefined) {
        console.error("[!] No project folder selected!");
        process.exit(1);
      } else {
        selectedFolder = currentSelectedFolder;
        console.log(`Selected folder: ${selectedFolder}`);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.resume();
        a.removeAllListeners("data");

        askFolderName();
      }
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
      break;
  }
});
