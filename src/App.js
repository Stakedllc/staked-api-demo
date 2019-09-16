import React from "react";
import Dashboard from "./UIComponents/Dashboard.js";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Or Create your Own theme:
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#102039'
    },
    secondary: {
        main: '#E33E7F'
      }
    }
  },
)


class App extends React.Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dashboard/>
      </MuiThemeProvider>
    );
  }
}

export default App;
