import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import {
  Container, CssBaseline, ThemeProvider, createTheme,
} from '@mui/material';
import TextEditor from '../components/TextEditor';

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

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <EmotionThemeProvider theme={theme}>
        <Container>
          <TextEditor
            withFloatingMenu
            disableTabs={false}
            inputClassName="flexColumn stretchSelf flex1"
            label="Content"
            mentions={mentions}
            placeholder="Enter your content here"
            toolbarPosition="top"
            user={currentUser}
            labels={{
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
                codeBlock: 'Code block',
                inlineCode: 'Inline code',
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
              },
            }}
            uploadFileOptions={{
              uploadFile,
              maxSize: 5,
              maxFilesNumber: 2,
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
              imageMaxWidth: 900,
              imageMaxHeight: 500,
            }}
          />
        </Container>
      </EmotionThemeProvider>
    </ThemeProvider>
  );
};

export default App;
