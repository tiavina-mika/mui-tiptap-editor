
import {
  Box, Container, CssBaseline, FormControlLabel, Switch, Tab, Tabs, ThemeProvider, createTheme,
} from '@mui/material';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { TextEditor, TextEditorReadOnly, type ILabels, type ToolbarIcons } from 'mui-tiptap-editor';
import TiptapParser from 'tiptap-parser';
import WithHookForm from './WithHookForm';

const customLabels: ILabels = {
  editor: {
    editor: 'Editeur',
    preview: 'Aperçu',
  },
  toolbar: {
    bold: 'Gras',
    italic: 'Italique',
    strike: 'Barré',
    underline: 'Souligné',
    link: 'Lien',
    bulletList: 'Liste à puces',
    orderedList: 'Liste ordonnée',
    alignLeft: 'Aligner à gauche',
    alignCenter: 'Aligner au centre',
    alignRight: 'Aligner à droite',
    alignJustify: 'Justifier',
    blockquote: 'Citation',
    inlineCode: 'Inline code',
    codeBlock: 'Code',
    table: 'Table',
    youtube: 'Youtube',
    undo: 'Annuler',
    redo: 'Refaire',
    mention: 'Mention',
    color: 'Couleur du texte',
    upload: 'Ajouter une image',
  },
  headings: {
    normalText: 'Text normal',
    h1: 'En-tête 1',
    h2: 'En-tête 2',
    h3: 'En-tête 3',
    h4: 'En-tête 4',
    h5: 'En-tête 5',
    h6: 'En-tête 6',
  },
  table: {
    table: 'Tableau',
    addColumnBefore: 'Ajouter une colonne avant',
    addColumnAfter: 'Ajouter une colonne après',
    deleteColumn: 'Supprimer la colonne',
    addRowBefore: 'Ajouter une ligne avant',
    addRowAfter: 'Ajouter une ligne après',
    deleteRow: 'Supprimer la ligne',
    mergeCells: 'Fusionner les cellules',
    splitCell: 'Diviser la cellule',
    deleteTable: 'Supprimer le tableau',
    insertTable: 'Insérer un tableau',
    toggleHeaderCell: 'Basculer la cellule d\'en-tête',
    toggleHeaderColumn: 'Basculer la colonne d\'en-tête',
    toggleHeaderRow: 'Basculer la ligne d\'en-tête',
    mergeOrSplit: 'Fusionner ou diviser',
    setCellAttribute: 'Définir l\'attribut de cellule',
  },
  link: {
    link: 'Lien',
    invalid: 'Lien invalid',
  },
  youtube: {
    link: 'Lien',
    insert: 'Insérer la vidéo Youtube',
    title: 'Insérer une vidéo Youtube',
    invalid: 'Lien invalide',
    enter: 'Entrer le lien',
    height: 'Hauteur',
    width: 'Largeur',
  },
  upload: {
    fileTooLarge: 'Fichier trop volumineux',
    maximumNumberOfFiles: 'Nombre maximum de fichiers atteint',
    enterValidAltText: 'Entrez un texte alternatif valide',
    addAltText: 'Ajouter un texte alternatif',
    invalidMimeType: 'Type de fichier invalide',
    shouldBeAnImage: 'Le fichier doit être une image',
    addLegendText: 'Ajouter un texte de légende',
    enterValidLegendText: 'Entrez un texte de légende valide',
    imageMaxSize: 'Taille maximale de l\'image',
    noImageUrl: "Aucune URL d'image trouvée dans la réponse de téléchargement",
    invalidImageUrl: 'URL d image invalide',
  },
  tableOfContent: {
    label: 'Table des matières',
    noContentLabel: 'Aucun contenu disponible',
  },
};

