import fs from "fs";
import os from "os";
import readline from "readline";

import keys from "../rawKeyboardInputs.js";
import {
  cursor,
  resetAllTTYStates,
  setTextColorTo,
  setTextStyleTo,
  utils,
} from "../ansiEscapeSequences.js";
import { definedArguments } from "../index.js";
import { parseArgs } from "citty";
import { logger } from "../logger.js";

const PROJECTS_PARENT_FOLDER = os.homedir() + "/Documents/Projects";

if (!fs.existsSync(PROJECTS_PARENT_FOLDER)) {
  logger.error(
    `Specified projects parent folder(${PROJECTS_PARENT_FOLDER}) does not exist!`,
  );
  process.exit(1);
}

const projectFolders = fs.readdirSync(PROJECTS_PARENT_FOLDER).filter((file) => {
  const filePath = `${PROJECTS_PARENT_FOLDER}/${file}`;
  return fs.statSync(filePath).isDirectory();
});

let currentSelectedIndex = 0;

const renderProjectFolders = () => {
  for (let i = 0; i < projectFolders.length; i++) {
    cursor.up(1);
  }

  projectFolders.forEach((folder) => {
    if (folder === projectFolders[currentSelectedIndex]) {
      logger.write(" >  ");
      setTextColorTo("default");
      setTextStyleTo("bold");
      logger.write(folder + "\n");
      setTextStyleTo("default");
    } else {
      logger.write("    ");
      setTextStyleTo("default");
      setTextColorTo(243); // gray
      logger.write(folder + "\n");
      setTextStyleTo("default");
    }
  });
};

const askFolderName = (selectedFolder: string) =>
  new Promise<string>(async (resolve) => {
    let folderName = "";
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stderr,
      terminal: true,
    });

    let prompt = "\u001b[0m[?] Enter new project folder name: \u001b[1m";
    let newFolderPath: string | false = false;

    while (!newFolderPath) {
      const inputValidName = () =>
        new Promise<string | false>((resolve) => {
          rl.question(prompt, (answer) => {
            setTextStyleTo("default");
            folderName = answer.trim();
            if (folderName.length === 0) {
              prompt =
                "\u001b[0m[?] Folder name cannot be empty! Enter a different name: \u001b[1m";
              resolve(false);
              return;
            }

            const newFolderPath = `${PROJECTS_PARENT_FOLDER}/${selectedFolder}/${folderName}`;
            if (fs.existsSync(newFolderPath)) {
              prompt =
                "\u001b[0m[?] Folder name already exists! Enter a different name: \u001b[1m";
              resolve(false);
              return;
            }
            resolve(newFolderPath);
          });
        });
      newFolderPath = await inputValidName();
    }
    rl.close();
    resolve(newFolderPath);
  });

const askSelectProjectFolder = () =>
  new Promise<string>((resolve) => {
    logger.prompt(
      "Select project folder you want to create new workspace in: ",
    );

    logger.write("\n".repeat(projectFolders.length + 1));
    renderProjectFolders();

    process.stdin.setRawMode(true);
    utils.hideCursor();

    const stdinReadStream = process.stdin.on("data", (key: Buffer) => {
      const str = key.toString();
      switch (str) {
        case keys.ctrl.c:
          resetAllTTYStates();
          process.exit(0);

        case keys.enter:
          const currentSelectedFolder = projectFolders[currentSelectedIndex];
          if (currentSelectedFolder === undefined) {
            logger.error("[!] No project folder selected!");
            process.exit(1);
          } else {
            logger.write("\n\n");
            logger.info(`Selected folder: `, true);
            setTextStyleTo("bold");
            logger.write(currentSelectedFolder + "\n\n");
            setTextStyleTo("default");

            resetAllTTYStates();
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.resume();
            stdinReadStream.removeAllListeners("data");

            resolve(currentSelectedFolder);
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
  });

export const newCommand = async () => {
  logger.write("\n       yōi  用意 \n\n\n");

  const parsedArgs = parseArgs<typeof definedArguments>(
    process.argv,
    definedArguments,
  );

  const selectedFolder = await askSelectProjectFolder();

  const newFolderPath = await askFolderName(selectedFolder);

  fs.mkdirSync(newFolderPath);
  logger.write("\n");
  logger.info(`Created new project folder! (${newFolderPath})\n`);
  // logger.write("\n  * ‧₊˚.  ready.  * .+ ゜  \n\n");
  logger.write("\n         ready.\n\n");
  parsedArgs.printCreatedPath && logger.stdout(newFolderPath);

  process.exit(0);
};
