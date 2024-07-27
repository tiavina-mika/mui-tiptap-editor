import Mention, { MentionOptions } from "@tiptap/extension-mention";
import { mergeAttributes } from '@tiptap/react';
import getSuggestion from "../components/mention/suggestions";
import { Node } from "@tiptap/pm/model";
import { ITextEditorOption } from "../types";

type Props = {
  pathname?: string;
  mentions?: ITextEditorOption[];
};

/**
 * mention extension
 * mention user in the editor, and link to the select profile
 */
export const getCustomMention = ({
  pathname = "/users",
  mentions
}: Props) => {
  const extendsOption = {
    // use a link (with url) instead of the default span
    renderHTML({ node, HTMLAttributes }: Record<string, any>) {
      return [
        "a",
        mergeAttributes(
          { href: `${pathname}/${HTMLAttributes["data-id"]}` },
          this.options.HTMLAttributes,
          HTMLAttributes
        ),
        (this.options as any)?.renderLabel({
          options: this.options,
          node
        })
      ];
    },
    // the attribute should be user id for exemple
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute("data-id"),
          renderHTML: (attributes: any) => {
            if (!attributes.id?.value) {
              return {};
            }

            return {
              "data-id": attributes.id.value
            };
          }
        }
      };
    }
  } as any;

  return Mention
    .extend(extendsOption)
    .configure({
      HTMLAttributes: {
        class: "mention"
      },
      renderLabel({ options, node }: { options: MentionOptions; node: Node }) {
        return `${options.suggestion.char}${
          node.attrs.label ?? node.attrs.id.label
        }`;
      },
      suggestion: getSuggestion(mentions)
    });
}
