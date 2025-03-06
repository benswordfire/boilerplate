class PrimaryButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <style>
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
    </style>
    <button type="submit">
      ${this.innerText}
    </button>
    `
  }
};
customElements.define('primary-button', PrimaryButton);