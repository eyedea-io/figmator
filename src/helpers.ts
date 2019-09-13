import { argv } from "yargs";
import { ConvertOptions, FigmaObjectTree } from "./types";
import prompts from "prompts";
import fetch from "node-fetch";
import chalk, { Chalk } from "chalk";

export const mergeOptions = (
  options: ConvertOptions,
  optionsToMerge: ConvertOptions
) => {
  return Object.keys(options).reduce<Partial<ConvertOptions>>(
    (acc, key) => ({ ...acc, [key]: optionsToMerge[key] || options[key] }),
    {}
  ) as ConvertOptions;
};

export const getEnvOptions = () =>
  ({
    apiKey: process.env.FIGMATOR_API_KEY || "",
    fileId: process.env.FIGMATOR_FILE_ID || "",
    workspaceName: process.env.FIGMATOR_WORKSPACE_NAME || "",
    templatesFile: process.env.FIGMATOR_TEMPLATES_FILE || ""
  } as ConvertOptions);

export const getArgvOptions = () =>
  ({
    apiKey: (argv.apiKey as string) || "",
    fileId: (argv.fileId as string) || "",
    workspaceName: (argv.workspaceName as string) || "",
    templatesFile: (argv.atemplatesFilepiKey as string) || ""
  } as ConvertOptions);

export const fullfillOptionsCli = async (convertOptions: ConvertOptions) => {
  if (!convertOptions.apiKey) {
    const response = await prompts({
      type: "text",
      name: "value",
      message: "Please enter Figma API key",
      validate: value => (value ? true : "Please enter a valid value")
    });
    convertOptions.apiKey = response.value;
  }
  if (!convertOptions.fileId) {
    const response = await prompts({
      type: "text",
      name: "value",
      message: "Please enter Figma file ID",
      validate: value => (value ? true : "Please enter a valid value")
    });
    convertOptions.fileId = response.value;
  }
};

export async function getFigmaObjTree(
  figmaApiKey,
  figmaFileKey
): Promise<FigmaObjectTree> {
  let result = await fetch(`https://api.figma.com/v1/files/${figmaFileKey}`, {
    method: "GET",
    headers: {
      "X-Figma-Token": figmaApiKey
    }
  });

  if (result.status == 404) {
    throw new Error(
      `Can't find specified file. Make sure that file ID is valid.`
    );
  }

  if (result.status == 403) {
    throw new Error(
      `Can't authorize in Figma API. Make sure that API key is valid.`
    );
  }

  if (result.status >= 400) {
    throw new Error(
      `Can't connect to Figma API. Make sure that API key and file ID are valid.`
    );
  }

  return await result.json();
}

export const printFnFactory = (primaryChalk: Chalk, secondaryChalk: Chalk) => (
  t: TemplateStringsArray | string,
  ...placeholders: string[]
) => {
  if (typeof t === "string") {
    return console.log(primaryChalk(t));
  }
  const segments = [];
  const templates = [...t];
  do {
    if (templates.length) {
      segments.push(primaryChalk(templates.shift()));
    }
    if (placeholders.length) {
      segments.push(secondaryChalk(placeholders.shift()));
    }
  } while (templates.length || placeholders.length);
  console.log(segments.join(""));
};

export const print = printFnFactory(chalk.yellowBright, chalk.blueBright);
export const printError = printFnFactory(chalk.redBright, chalk.red);