const customIcons: ToolbarIcons = {
  // svg icon urls
  bold: {
    src: 'https://img.icons8.com/ios-filled/50/000000/bold.png',
    size: 14,
  },
  italic: {
    src: 'https://img.icons8.com/ios-filled/50/000000/italic.png',
    size: 16,
  },
  link: {
    src: 'https://img.icons8.com/ios-filled/50/000000/link--v1.png',
    size: 16,
  },
  underline: {
    src: 'https://img.icons8.com/ios-filled/50/000000/underline.png',
    size: 14,
  },
  upload: {
    src: 'https://img.icons8.com/ios-filled/50/000000/image--v1.png',
    size: 16,
  },
  table: {
    src: 'https://img.icons8.com/ios-filled/50/000000/table.png',
    size: 16,
  },
  blockquote: {
    src: 'https://img.icons8.com/ios-filled/50/000000/quote-left.png',
    size: 18,
  },
  alignLeft: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-left.png',
    size: 16,
  },
  alignCenter: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-center.png',
    size: 16,
  },
  alignRight: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-right.png',
    size: 16,
  },
  alignJustify: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-justify.png',
    size: 16,
  },
  bulletList: {
    src: 'https://img.icons8.com/ios-filled/50/000000/bulleted-list--v1.png',
    size: 16,
  },
  orderedList: {
    src: 'https://img.icons8.com/ios-filled/50/000000/numbered-list.png',
    size: 16,
  },
  undo: {
    src: 'https://img.icons8.com/ios-filled/50/000000/undo.png',
    size: 18,
  },
  redo: {
    src: 'https://img.icons8.com/ios-filled/50/000000/redo.png',
    size: 18,
  },
  codeBlock: {
    src: 'https://img.icons8.com/ios-filled/50/000000/code.png',
    size: 16,
  },
  mention: {
    src: 'https://img.icons8.com/ios-filled/50/000000/at-sign.png',
    size: 18,
  },
  youtube: {
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.2 0 12 0 12s0 3.8.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.8 24 12 24 12s0-3.8-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    size: 17,
  },
};

const tabs = [
  'Simple',
  'Selected Toolbar',
  'Read only',
  'Custom global styles',
  'Each element styles',
  'Override labels',
  'Mentions',
  'Async initial value',
  'React Hook Form',
  'Read without editor',
  'Upload image',
  'Table of contents',
  'Code block',
  'Custom icons',
];

const mentions = [
  { label: 'Lea Thompson', value: 'xxxx1' },
  { label: 'Cyndi Lauper', value: 'xxxx2' },
  { label: 'Tom Cruise', value: 'xxxx3' },
  { label: 'Madonna', value: 'xxxx4' },
  { label: 'Jerry Hall', value: 'xxxx5' },
  { label: 'Joan Collins', value: 'xxxx6' },
  { label: 'Winona Ryder', value: 'xxxx7' },
  { label: 'Christina Applegate', value: 'xxxx8' },
  { label: 'Alyssa Milano', value: 'xxxx9' },
  { label: 'Molly Ringwald', value: 'xxxx10' },
  { label: 'Ally Sheedy', value: 'xxxx11' },
  { label: 'Debbie Harry', value: 'xxxx12' },
  { label: 'Olivia Newton-John', value: 'xxxx13' },
  { label: 'Elton John', value: 'xxxx14' },
  { label: 'Michael J. Fox', value: 'xxxx15' },
  { label: 'Axl Rose', value: 'xxxx16' },
  { label: 'Emilio Estevez', value: 'xxxx17' },
  { label: 'Ralph Macchio', value: 'xxxx18' },
  { label: 'Rob Lowe', value: 'xxxx19' },
  { label: 'Jennifer Grey', value: 'xxxx20' },
  { label: 'Mickey Rourke', value: 'xxxx21' },
  { label: 'John Cusack', value: 'xxxx22' },
  { label: 'Matthew Broderick', value: 'xxxx23' },
  { label: 'Justine Bateman', value: 'xxxx24' },
  { label: 'Lisa Bonet', value: 'xxxx25' },
];

const currentUser = mentions[0];


const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
  },
});

/**
 * mock long promise
 * mainly for data from API for example
 * @param time
 * @returns
 */
const delay = (time: number) => new Promise((resolve) => {
  setTimeout(resolve, time);
});

const defaultMode = 'light';

const htmlToParse = `
<h1>Display the content without to install the editor</h1>
<p>Use <a href="https://www.npmjs.com/package/tiptap-parser">tiptap-parse</a> for that</p>
<pre>
<code>
  import TiptapParser from "tiptap-parser";

  const html = "Hello world";

  function App() {
    return (
      &lt;TiptapParser content={html} /&gt;
    );
  }
</code>
</pre>
`;

const code = `
<pre><code class="language-typescript">export const suggestIndex = (query: string, data: Article[]) =&gt; {
  const suggestions = data.filter((item: Article) =&gt; {
    const maxDistance = item.title.length - leven(query.toLocaleLowerCase(), item.title.toLocaleLowerCase());
    return maxDistance &gt;= 6;
  });
  return suggestions;
};</code></pre><p></p>
`;

