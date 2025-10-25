/* eslint-disable @cspell/spellchecker */
import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'TextEditor/Labels',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

const customLabels = {
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
  },
};

export const Labels: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    labels: customLabels,
  },
};
