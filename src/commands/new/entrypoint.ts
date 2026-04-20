import fs from "fs";
import os from "os";

import { definedArguments } from "../../index.js";
import { parseArgs } from "citty";
import { logger } from "../../logger.js";
import { askSelectProjectFolder } from "./wizards/askSelectProjectFolder.js";
import { askFolderName } from "./wizards/askFolderName.js";

const PROJECTS_PARENT_FOLDER = os.homedir() + "/Documents/Projects";

export type NewCommandContextType = {
  parentFolder: string;
  projectFolders: string[] | null;
  currentSelectedIndex: number | null;
  selectedFolder: string | null;
  newFolderPath: string | null;
};

const ctx: NewCommandContextType = {
  parentFolder: PROJECTS_PARENT_FOLDER,
  projectFolders: null,
  currentSelectedIndex: null,
  selectedFolder: null,
  newFolderPath: null,
};

export const newCommand = async () => {
  logger.write("\n       yōi  用意 \n\n\n");

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

  ctx.projectFolders = fs.readdirSync(PROJECTS_PARENT_FOLDER).filter((file) => {
    const filePath = `${PROJECTS_PARENT_FOLDER}/${file}`;
    return fs.statSync(filePath).isDirectory();
  });

  ctx.selectedFolder = await askSelectProjectFolder(ctx);

  ctx.newFolderPath = await askFolderName(ctx);

  fs.mkdirSync(ctx.newFolderPath);

  logger.write("\n");
  logger.info(`Created new project folder! (${ctx.newFolderPath})\n`);

  // logger.write("\n  * ‧₊˚.  ready.  * .+ ゜  \n\n");
  logger.write("\n         ready.\n\n");

  parsedArgs.printCreatedPath && logger.stdout(ctx.newFolderPath);

  process.exit(0);
};
