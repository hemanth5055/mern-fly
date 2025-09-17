import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import fsE from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

function showWelcome() {
  console.log(chalk.cyanBright(figlet.textSync("MERN-FLY", { font: "Big" })));
}

async function main() {
  // show welcome message
  showWelcome();

  // take input from CLI
  const { name, dependencyInstallFlag } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project Name:",
      validate: (input) => (input ? true : "Project name cannot be empty"),
    },
    {
      type: "confirm",
      name: "dependencyInstallFlag",
      message: "Do you want to run npm install after setup?",
      default: true,
    },
  ]);

  await createProject(name, dependencyInstallFlag);
}

async function createProject(projectName, dependencyInstallFlag) {
  const cwd = process.cwd();

  // check if directory exists
  const projectPath = path.join(cwd, projectName);
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`❌ Project "${projectName}" already exists!`));
    process.exit(1);
  }

  // create project folder
  fs.mkdirSync(projectPath, { recursive: true });
  console.log(" ");
  console.log(chalk.green(`✅ Created project folder: ${projectName}`));
  console.log(" ");

  // __dirname equivalent in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Paths to boilerplate inside your npm package
  const clientTemplate = path.join(__dirname, "boiler", "client");
  const serverTemplate = path.join(__dirname, "boiler", "server");

  // Create client and server subfolders
  const clientPath = path.join(projectPath, "client");
  const serverPath = path.join(projectPath, "server");
  fs.mkdirSync(clientPath);
  fs.mkdirSync(serverPath);
  console.log(" ");
  console.log("📂 Created client and server folders");
  console.log(" ");

  // copy boilerplate
  console.log(" ");
  console.log(chalk.blue("📂 Setting up Client..."));
  console.log(" ");
  fsE.copySync(clientTemplate, clientPath);

  console.log(" ");
  console.log(chalk.blue("📂 Setting up Server..."));
  console.log(" ");
  fsE.copySync(serverTemplate, serverPath);

  console.log(" ");
  console.log(chalk.green("✅ Project setup complete!"));
  console.log(" ");
  // optionally run npm install
  if (dependencyInstallFlag) {
    console.log(" ");
    console.log(chalk.yellow("📦 Installing dependencies..."));
    console.log(" ");
    try {
      execSync("npm install", { cwd: clientPath, stdio: "inherit" });
      execSync("npm install", { cwd: serverPath, stdio: "inherit" });
      console.log(" ");
      console.log(chalk.green("✅ Dependencies installed successfully!"));
      console.log(" ");
    } catch (err) {
      console.log(" ");
      console.log(chalk.red("❌ Error installing dependencies:", err.message));
      console.log(" ");
    }
  }
}

// run the CLI
main();
