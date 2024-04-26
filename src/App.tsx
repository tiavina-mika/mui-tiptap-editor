import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import TextEditor from './components/TextEditor';

import { getTheme } from '@/utils/theme.utils';
import { GlobalStyles } from './GlobalStyles';

const App = () => {
  const theme = getTheme();

  return (
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <TextEditor
          className="flexColumn stretchSelf flex1"
          label="Description"
          placeholder="Provide as much information as possible. This field has only one limit, yours."
          // mentions={mentions}
          // menuClassName={classes.textEditorMenu}
        />
      </EmotionThemeProvider>
    </ThemeProvider>
  )
}

export default App
