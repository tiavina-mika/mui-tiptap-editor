# mui-tiptap-editor!

<p  align="center">

<b>mui-tiptap-editor</b>: A customizable and easy to use <a href="https://tiptap.dev/">Tiptap</a> styled WYSIWYG rich text editor, using <a  href="https://mui.com/material-ui/getting-started/overview/">Material UI</a>.

</p>


# Files

StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Table of Contents

<details>

- [Demo](#demo)

- [Installation](#installation)

- [Get started](#get-started)

- [Use the all-in-one component](#use-the-all-in-one-component)

- [Create and provide the `editor` yourself](#create-and-provide-the-editor-yourself)

- [Render read-only rich text content](#render-read-only-rich-text-content)

- [mui-tiptap extensions and components](#mui-tiptap-extensions-and-components)

- [Tiptap extensions](#tiptap-extensions)

- [`HeadingWithAnchor`](#headingwithanchor)

- [`FontSize`](#fontsize)

- [`LinkBubbleMenuHandler`](#linkbubblemenuhandler)

- [`ResizableImage`](#resizableimage)

- [`TableImproved`](#tableimproved)

- [Components](#components)

- [Controls components](#controls-components)

- [Localization](#localization)

- [Tips and suggestions](#tips-and-suggestions)

- [Choosing your editor `extensions`](#choosing-your-editor-extensions)

- [Extension precedence and ordering](#extension-precedence-and-ordering)

- [Other extension tips](#other-extension-tips)

- [Drag-and-drop and paste for images](#drag-and-drop-and-paste-for-images)

- [Re-rendering `RichTextEditor` when `content` changes](#re-rendering-richtexteditor-when-content-changes)

- [Contributing](#contributing)
</details>

## Installation

```shell

npm  install  mui-tiptap-editor

```
or
```shell

yarn  add  mui-tiptap-editor

```

## Get started

#### Simple usage

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

See [`example/App.tsx`](..example/App.tsx) for a more thorough example of using `TextEditor`.

## Customization

### Toolbar
<p> Can display the menus as needed</p>

```tsx
  import { TextEditor } from 'mui-tiptap-editor';

  function App() {
    return (
      <TextEditor toolbar={['bold', 'italic', 'underline']} />
    );
  }
```

### Styles
#### Root styles

```tsx
import './index.css';

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
import './index.css';

function App () {
  return (
    <TextEditor
      value="<p>Hello word!</p>"
      label="Content"
      tabClassName="my-tab"
      labelClassName="my-label"
      inputClassName="my-input"
    />
  )
}
```

```css
/* ./index.css */
.my-tab.MuiTab-root.Mui-selected {
  background-color: pink !important;
}

.my-label {
  color: blue !important;
}

.my-input {
  border: 1px solid green;
}
```


## Props

|props |type                          | Default value                         | Description |
|----------------|-------------------------------|-----------------------------|-----------------------------|
|toolbar|`string[]`| heading, bold, italic, strike, link, underline, image, code, orderedList, bulletList, align, codeBlock, blockquote, table, history, youtube, color, mention, ai| The list of the menu buttons to be displayed|
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
|value|`string`|empty| Value of the input
|onChange|`(value: string) => void`|empty| Function to call when the input change
|...all tiptap features|[EditorOptions](https://github.com/ueberdosis/tiptap/blob/e73073c02069393d858ca7d8c44b56a651417080/packages/core/src/types.ts#L52)|empty| Can access to all tiptap `useEditor` props
