import { Provider } from 'react-redux';
import { Suspense, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import dayjs from 'dayjs';
import { persistor, store } from './redux/store';
import MuiThemeProvider from './MuiThemeProvider';
import RouterProvider from './routes/RouterProvider';
import { getStoredLanguage } from './utils/settings.utils';
import i18n, { getCurrentLocale } from './config/i18n';
import { Lang } from './types/setting.type';
import { setLang } from './redux/reducers/settings.reducer';
import { translateDateLocale } from './utils/date.utils';

const App = () => {
    // detect browser language, then save it to persisted store (redux + local storage)
    useEffect(() => {
      const persistedLocale = getStoredLanguage();
      let locale = persistedLocale;
  
      if (!persistedLocale) {
        // get device lang
        const defaultLang = getCurrentLocale();
  
        locale = defaultLang as Lang;
        // change i18n lang
        i18n.changeLanguage(defaultLang);
        // save lang to the store
        store.dispatch(setLang(defaultLang));
      }
  
      // translate date
      dayjs.locale(locale);
      translateDateLocale(locale as Lang);
    }, []);

  return (
    <Suspense fallback={<span>Loading</span>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
            <MuiThemeProvider>
              <RouterProvider store={store} />
            </MuiThemeProvider>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  )
}

export default App
