# Figmator

## (part of Smashing toolbox)

> **[View Storybook](https://github.com/eyedea-io/smashing-ui/deployments?environment=storybook#activity-log)**

## Getting started

**Install theme**

```sh
yarn add @smashing/theme
```

**Add Theme Provider**

```tsx
import { SmashingThemeProvider } from "@smashing/theme";

const App = () => <SmashingThemeProvider>{/* ... */}</SmashingThemeProvider>;
```

You can read more about [smashing theme provider](https://github.com/eyedea-io/smashing-ui/tree/master/packages/theme) to learn how to customize theme.

## Components

### Core

- **[Alert](https://github.com/eyedea-io/smashing-ui/tree/master/packages/alert)** - Component used to give feedback to the user about an action or state.
- **[Avatar](https://github.com/eyedea-io/smashing-ui/tree/master/packages/avatar)** - Component used to represent users.
- **[Button](https://github.com/eyedea-io/smashing-ui/tree/master/packages/button)** - Common button component
- **[Dialog](https://github.com/eyedea-io/smashing-ui/tree/master/packages/dialog)** - Component is used to show content on top of an overlay.
- **[Menu](https://github.com/eyedea-io/smashing-ui/tree/master/packages/menu)** - Multiple components that help create menus.
- **[Popover](https://github.com/eyedea-io/smashing-ui/tree/master/packages/popover)** - Component displays floating content in relation to a target.
- **[Select](https://github.com/eyedea-io/smashing-ui/tree/master/packages/select)** - Simple select component being an overlay to a default system one.
- **[TextInput](https://github.com/eyedea-io/smashing-ui/tree/master/packages/text-input)** - Text input component used in forms.
- **[Tooltip](https://github.com/eyedea-io/smashing-ui/tree/master/packages/tooltip)** - Component used to describe icon buttons.

### Typography

- **[Text](https://github.com/eyedea-io/smashing-ui/tree/master/packages/typography)** - Inline text component.
- **[Strong](https://github.com/eyedea-io/smashing-ui/tree/master/packages/typography)** - Bold variant of Text component.
- **[Paragraph](https://github.com/eyedea-io/smashing-ui/tree/master/packages/typography)** - Component used for bigger chunks of texts.
- **[Heading](https://github.com/eyedea-io/smashing-ui/tree/master/packages/typography)** - Component used for article and section titles.
- **[Label](https://github.com/eyedea-io/smashing-ui/tree/master/packages/typography)** - Component used to describe form inputs.

### Functional

- **[Head](https://github.com/eyedea-io/smashing-ui/tree/master/packages/head)** - Manage page `<head>` tag content.
- **[Title](https://github.com/eyedea-io/smashing-ui/tree/master/packages/title)** - Manage page `<title>` tag content.
- **[css](https://github.com/eyedea-io/smashing-ui/tree/master/packages/css)** - Global css styles - normalize.css and reset.
