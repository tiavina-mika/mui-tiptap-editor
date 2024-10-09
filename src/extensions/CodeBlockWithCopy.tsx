/**
 * This file defines a custom CodeBlockWithCopy component for use with the TipTap editor.
 * It includes a button to copy the code block content to the clipboard.
 * The component uses lowlight for syntax highlighting and integrates with TipTap's NodeViewRenderer.
 */

import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react';
import { useState } from 'react';
import { createLowlight, common } from "lowlight";
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { CodeBlockWithCopyProps } from '../types';
import Copy from '../icons/Copy';
import Check from '../icons/Check';

const CodeBlockWithCopy = ({ node }: any) => {
  const [copied, setCopied] = useState(false);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(node.textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // "Copied!" message for 2 seconds
    });
  };

  return (
    <NodeViewWrapper className="code-block-root">
      <button onClick={copyToClipboard}>
        {copied ? <Check /> : <Copy />}
      </button>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export const getCodeBlockWithCopy = (props?: CodeBlockWithCopyProps) => {
  const { language = 'javascript', className } = props || {};

  return CodeBlockLowlight
  .extend({
    addNodeView() {
      // Use ReactNodeViewRenderer to render the CodeBlockWithCopy component
      return ReactNodeViewRenderer(
        (props: any) => <CodeBlockWithCopy {...props} />,
        { className }
      );
    },
  })
  .configure({
    // Configure lowlight with common languages and set default language
    lowlight: createLowlight(common),
    defaultLanguage: language,
  })
}