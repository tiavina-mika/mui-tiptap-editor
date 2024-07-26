# mui-tiptap-editor

<p align="left">
A customizable and easy to use <a href="https://tiptap.dev/">Tiptap</a> styled WYSIWYG rich text editor, using <a  href="https://mui.com/material-ui/getting-started/overview/">Material UI</a>.
</p>

<!-- [START BADGES] -->
<!-- Please keep comment here to allow auto update -->
[![NPM Version](https://img.shields.io/npm/v/mui-tiptap-editor?style=flat-square)](https://www.npmjs.com/package/mui-tiptap-editor)
[![Language](https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org)
[![Build](https://github.com/tiavina-mika/mui-tiptap-editor/actions/workflows/release.yml/badge.svg)](https://github.com/tiavina-mika/mui-tiptap-editor/actions)
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
    - [Image upload](#image-upload)
    - [Read only](#read-only)
  - [Customization](#customization)
    - [Toolbar](#toolbar)
    - [Override labels](#override-labels)
    - [Styles](#styles)
      - [Root styles](#root-styles)
      - [Each element styles](#each-element-styles)
  - [Props](#props)
  - [Image upload props `ImageUploadOptions`](#image-upload-props-imageuploadoptions)
  - [New features](#new-features)
      - [v0.9.9](#v099)
      - [v0.9.6](#v096)
      - [v0.9.0](#v090)
  - [Contributing](#contributing)

</details>

## Demo

- **[CodeSandbox demo](https://codesandbox.io/s/github/tiavina-mika/mui-tiptap-editor-demo)**
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
  { label: "Tom Cruise", value: "id3" },
];

const currentUser: ITextEditorOption = mentions[0];

function App() {
  return (
    <TextEditor mentions={mentions} user={currentUser} userPathname="/profile" />
  );
}
```
### Image upload

![Gif](https://github.com/tiavina-mika/mui-tiptap-editor/blob/main/screenshots/image-upload.gif)

<ul>
<li>The image can be uploaded to the server via an API call or directly into the content as base64 string. </li>
<li>For the moment we can only upload via drag and drop and copy paste.</li>
<li>Add or modify the alt text of the image</li>
<li>Delete the selected image using `Delete` keyboard key</li>
</ul>

```tsx
// example of API using axios
// note that the response should be directly the image url
// so it can be displayed in the editor
function uploadImage(file) {
  const data = new FormData();
  data.append('file', file);
  const response = axios.post('/documents/image/upload', data);
  return response.data;
};

function App() {
  return (
    <TextEditor
      uploadImageOptions={{
        uploadImage: uploadImage, // the image is stored and used as base64 string if not specified
        maxSize: 5, // max size to 10MB if not specified
        maxFilesNumber: 2,  // max 5 files if not specified
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'], // all image types if not specified
      }}
    />
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

2. If it is just displaying the value without using the editor, you can use this library [`tiptap-parser`](https://www.npmjs.com/package/tiptap-parser). Example: The editor is used in the back office, but the content must be displayed on the website
```tsx
<TiptapParser content={`<h1>Hello world</h1>`} />
```

## Customization

### Toolbar
<p> Can display the menus as needed</p>

```tsx
  <TextEditor toolbar={['bold', 'italic', 'underline']} />
```

### Override labels
```tsx
  <TextEditor
    labels={{
      editor: {
        editor: "Editeur",
        preview: "Aperçu"
      },
      toolbar: {
        bold: "Gras",
        italic: "Italique",
        strike: "Barré",
        underline: "Souligné",
        link: "Lien",
        bulletList: "Liste à puces",
        orderedList: "Liste ordonnée",
        alignLeft: "Aligner à gauche",
        alignCenter: "Aligner au centre",
        alignRight: "Aligner à droite",
        alignJustify: "Justifier",
        blockquote: "Citation",
        codeBlock: "Code",
        table: "Table",
        youtube: "Youtube",
        undo: "Annuler",
        redo: "Refaire",
        mention: "Mention"
      },
      headings: {
        normalText: "Text normal",
        h1: "En-tête 1",
        h2: "En-tête 2",
        h3: "En-tête 3",
        h4: "En-tête 4",
        h5: "En-tête 5",
        h6: "En-tête 6"
      },
      table: {
        table: "Tableau",
        addColumnBefore: "Ajouter une colonne avant",
        addColumnAfter: "Ajouter une colonne après",
        deleteColumn: "Supprimer la colonne",
        addRowBefore: "Ajouter une ligne avant",
        addRowAfter: "Ajouter une ligne après",
        deleteRow: "Supprimer la ligne",
        mergeCells: "Fusionner les cellules",
        splitCell: "Diviser la cellule",
        deleteTable: "Supprimer le tableau",
        insertTable: "Insérer un tableau",
        toggleHeaderCell: "Basculer la cellule d'en-tête",
        toggleHeaderColumn: "Basculer la colonne d'en-tête",
        toggleHeaderRow: "Basculer la ligne d'en-tête",
        mergeOrSplit: "Fusionner ou diviser",
        setCellAttribute: "Définir l'attribut de cellule"
      },
      link: {
        link: "Lien",
        insert: "Insérer le lien",
        invalid: "Lien invalide",
      },
      youtube: {
        link: "Lien",
        insert: "Insérer la vidéo Youtube",
        title: "Insérer une vidéo Youtube",
        invalid: "Lien invalide",
        enter: "Entrer le lien",
        height: "Hauteur",
        width: "Largeur"
      },
      imageUpload: {
        fileTooLarge: "Fichier trop volumineux",
        maximumNumberOfFiles: "Nombre maximum de fichiers atteint",
        enterValidAltText: "Entrez un texte alternatif valide",
        addAltText: "Ajouter un texte alternatif",
        invalidMimeType: "Type de fichier invalide",
      },
    }}
  />
```

### Styles
#### Root styles

```tsx
import './index.css';

<TextEditor
  value="<p>Hello word!</p>"
  rootClassName="root"
/>
```

```css
/* ./index.css */
.root {
  background-color: #fff;
}
.root  .MuiTab-root.Mui-selected {
  background-color: yellow;
}
```

#### Each element styles

```tsx
<TextEditor
  value="<p>Hello word!</p>"
  label="Content"
  tabClassName="bg-black"
  labelClassName="text-sm"
  inputClassName="border border-gray-200"
  toolbarClassName="bg-gray-500"
/>
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
|userPathname|`string`|/user| URL pathname for the mentioned user (eg: /user/user_id)
|labels|`ILabels`|null| Override labels, for example using `i18n`
|uploadImageOptions|`ImageUploadOptions`|null| Override image upload default options like max size, max file number, ...
|...all tiptap features|[EditorOptions](https://github.com/ueberdosis/tiptap/blob/e73073c02069393d858ca7d8c44b56a651417080/packages/core/src/types.ts#L52)|empty| Can access to all tiptap `useEditor` props

## Image upload props `ImageUploadOptions`
|props |type                          | Default value                         | Description |
|----------------|-------------------------------|-----------------------------|-----------------------------|
|uploadImage|`function`|undefined|an API call to your server to handle and store the image
|maxSize|`number`|10|maximum size of the image in MB
|maxFilesNumber|`number`|5|maximum number of files to be uploaded at once
|allowedMimeTypes|`string[]`|all image types|allowed mime types to be uploaded



## New features
#### [v0.9.9](https://github.com/tiavina-mika/mui-tiptap-editor/pull/52)
- Upload image via drop or paste
- Add or edit the image alt text

#### v0.9.6
- Work with dark mode
#### v0.9.0
- Customize and override all messages and labels

## Contributing

Get started [here](https://github.com/tiavina-mika/mui-tiptap-editor/blob/main/CONTRIBUTING.md).
