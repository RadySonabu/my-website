import bcrypt from "bcryptjs";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

function promptHidden(question) {
  if (!stdin.isTTY) {
    // Not an interactive terminal (e.g. piped input) - fall back to a plain
    // prompt. Real interactive use masks the input; this path exists so the
    // script is still testable non-interactively.
    const rl = createInterface({ input: stdin, output: stdout });
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  return new Promise((resolve) => {
    const rl = createInterface({ input: stdin, output: stdout });
    stdout.write(question);
    let answer = "";
    const onData = (char) => {
      char = char.toString();
      if (char === "\n" || char === "\r") {
        stdin.setRawMode(false);
        stdin.removeListener("data", onData);
        stdout.write("\n");
        rl.close();
        resolve(answer);
      } else if (char === "") {
        // Ctrl+C
        process.exit(1);
      } else if (char === "") {
        // backspace
        answer = answer.slice(0, -1);
      } else {
        answer += char;
      }
    };
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function main() {
  const password = await promptHidden("Enter the admin password to hash: ");
  if (!password) {
    console.error("No password entered.");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log("\nADMIN_PASSWORD_HASH:");
  console.log(hash);
  console.log("\nAdd this as an env var named ADMIN_PASSWORD_HASH in Vercel.");
}

main();
