#!/usr/bin/env -S yarn tsx
/* eslint-disable unicorn/prefer-module */
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

const componentTemplateName = "ComponentTemplate";
const componentTemplatePath = path.join(__dirname, componentTemplateName);
const componentsPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "elements",
);

const componentName = process.argv[2];

if (!componentName) {
  console.error(
    chalk.red("You must provide the component name in PascalCase."),
  );
  process.exit(1);
}

const componentPath = path.join(componentsPath, componentName);

if (fs.existsSync(componentPath)) {
  console.error(chalk.red("The component already exists."));
  process.exit(1);
}

try {
  fs.mkdirSync(componentPath, { recursive: true });
} catch {
  console.error(chalk.red("Failed to create the component directory."));
  process.exit(1);
}

for (const file of fs.readdirSync(componentTemplatePath)) {
  const filePath = path.join(componentTemplatePath, file);
  const content = fs.readFileSync(filePath, "utf8");
  const newFilePath = path.join(
    componentPath,
    file.replace(componentTemplateName, componentName),
  );
  fs.writeFileSync(
    newFilePath,
    content.replaceAll(componentTemplateName, componentName),
    "utf8",
  );
}

console.info(chalk.green(`Component ${componentName} successfully created.`));
