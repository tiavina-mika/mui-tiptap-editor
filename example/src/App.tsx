
import { Container, CssBaseline, Tab, Tabs, ThemeProvider, createTheme } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { TextEditor, TextEditorReadOnly } from 'mui-tiptap-editor';
import WithHookForm from './WithHookForm';

const tabs = [
  'Simple input',
  'Select toolbar',
  'Read only',
  'Custom global styles',
  'Each element styles',
  'Mentions',
  'With React Hook Form'
];

const mentions = [
  { label: "Lea Thompson", value: "xxxx1" },
  { label: "Cyndi Lauper", value: "xxxx2" },
  { label: "Tom Cruise", value: "xxxx3" },
  { label: "Madonna", value: "xxxx4" },
  { label: "Jerry Hall", value: "xxxx5" },
  { label: "Joan Collins", value: "xxxx6" },
  { label: "Winona Ryder", value: "xxxx7" },
  { label: "Christina Applegate", value: "xxxx8" },
  { label: "Alyssa Milano", value: "xxxx9" },
  { label: "Molly Ringwald", value: "xxxx10" },
  { label: "Ally Sheedy", value: "xxxx11" },
  { label: "Debbie Harry", value: "xxxx12" },
  { label: "Olivia Newton-John", value: "xxxx13" },
  { label: "Elton John", value: "xxxx14" },
  { label: "Michael J. Fox", value: "xxxx15" },
  { label: "Axl Rose", value: "xxxx16" },
  { label: "Emilio Estevez", value: "xxxx17" },
  { label: "Ralph Macchio", value: "xxxx18" },
  { label: "Rob Lowe", value: "xxxx19" },
  { label: "Jennifer Grey", value: "xxxx20" },
  { label: "Mickey Rourke", value: "xxxx21" },
  { label: "John Cusack", value: "xxxx22" },
  { label: "Matthew Broderick", value: "xxxx23" },
  { label: "Justine Bateman", value: "xxxx24" },
  { label: "Lisa Bonet", value: "xxxx25" }
];

const currentUser = mentions[0];

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  const [tab, setTab] = useState<number>(0);
  
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {/* tabs */}
        <Tabs value={setTab} onChange={handleChange} aria-label="tabs">
          {tabs.map((label, index) => (
            <Tab key={index} label={label} value={index} />
          ))}
        </Tabs>

        {tab === 0 && (
          <TextEditor
            placeholder='Type something here...'
            toolbar={['bold', 'italic', 'underline']}
          />
        )}
        {tab === 1 && (
          <TextEditor
            placeholder='Type something here...'
            toolbar={['bold', 'italic', 'underline']}
          />
        )}
        {tab === 2 && (
          <TextEditorReadOnly
            value="<p>Hello word!</p>"
          />
        )}
        {tab === 3 && (
          <TextEditor
            value="<p>Hello word!</p>"
            rootClassName="root"
          />
        )}
        {tab === 4 && (
          <TextEditor
            value="<p>Hello word!</p>"
            label="Content"
            tabClassName="my-tab"
            labelClassName="my-label"
            inputClassName="my-input"
          />
        )}
        {tab === 5 && (
          <TextEditor
            label="Content"
            mentions={mentions}
            user={currentUser}
          />
        )}
        {tab === 6 && <WithHookForm />}
      </Container>
    </ThemeProvider>
  )
}

export default App
