import { write } from "fs";

export const logger = {
  info: (message: string) => {
    process.stderr.write(`[*] ${message}\n`);
  },
  error: (message: string) => {
    process.stderr.write(`[!] ${message}\n`);
  },
  prompt: (message: string) => {
    process.stderr.write(`[?] ${message} `);
  },
  write: (message: string) => {
    process.stderr.write(message);
  },
  stdout: (text: string) => {
    process.stdout.write(text);
  },
};
