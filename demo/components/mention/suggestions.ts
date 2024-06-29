import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";

import Mentions from "./Mentions";
import { MentionOptions } from "@tiptap/extension-mention";
import { ITextEditorOption } from "../../types.d";

/**
 * Get suggestion for mention
 */

const getSuggestion = (options: ITextEditorOption[] = []): MentionOptions['suggestion'] => ({
  items: ({ query }: { query: string }) => {
    return options
      .filter((option: ITextEditorOption) => (option.label as string).toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let component: any;
    let popup: any;

    return {
      onStart: (props: Record<string, any>) => {
        component = new ReactRenderer(Mentions, {
          props,
          editor: props.editor
        });

        if (!props.clientRect) {
          return;
        }

        if (!component) return;
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start"
        } as any);
      },

      onUpdate(props: Record<string, any>) {
        if (!component) return;
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        });
      },

      onKeyDown(props: Record<string, any>) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      }
    };
  }
});

export default getSuggestion;
