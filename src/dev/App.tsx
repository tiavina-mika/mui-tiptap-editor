import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { Container, ThemeProvider } from '@mui/material';
import TextEditor from '../components/TextEditor';

import { getTheme } from './theme.utils';

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

const html = "<h1>Hello world</h1>";
const currentUser = mentions[0];
const theme = getTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>
        <Container>
              <TextEditor
              inputClassName="flexColumn stretchSelf flex1"
              label={'Description fr'}
              placeholder="French here"
              mentions={mentions}
              user={currentUser}
              value="<h1>French</h1>"
              // value={(values as any).fr}
              // name={'title:' + locale}
            />
            <TextEditor
              inputClassName="flexColumn stretchSelf flex1"
              label={'Description en'}
              placeholder="English here"
              mentions={mentions}
              user={currentUser}
              // value={(values as any).en}
              value="<h1>English</h1>"
              // name={'title:' + locale}
            />
        </Container>
      </EmotionThemeProvider>
    </ThemeProvider>
  )
}

export default App
