# mui-tiptap-editor

<p align="left">
A customizable and easy to use <a href="https://tiptap.dev/">Tiptap</a> styled WYSIWYG rich text editor, using <a  href="https://mui.com/material-ui/getting-started/overview/">Material UI</a>.
</p>

<!-- [START BADGES] -->
<!-- Please keep comment here to allow auto update -->
[![NPM Version](https://img.shields.io/npm/v/mui-tiptap-editor?style=flat-square)](https://www.npmjs.com/package/mui-tiptap-editor)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org)
<!-- [END BADGES] -->
## Table of Contents

<details>

- [mui-tiptap-editor](#mui-tiptap-editor)
  - [Table of Contents](#table-of-contents)
  - [Demo](#demo)
  - [Installation](#installation)
  - [Get started](#get-started)
    - [Simple usage](#simple-usage)
    - [Using mentions](#using-mentions)
    - [Read only](#read-only)
  - [Customization](#customization)
    - [Toolbar](#toolbar)
    - [Styles](#styles)
      - [Root styles](#root-styles)
      - [Each element styles](#each-element-styles)
  - [Props](#props)
  - [Contributing](#contributing)

</details>

## Demo

- **[CodeSandbox live demo](https://codesandbox.io/s/github/tiavina-mika/mui-tiptap-editor-demo)**
- **[Live demo](https://mui-tiptap-editor.netlify.app/)**
- **[Demo video](https://www.youtube.com/watch?v=_VhLVN51cwo)**


<img alt="Screenshot" src="https://github.com/tiavina-mika/mui-tiptap-editor/blob/main/screenshots/screenshot.png" />

## Installation

```shell

npm install mui-tiptap-editor

```
or
```shell

yarn add mui-tiptap-editor

```
Please note that [`@mui/material`](https://mui.com/material-ui/getting-started/installation/) (and their `@emotion/` peers) are peer dependencies, meaning you should ensure they are installed before installing `mui-tiptap-editor`.

```shell
npm install @mui/material @emotion/react @emotion/styled
```
or
```shell
yarn add @mui/material @emotion/react @emotion/styled
```

## Get started

### Simple usage

```tsx
import { TextEditor, TextEditorReadOnly } from 'mui-tiptap-editor';
import { useState } from "react";

function App() {
  const [value, setValue] = useState<string>("");

  const handleChange = (newValue: string) => setValue(newValue);

  return (
    <div>
      <TextEditor value={value} onChange={handleChange} />
      {value && <TextEditorReadOnly value={value} />}
    </div>
  );
}
```

### Using mentions

```tsx
import { TextEditor, ITextEditorOption } from 'mui-tiptap-editor';

const mentions: ITextEditorOption[] = [
  { label: "Lea Thompson", value: "id1" },
  { label: "Cyndi Lauper", value: "id2" },
  { label: "Tom Cruise", value: "id13" },
];

const currentUser: ITextEditorOption = mentions[0];

function App() {
  return (
    <TextEditor mentions={mentions} user={currentUser} userPathname="/profile" />
  );
}
```

See [`here`](https://github.com/tiavina-mika/mui-tiptap-editor/tree/main/example) for more examples that use `TextEditor`.

### Read only

1. If using the editor
```tsx
import { TextEditorReadOnly } from 'mui-tiptap-editor';

<TextEditorReadOnly value="<h1>Hello word!</h1>" />
```

2. If it's just to display the value without using the editor, you can use this [`tiptap-parser`](https://www.npmjs.com/package/tiptap-parser) library. Example: The editor is used in the back office, but the content is to be displayed on the website
```tsx
import TiptapParser from "tiptap-parser";

const html = `<h1>Hello world</h1>`;

function App() {
  return (
    <TiptapParser content={html} />
  );
}
```

## Customization

### Toolbar
<p> Can display the menus as needed</p>

```tsx
  <TextEditor toolbar={['bold', 'italic', 'underline']} />
```

### Styles
#### Root styles

```tsx
import './index.css';
import { TextEditor } from 'mui-tiptap-editor';

function App () {
  return (
    <TextEditor
      value="<p>Hello word!</p>"
      rootClassName="root"
    />
  )
}
```

```css
/* ./index.css */
.root {
  background-color: #fff;
}
.root  .MuiTab-root.Mui-selected {
  background-color: yellow  !important;
}
```

#### Each element styles

```tsx
import { TextEditor } from 'mui-tiptap-editor';

function App () {
  return (
    <TextEditor
      value="<p>Hello word!</p>"
      label="Content"
      tabClassName="bg-black"
      labelClassName="text-sm"
      inputClassName="border border-gray-200"
      toolbarClassName="bg-gray-500"
    />
  )
}
```

## Props

|props |type                          | Default value                         | Description |
|----------------|-------------------------------|-----------------------------|-----------------------------|
|toolbar|`string[]`| heading, bold, italic, strike, link, underline, image, code, orderedList, bulletList, align, codeBlock, blockquote, table, history, youtube, color, mention| The list of the menu buttons to be displayed|
|placeholder|`string`|empty|input placeholder
|label|`string`|empty|input label
|error|`string`|empty| Error message to display
|withFloatingMenu|`boolean`|false| Show or hide the [floating menu](https://tiptap.dev/docs/editor/api/extensions/floating-menu)
|withBubbleMenu|`boolean`|true| Show or hide the [bubble menu](https://tiptap.dev/docs/editor/api/extensions/bubble-menu)
|inputClassName|`string`|empty| Override input styles
|toolbarClassName|`string`|empty|  Override the toolbar menu styles
|tabsClassName|`string`|empty| Override the tabs (`preview`, `editor`) styles
|tabClassName|`string`|empty| Override the tab (`preview` or `editor`) styles
|errorClassName|`string`|empty| Override the error message styles
|rootClassName|`string`|empty| Override the main container styles
|labelClassName|`string`|empty| Override the label styles
|bubbleMenuToolbar|`string[]`|`['bold', 'italic', 'underline', 'link']`| Similar to `toolbar` props
|floatingMenuToolbar|`string[]`|`['bold', 'italic', 'underline', 'link']`| Similar to `toolbar` props
|mentions|`ITextEditorOption[]`|undefined| List of users to be mentioned when entering or selecting `@`
|user|`ITextEditorOption`|undefined| Current user
|value|`string`|empty| Value of the input
|onChange|`(value: string) => void`|-| Function to call when the input change
|userPathname|`boolean`|/user| URL pathname for the mentioned user (eg: /user/user_id)
|...all tiptap features|[EditorOptions](https://github.com/ueberdosis/tiptap/blob/e73073c02069393d858ca7d8c44b56a651417080/packages/core/src/types.ts#L52)|empty| Can access to all tiptap `useEditor` props

## Contributing

Get started [here](https://github.com/tiavina-mika/mui-tiptap-editor/blob/main/CONTRIBUTING.md).
