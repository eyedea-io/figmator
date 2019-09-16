# Figmator

###### (part of Smashing toolbox)

Figmator is a tool for turning your Figma workspace into React component tree with Storybook entries generated. It requires your Figma project to contain specifically named parts, which in turn is being fetched using Figma API and transformed into beautiful page and component structure.

## Getting started

**Preparing your Figma project**

Inside your Figma file, you should create a page named "Symbols". There, Figmator will search for all top-level entities are either **pages**, **components**, **subcomponents** or **component variants**. In order to be recognized, their names should match one of the following patterns:

```
page/PAGE_NAME
page/PAGE_NAME/SUBCOMPONENT_NAME
component/COMPONENT_NAME
component/COMPONENT_NAME/SUBCOMPONENT_NAME
component/COMPONENT_NAME/|COMPONENT_VARIANT
component/COMPONENT_NAME/SUBCOMPONENT_NAME/|SUBCOMPONENT_VARIANT
```

For instance, if you would have a following set of objects:

```
component/Footer
component/Header
component/Header/Logo
page/LandingPage
page/LandingPage/HeroSection
page/LandingPage/HeroSection|SpecialPromotion
page/LandingPage/Services
```

It would yield following folder structure:

```
|-- figma-output
    |-- components
    |   |-- footer
    |   |   |-- footer.components.tsx
    |   |   |-- footer.stories.tsx
    |   |   |-- footer.styled.tsx
    |   |   |-- footer.tsx
    |   |   |-- index.tsx
    |   |-- header
    |   |   |-- header.components.tsx
    |   |   |-- header.stories.tsx
    |   |   |-- header.styled.tsx
    |   |   |-- header.tsx
    |   |   |-- index.tsx
    |-- pages
        |-- landing-page
        |   |-- landing-page.components.tsx
        |   |-- landing-page.stories.tsx
        |   |-- landing-page.styled.tsx
        |   |-- landing-page.tsx
        |   |-- index.tsx
```

Worth noting:

- After peeking into `header.components.tsx` / `header.styled.tsx`, you should be able to see entries for the `Logo` subcomponent.
- Similarly, you should be able to see definitions for `HeroSection` and `Services` inside `landing-page.components.tsx` and `landing-page.styled.tsx`.
- There should be a Storybook entry for `SpecialPromotion` variant in `HeroSection` subcomponent.

**How to use the CLI**

```sh
# in your web application's working directory
npx @smashing/figmator
```

After running this command, you will be prompted to enter your Figma API KEY and your Figma's file ID.

> Note: you can get file ID by opening it in Figma's web application and extracting it from the URL: https://www.figma.com/file/**<PROJECT_ID>\*\*/project-name

```sh
users-MacBook-Pro:f hubert$ npx @smashing/figmator
-------------------------------------
Figmator v.0.3.0
Please use --help switch to get help.
-------------------------------------
✔ Please enter Figma API key … *****
? Please enter Figma file ID › XYZ-123-ABC

```

Afterwards, the tool will attempt to extract your Figma file's structure (described above) and put the result in the output directory, which defaults to the `figma-output`. You can change it by using `--output-dir` flag:

```sh
npx @smashing/figmator --output-dir=some/other/dir
```

## License

MIT License

Copyright (c) 2019 Eyedea

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
