class FormField extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['label', 'type', 'name', 'id', 'required'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const label = this.getAttribute('label') || '';
    const type = this.getAttribute('type') || 'text';
    const id = this.getAttribute('id') || '';
    const name = this.getAttribute('name') || '';
    const required = this.hasAttribute('required');

    this.innerHTML = `
    <style>
    fieldset {
      width: 100%;
      border: none;
      margin: 0;
      padding: 0;
    }

    label {
      color: var(--primary-color);
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 600;
    }

    input {
      color: var(--primary-color);
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      padding: 8px;
      margin-top: 4px;
      border: 2px solid silver;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      outline: none;
    }

    input:focus {
      border: 2px solid var(--primary-color);
    }

    input.invalid {
      border: 2px solid #ff3c3f;
    }

    input.valid {
      border: 2px solid #1be163;
    }

    </style>
    <fieldset>
      <label for="${id}">${label}</label>
      <input type="${type}" id="${id}" name="${name}" ${required ? 'required' : ''}>
    </fieldset>
    `;
  }
}
customElements.define('form-field', FormField);