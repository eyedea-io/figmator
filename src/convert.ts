#!/usr/bin/env node

import debugFn from "debug";
import * as fsExtra from "fs-extra";
import { ConvertOptions, FigmaObjectTree, FigmaNode } from "./types";
import { getFigmaObjTree, print, printError } from "./helpers";
import * as path from "path";

const debug = debugFn("figma-to-components");

process.on("unhandledRejection", err => {
  throw err;
});
const fs = require("fs-extra");
const sortBy = require("lodash.sortby");
const { pascal, kebab } = require("case");
const { join, relative } = require("path");
const templates = require("./templates");
const deepmerge = require("deepmerge");

class ComponentGenerator {
  config: any;
  nodes: any;
  constructor(projectNodes: FigmaNode[], convertOptions: ConvertOptions) {
    this.config = {
      srcDir: `${convertOptions.outputDir}`
    };

    this.nodes = projectNodes
      .map(node => {
        const normalizedName = kebab(node.name);
        const entityDirectory = {
          Page: "pages",
          Component: "components"
        }[node.type];
        return {
          node,
          normalizedName,
          path: join(this.config.srcDir, normalizedName),
          relativePath: join(
            this.config.srcDir,
            entityDirectory,
            normalizedName
          ),
          absolutePath: join(
            process.cwd(),
            this.config.srcDir,
            entityDirectory,
            normalizedName
          )
        };
      })
      .filter(item => item.node.name);
  }

  replaceTag(content: string, tag: string, body: string) {
    let result = content;

    if (!result) {
      return result;
    }

    if (result.includes(`// ${tag}`)) {
      if (result.includes(`// ${tag}-end`)) {
        result = result.replace(
          new RegExp(`// ${tag}(.|\n)*// ${tag}-end`, "m"),
          `// ${tag}`
        );
      }
    }

    return result.replace(`// ${tag}`, `// ${tag}\n${body}\n// ${tag}-end`);
  }

  generateImports({ componentPath, options }) {
    return fs
      .readFile(componentPath, {
        encoding: "utf8"
      })
      .then(data => {
        if (options.imports) {
          let content = this.replaceTag(
            data,
            "imports",
            templates.imports(options)
          );
          content = content.trimRight();
          content += "\n";
          fsExtra.writeFile(componentPath, content);
        }
      })
      .catch(err => {
        if (err.code === "ENOENT") {
          // tslint:disable-next-line:no-console
          console.error(`Component file doesn't exist: "${componentPath}"`);
        }
      });
  }

  async generateTypes({ options, v }) {
    return templates.types(options).then(content => {
      fsExtra.writeFile(
        join(v.absolutePath, `${v.normalizedName}.types.ts`),
        content
      );
    });
  }

  async generate() {
    debug("Generating entries");
    const promises = Object.entries(this.nodes).map(
      ([k, v]: [any, any]) =>
        new Promise(resolve => {
          fsExtra.mkdirp(v.absolutePath, () => {
            const componentPath = join(
              v.absolutePath,
              `${v.normalizedName}.tsx`
            );
            const componentsPath = join(
              v.absolutePath,
              `${v.normalizedName}.components.tsx`
            );
            const indexPath = join(v.absolutePath, "index.tsx");
            const components = (v.node.components || []).map(
              item => this.nodes[item.name]
            );
            const stylePath = join(
              v.absolutePath,
              `${v.normalizedName}.styled.tsx`
            );
            fsExtra.exists(componentPath, async exists => {
              let imports = components
                .map(item => ({
                  name: item.node.name,
                  path: relative(v.path, item.path)
                }))
                .concat({
                  name: "Props",
                  path: `./${v.normalizedName}.types`
                });
              imports = sortBy(imports, ["path"]);

              const options = {
                node: v.node,
                normalizedName: v.normalizedName,
                imports,
                props: {
                  additionalProperties: false,
                  ...(v.node.props || {})
                }
              };
              const storiesPath = join(
                v.absolutePath,
                `${v.normalizedName}.stories.tsx`
              );
              if (exists) {
                debug(`Component exist: ${v.normalizedName}`);
                print`Component ${v.relativePath} already found, not overwriting.`;

                return resolve([
                  // this.generateTypes({ options, v }),
                  // this.generateImports({ componentPath, options })
                ]);
              }

              print`Generating ${v.relativePath} component...`;

              return resolve([
                //this.generateTypes({ options, v }),
                //this.generateImports({ componentPath, options }),
                fsExtra.writeFile(indexPath, templates.index(options)),
                fsExtra.writeFile(stylePath, templates.styled(options)),
                fsExtra.writeFile(componentPath, templates.component(options)),
                fsExtra.writeFile(storiesPath, templates.stories(options)),
                fsExtra.writeFile(componentsPath, templates.components(options))
              ]);
            });
          });
        })
    );

    return Promise.all(promises).then(items => {
      return Promise.all([].concat.apply([], items));
    });
  }
}

export const convert = async (convertOptions: ConvertOptions) => {
  debug("Getting Figma Object Tree");
  try {
    const tree = await getFigmaObjTree(
      convertOptions.apiKey,
      convertOptions.fileId
    );

    const symbolsNode = tree.document.children.find(
      item => item.name === "Symbols"
    );

    print`File ${
      convertOptions.fileId
    } found, generating component tree in ${`/${convertOptions.outputDir}/`}`;

    if (!symbolsNode) {
      throw new Error('Cant find "Symbols" page in the file!');
    }

    const components = symbolsNode.children;

    const layers = components
      .map(item => {
        const [nameWithType, variant = "default"] = item.name.split("/|");
        const [type, ...name] = nameWithType.split("/");

        return {
          id: item.id,
          name: name.map(pascal).join("/"),
          type,
          variants: [{ name: variant, id: item.id }]
        };
      })
      .reduce((all, current) => {
        const index = all.findIndex(
          item => item.name === current.name && item.type === current.type
        );

        if (index >= 0) {
          all[index] = deepmerge(all[index], current);
        } else {
          all.push(current);
        }

        return all;
      }, [])
      .map(item => {
        item.name = item.name.split("/");
        return item;
      });

    const parents = layers
      .filter(item => item.name.length === 1)
      .map(item => {
        item.name = item.name[0];
        return item;
      });

    const children = layers
      .filter(item => item.name.length === 2)
      .map(item => {
        item.parent = item.name[0];
        item.parentNormalizedName = kebab(item.parent);
        item.name = item.name[1];
        item.normalizedName = kebab(item.name);
        return item;
      });

    children.forEach(child => {
      const hasParent = parents.find(
        item => item.name === child.parent && item.type === child.type
      );
      if (!hasParent) {
        parents.push({
          name: child.parent,
          type: child.type,
          variants: child.variants
        });
      }
    });

    debug("Layers", layers);
    debug("Layer children", children);

    const schema = parents.map(parent => {
      parent.children = children.filter(
        item => item.parent === parent.name && item.type === parent.type
      );
      return parent;
    });

    await new ComponentGenerator(schema, convertOptions).generate();
    print`Done!`;
  } catch (ex) {
    const e: Error = ex;
    printError(e.message);
  }
};
