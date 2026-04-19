import fs from "fs";
import os from "os";
import readline from "readline";

import keys from "../rawKeyboardInputs.js";
import {
  cursor,
  setTextColorTo,
  setTextStyleTo,
} from "../ansiEscapeSequences.js";
import { definedArguments } from "../index.js";
import { parseArgs } from "citty";
import { logger } from "../logger.js";

const PROJECTS_PARENT_FOLDER = os.homedir() + "/Documents/Projects";

logger.write("\n       yōi  用意 \n\n\n");

export const newCommand = () => {
  const parsedArgs = parseArgs<typeof definedArguments>(
    process.argv,
    definedArguments,
  );

  if (!fs.existsSync(PROJECTS_PARENT_FOLDER)) {
    logger.error(
      `Specified projects parent folder(${PROJECTS_PARENT_FOLDER}) does not exist!`,
    );
    process.exit(1);
  }

  const projectFolders = fs
    .readdirSync(PROJECTS_PARENT_FOLDER)
    .filter((file) => {
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
        logger.write(" >  ");
        setTextColorTo("cyan");
        setTextStyleTo("bold");
        logger.write(folder + "\n");
        setTextColorTo("default");
        setTextStyleTo("default");
      } else {
        logger.write("    ");
        setTextColorTo("default");
        setTextStyleTo("default");
        logger.write(folder + "\n");
      }
    });
  };

  const askFolderName = () => {
    let folderName = "";
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stderr,
      terminal: true,
    });

    rl.question(
      "\u001b[0m[?] Enter new project folder name: \u001b[1m",
      (answer) => {
        setTextStyleTo("default");
        folderName = answer.trim();
        if (folderName.length === 0) {
          logger.error("Folder name cannot be empty!");
          rl.close();
          askFolderName();
          return;
        }

        const newFolderPath = `${PROJECTS_PARENT_FOLDER}/${selectedFolder}/${folderName}`;
        if (fs.existsSync(newFolderPath)) {
          logger.error("A folder with the same name already exists!");
          rl.close();
          askFolderName();
          return;
        }

        fs.mkdirSync(newFolderPath);
        logger.write("\n");
        logger.info(`Created new project folder! (${newFolderPath})\n`);
        // logger.write("\n  * ‧₊˚.  ready.  * .+ ゜  \n\n");
        logger.write("\n         ready.\n\n");
        parsedArgs.printCreatedPath && logger.stdout(newFolderPath);

        rl.close();
        process.exit(0);
      },
    );
  };

  logger.prompt("Select project folder you want to create new workspace in: ");
  logger.write("\n".repeat(projectFolders.length + 1));
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
          logger.error("[!] No project folder selected!");
          process.exit(1);
        } else {
          selectedFolder = currentSelectedFolder;

          logger.write("\n\n");
          logger.info(`Selected folder: `, true);
          setTextStyleTo("bold");
          logger.write(selectedFolder + "\n\n");
          setTextStyleTo("default");

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
};
