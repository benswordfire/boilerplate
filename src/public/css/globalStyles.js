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

html {
  font-size: 100%;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed; 
}

img, picture, video, canvas, svg {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

form {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.google-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background-color: var(--secondary-color);
  color: var(--primary-color);
  padding: 8px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}
`);
export default globalStyles;