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
  color: inherit;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

form {
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

}

form.public {
  padding: 16px;
}

button {
  width: 100%;
  background-color: #ff3c3f;
  color: #FFF;
  border: 2px solid #ff3c3f;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
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
  text-decoration: none;
  cursor: pointer;
}

.invalid {
  color:rgba(255, 60, 63, 0.7);
}

.valid {
  color: #1BE163;
}


.tab.tab--active:not(.tab--disabled) {
  background-color: #1BE163;
}

`);
export default globalStyles;