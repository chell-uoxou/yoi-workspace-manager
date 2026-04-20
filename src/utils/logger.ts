export const logger = {
  info: (message: string, noReturn?: boolean) => {
    process.stderr.write(`[*] ${message}${noReturn ? "" : "\n"}`);
  },
  error: (message: string, noReturn?: boolean) => {
    process.stderr.write(`[!] ${message}${noReturn ? "" : "\n"}`);
  },
  prompt: (message: string, noReturn?: boolean) => {
    process.stderr.write(`[?] ${message}${noReturn ? "" : "\n"}`);
  },
  write: (message: string) => {
    process.stderr.write(message);
  },
  stdout: (text: string) => {
    process.stdout.write(text);
  },
};
