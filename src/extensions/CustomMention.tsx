'use client';

import { Mention } from '@tiptap/extension-mention';
import { mergeAttributes } from '@tiptap/core';
import getSuggestion from '../components/mention/suggestions';
import type { ITextEditorOption } from '../types';

type Props = {
  // base pathname for the mention link
  pathname?: string;
  // List of user to mention
  mentions?: ITextEditorOption[];
};

type HTMLAttributesType = {
  'data-id'?: string;
};

/**
 * mention extension
 * mention user in the editor, and link to the select profile
 */
export const getCustomMention = ({ pathname = '/users', mentions }: Props) => {
  return Mention.extend({
    addAttributes: () => ({
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
        /*
         * Add the value of id as data-id attribute in the rendered HTML
         * so that we can retrieve it when parsing HTML
         */
        renderHTML: (attributes: any) => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-id': attributes.id,
          };
        },
      },
    }),
    // Create a link to the user profile
    // eslint-disable-next-line @typescript-eslint/naming-convention
    renderHTML: ({
      node,
      HTMLAttributes,
    }: {
      node: any;
      HTMLAttributes: HTMLAttributesType;
    }) => {
      return [
        'a',
        // @example: <a href="/users/1" class="mention">@user1</a>
        mergeAttributes(HTMLAttributes, {
          href: `${pathname}/${node.attrs.id.value}`,
          class: 'mention',
        }),
        // Text to be displayed in the editor
        `${node.attrs.id.label ?? node.attrs.id.value}`,
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: 'mention',
    },
    renderText: ({ options, node }: any) =>
      `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
    suggestion: getSuggestion(mentions),
  });
};
