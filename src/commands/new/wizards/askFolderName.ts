import { setTextStyleTo } from "../../../utils/ansiEscapeSequences.js";
import type { NewCommandContextType } from "../entrypoint.js";
import readline from "readline";
import fs from "fs";

export const askFolderName = (ctx: NewCommandContextType) =>
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

            const newFolderPath = `${ctx.parentFolder}/${ctx.selectedFolder}/${folderName}`;
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
