import { elementFromString } from '@tiptap/core';
import { DOMParser as ProseMirrorDOMParser } from '@tiptap/pm/model';

import type { ResolvedPos, Schema, Slice } from '@tiptap/pm/model';

/*
 * matches an actual opening HTML tag (e.g. "<h1>", "<p class="x">") so a lone
 * "<" in plain text (math, comparisons…) never triggers HTML parsing
 */
const HTML_TAG_REGEX = /<([a-z][a-z0-9]*)\b[^>]*>/i;

export const isPastedTextHtml = (text: string): boolean => HTML_TAG_REGEX.test(text);

/*
 * `EditorView` (from `@tiptap/pm/view`) resolves its `state.schema` type against a hoisted
 * `prosemirror-model` copy that the build pipeline treats as distinct from `@tiptap/pm/model`'s
 * own nested copy, even though both are the same object at runtime — so the paste callback is
 * typed against this minimal shape instead of the full `EditorView` type to sidestep that clash.
 */
type PasteEditorView = { state: { schema: Schema } };

/**
 * Parses pasted plain text as HTML when it looks like markup, so raw HTML copied from a plain
 * `<textarea>` or code editor (no `text/html` clipboard entry) renders instead of showing up as
 * literal tag characters. Returns `undefined` for regular text to keep the default paste
 * behavior (used as ProseMirror's `clipboardTextParser` editor prop).
 */
export const clipboardTextParser = (
  text: string,
  $context: ResolvedPos,
  _plainText: boolean,
  view: PasteEditorView
): Slice | undefined => {
  if (!isPastedTextHtml(text)) return undefined;

  const dom = elementFromString(text);

  return ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(dom, {
    preserveWhitespace: true,
    context: $context,
  });
};
