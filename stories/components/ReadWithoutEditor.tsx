
import TiptapParser from 'tiptap-parser';

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

const ReadWithoutEditor = () => {
  return <TiptapParser content={htmlToParse} />;

};

export default ReadWithoutEditor;
