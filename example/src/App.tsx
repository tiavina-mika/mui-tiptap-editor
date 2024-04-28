
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Form from './Form';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Form />
      </Container>
    </ThemeProvider>
  )
}

export default App