const App = () => {
  const [tab, setTab] = useState<number>(0);
  const [asyncDefaultValue, setAsyncDefaultValue] = useState<string>('');
  const [mode, setMode] = useState<'light' | 'dark'>(defaultMode);

  // load async default value
  useEffect(() => {
    const fetchData = async () => {
      await delay(1000);
      setAsyncDefaultValue('<p>Initial value from API for example</p>');
    };

    fetchData();
  }, []);

  const handleChangeMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // API call to upload file
  const uploadFile = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
    const response = await fetch('https://api.escuelajs.co/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return { id: data.filename, src: data.location };
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.paper', display: 'flex' }}>
        {/* -------------------------------------- */}
        {/* ---------------- tabs ---------------- */}
        {/* -------------------------------------- */}
        <Tabs
          aria-label="tabs"
          orientation="vertical"
          sx={{ mb: 2 }}
          value={tab}
          variant="scrollable"
          onChange={handleChange}
        >
          {tabs.map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{ textAlign: 'left', alignItems: 'start' }}
              value={index}
            />
          ))}
        </Tabs>

        {/* --------------------------------------- */}
        {/* ------------- tabs panels ------------- */}
        {/* --------------------------------------- */}
        <Container style={{ marginTop: 10 }}>
          {/* mode switch */}
          <div style={{ marginBottom: 18 }}>
            <FormControlLabel
              style={{ textTransform: 'capitalize' }}
              label={mode}
              control={
                <Switch checked={mode === defaultMode} onChange={handleChangeMode} />
              }
            />
          </div>
          {/* Simple input */}
          {tab === 0 && <TextEditor id="simple-input" placeholder="Type something here..." onChange={(v: string) => console.log(v)} />}

          {/* Select toolbar */}
          {tab === 1 && (
            <TextEditor
              disableTabs={false}
              id="select-toolbar"
              placeholder="Type something here..."
              toolbar={['bold', 'italic', 'underline']}
              toolbarPosition="top"
            />
          )}
          {/* Read only */}
          {tab === 2 && <TextEditorReadOnly value="<p>Hello word!</p>" />}
          {/* Custom global styles */}
          {tab === 3 && (
            <TextEditor
              id="custom-global-styles"
              rootClassName="root"
              value="<p>Hello word!</p>"
            />
          )}
          {/* Each element styles */}
          {tab === 4 && (
            <TextEditor
              id="each-element-styles"
              label="Content"
              value="<p>Hello word!</p>"
              rootClassName="custom-root"
              labelClassName="custom-label"
              inputClassName="custom-input"
              toolbarClassName="custom-toolbar"
              tabsClassName="custom-tabs"
              tabClassName="custom-tab"
              errorClassName="custom-error"
            />
          )}

          {/* Override labels */}
          {tab === 5 && (
            <TextEditor
              id="override-labels"
              label="Content"
              labels={customLabels}
            />
          )}

          {/* mentions */}
          {tab === 6 && (
            <TextEditor
              id="mentions"
              label="Content"
              mentions={mentions}
              user={currentUser}
              userPathname="/profile"
            />
          )}
          {/* With default async value */}
          {tab === 7 && <TextEditor id="async-value" value={asyncDefaultValue} />}

          {/* With React Hook Form */}
          {tab === 8 && <WithHookForm />}

          {/* Read without editor */}
          {tab === 9 && (
            <TiptapParser content={htmlToParse} />
          )}


          {/* Upload image */}
          {tab === 10 && (
            <TextEditor
              content="<img alt='Cute cat' src='https://png.pngtree.com/png-clipart/20230511/ourmid/pngtree-isolated-cat-on-white-background-png-image_7094927.png' />"
              id="upload-image"
              uploadFileOptions={{
                uploadFile,
                maxSize: 5,
                maxFilesNumber: 2,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
                imageMaxWidth: 900,
                imageMaxHeight: 500,
              }}
            />
          )}

          {/* Table of contents */}
          {tab === 11 && (
            <TextEditor
              content="<h1>Title 1</h1><p>Some text</p><h2>Title 2</h2><p>Some text</p><h3>Title 3</h3><p>Some text</p><h2>Title 4</h2><p>Some text</p><h1>Title 5</h1><p>Some text</p>"
              id="table-of-contents"
              disableTableOfContents={false}
              tableOfContentsPosition="right"
            />
          )}
          {/* With code */}
          {tab === 12 && (
            <TextEditor
              content={code}
              id="code-block"
            />
          )}

          {/* With custom icons */}
          {tab === 13 && (
            <TextEditor
              id="custom-icons"
              icons={customIcons}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
