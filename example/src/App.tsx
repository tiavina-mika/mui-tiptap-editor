
import { Container, CssBaseline, Tab, Tabs, ThemeProvider, createTheme } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import WithHookForm from './WithHookForm';

const tabs = ['With React Hook Form'];

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
        <Tabs value={setTab} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((label, index) => (
            <Tab key={index} label={label} value={index} />
          ))}
        </Tabs>

        {tab === 0 && <WithHookForm />}
      </Container>
    </ThemeProvider>
  )
}

export default App
