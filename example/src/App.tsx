
import { ThemeProvider, createTheme } from '@mui/material';
import Form from './Form';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Form />
    </ThemeProvider>
  )
}

export default App
