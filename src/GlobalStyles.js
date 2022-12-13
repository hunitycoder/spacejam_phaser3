import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
body {
  font-family: ATTAleckSans, sans-serif;
  background: black;
  color: white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body, #root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-touch-callout: none;
  user-select: none;
  outline: none;
  cursor: ${window.appConfig.dev.hideCursor ? 'none' : 'default'};
}
`

export default GlobalStyles
