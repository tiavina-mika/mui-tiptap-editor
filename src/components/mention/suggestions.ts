'use client';

import { Editor, ReactRenderer } from '@tiptap/react';
import { computePosition, flip, shift } from '@floating-ui/dom';
import { posToDOMRect } from '@tiptap/core';
import Mentions from './Mentions';
import type { MentionOptions } from '@tiptap/extension-mention';
import type { ITextEditorOption } from '../../types.d';

const updatePosition = (editor: Editor, element: HTMLElement) => {
  const virtualElement = {
    getBoundingClientRect: () => {
      return posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to);
    },
  };

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content';
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
};

/**
 * Get suggestion for mention
 */

const getSuggestion = (options: ITextEditorOption[] = []): MentionOptions['suggestion'] => ({
  items: ({ query }: { query: string }) => {
    return options
      .filter((option: ITextEditorOption) => (option.label).toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let component: any;
    // let popup: any;

    return {
      onStart: (props: Record<string, any>) => {
        component = new ReactRenderer(Mentions, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        if (!component) return;
        if (typeof document === 'undefined') {
          return;
        }

        component.element.style.position = 'absolute';

        document.body.appendChild(component.element);

        updatePosition(props.editor, component.element);
        /*
         * popup = tippy('body', {
         *   getReferenceClientRect: props.clientRect,
         *   appendTo: () => document.body,
         *   content: component.element,
         *   showOnCreate: true,
         *   interactive: true,
         *   trigger: 'manual',
         *   placement: 'bottom-start',
         * } as any);
         */
      },

      onUpdate: (props: Record<string, any>) => {
        if (!component) return;
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        /*
         * popup[0].setProps({
         *   getReferenceClientRect: props.clientRect,
         * });
         */

        updatePosition(props.editor, component.element);
      },

      onKeyDown: (props: Record<string, any>) => {
        if (props.event.key === 'Escape') {
          // popup[0].hide();
          component.destroy();


          return true;
        }

        return component.ref?.onKeyDown(props);

      },

      onExit: () => {
        component.element.remove();
        component.destroy();
      },
    };
  },
});

export default getSuggestion;
