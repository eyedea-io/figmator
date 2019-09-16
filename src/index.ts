#!/usr/bin/env node

import * as convert from "./convert";
import { ConvertOptions } from "./types";
import {
  mergeOptions,
  getArgvOptions,
  getEnvOptions,
  fullfillOptionsCli,
  print
} from "./helpers";

const defaultConvertOptions: ConvertOptions = {
  apiKey: "",
  fileId: "",
  outputDir: "figma-output",
  templatesFile: ""
};

export async function cli(args: any[]) {
  const version = require("../package.json").version;
  print`-------------------------------------\nFigmator ${`v.${version}`}\nPlease use ${"--help"} switch to get help.\n-------------------------------------`;
  const envOptions = getEnvOptions();
  const argvOptions = getArgvOptions();

  const convertOptions = mergeOptions(
    defaultConvertOptions,
    mergeOptions(envOptions, argvOptions)
  );

  await fullfillOptionsCli(convertOptions);

  await convert.convert(convertOptions);
}

cli(process.argv);
