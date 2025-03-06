const globalStyles = new CSSStyleSheet();
globalStyles.replaceSync(`
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline: none;
  font-family: 'Poppins', sans-serif;
}
`);
export default globalStyles;