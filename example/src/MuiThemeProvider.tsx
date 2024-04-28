import { ReactNode } from 'react';

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { PaletteMode, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';

import { getSettingsThemeColorSelector, getSettingsThemeSelector } from '@/redux/reducers/settings.reducer';

import { getTheme } from '@/utils/theme.utils';
import { GlobalStyles } from './GlobalStyles';


type Props = {
  children: ReactNode;
};
const MuiThemeProvider = ({ children }: Props) => {
  const theme: PaletteMode = useSelector(getSettingsThemeSelector);
  const themeColor = useSelector(getSettingsThemeColorSelector);
  const currentTheme = getTheme(theme, themeColor);
  return (
    <ThemeProvider theme={currentTheme}>
      <EmotionThemeProvider theme={currentTheme}>
        <GlobalStyles theme={currentTheme} />
        {children}
      </EmotionThemeProvider>
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
