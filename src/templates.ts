import * as path from "path";

//  Generate index.ts file
module.exports.index = ({ node: { name, type }, normalizedName }) =>
  type === "Page"
    ? `export {${name} as default} from './${normalizedName}'`
    : `export {default as ${name}} from './${normalizedName}'`;

// Generate component.tsx
module.exports.component = ({
  node: { name },
  imports,
  normalizedName
}) => `import * as React from 'react'
import {hot} from 'react-hot-loader/root'
import {observer} from 'mobx-react-lite'
import * as S from './${normalizedName}.styled'

export const ${name}: React.FC = hot(
  observer(({children, ...props}) => <S.${name} {...props}>TODO: ${name}</S.${name}>)
)
`;

// Generate component imports
module.exports.imports = ({ imports }) =>
  `${imports
    .map(item => `import {${item.name}} from '${item.path}'`)
    .join("\n")}
`;

// Generate styled components
module.exports.styled = ({
  node: { name, children }
}) => `import styled from 'styled-components/macro'

export const ${name} = styled.div\`\`
${children.map(item => `export const ${item.name} = styled.div\`\``).join("\n")}
`;

module.exports.components = ({
  normalizedName,
  node: { children }
}) => `import * as React from 'react'
import {observer} from 'mobx-react-lite'
import * as S from './${normalizedName}.styled'

${children
  .map(
    item =>
      `export const ${item.name}: React.FC = observer(() => <S.${item.name}>TODO: ${item.name}</S.${item.name}>)`
  )
  .join("\n")}
`;

module.exports.stories = ({
  node: { name, type, variants, children },
  normalizedName
}) =>
  `import React from 'react'
import {${name}} from './${normalizedName}'
import * as C from './${normalizedName}.components'

export default {
  title: '${type}|${name}',
  parameters: {
    component: ${name}
  }
}

${variants
  .map(
    item => `export const View${
      item.name === "default" ? "" : `_${item.name}`
    } = () => <${name} />
View${item.name === "default" ? "" : `_${item.name}`}.story = story('${
      item.id
    }')`
  )
  .join("\n\n")}

${children
  .map(
    item =>
      `${item.variants
        .map(
          variant =>
            `export const ${item.name}${
              variant.name !== "default" ? `_${variant.name}` : ""
            } = () => <C.${item.name} />
${item.name}${
              variant.name !== "default" ? `_${variant.name}` : ""
            }.story = story('${variant.id}')`
        )
        .join("\n\n")}`
  )
  .join("\n\n")}

function story(id: string) {
  return {
    parameters: {
      design: {
        type: 'figma',
        url: \`https://www.figma.com/file/${
          process.env.FIGMA_FILE_ID
        }/Components?node-id=\${id}\`
      }
    }
  }
}
`;
