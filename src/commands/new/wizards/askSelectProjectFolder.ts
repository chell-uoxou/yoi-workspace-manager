import {
  utils,
  resetAllTTYStates,
  setTextStyleTo,
  cursor,
  setTextColorTo,
} from "../../../ansiEscapeSequences.js";
import { logger } from "../../../logger.js";
import keys from "../../../rawKeyboardInputs.js";
import type { NewCommandContextType } from "../../new.js";

let currentSelectedIndex = 0;

const renderProjectFolders = (projectFolders: string[]) => {
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

export const askSelectProjectFolder = (ctx: NewCommandContextType) =>
  new Promise<string>((resolve) => {
    if (ctx.projectFolders === null)
      throw new Error("Project folders not loaded in context!");

    logger.prompt(
      "Select project folder you want to create new workspace in: ",
    );

    logger.write("\n".repeat(ctx.projectFolders.length + 1));
    renderProjectFolders(ctx.projectFolders);

    process.stdin.setRawMode(true);
    utils.hideCursor();

    const stdinReadStream = process.stdin.on("data", (key: Buffer) => {
      if (ctx.projectFolders === null)
        throw new Error("Project folders not loaded in context!");

      const str = key.toString();
      switch (str) {
        case keys.ctrl.c:
          resetAllTTYStates();
          process.exit(0);

        case keys.enter:
          const currentSelectedFolder =
            ctx.projectFolders[currentSelectedIndex];
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
          renderProjectFolders(ctx.projectFolders);
          break;

        case keys.down:
        case keys.ctrl.n:
          currentSelectedIndex = Math.min(
            currentSelectedIndex + 1,
            ctx.projectFolders.length - 1,
          );
          renderProjectFolders(ctx.projectFolders);
          break;

        default:
          break;
      }
    });
  });
