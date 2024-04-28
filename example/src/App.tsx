
import { Container, CssBaseline, Tab, Tabs, ThemeProvider, createTheme } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { TextEditor } from 'mui-tiptap-editor';
import WithHookForm from './WithHookForm';

const tabs = ['Simple input', 'Select toolbar', 'With React Hook Form'];

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
        {tab === 2 && <WithHookForm />}
      </Container>
    </ThemeProvider>
  )
}

export default App
