class PasswordRequirement extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['label', 'type', 'name', 'id', 'required', 'status'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const id = this.getAttribute('id') || '';
    const status = this.getAttribute('status') || '';
    const name = this.getAttribute('name') || '';
    const text = this.getAttribute('text') || '';

    this.innerHTML = `
    <style>

    sl-icon {
      height: 16px;
      width: 16px;
    }

    sl-icon.invalid {
    color:rgba(255, 60, 63, 0.7);
    }

    sl-icon.valid {
    color: #1BE163;
    }

    </style>
    <p style="display: flex; align-items: center; gap: 4px; font-size: 14px;">
      <sl-icon id="${id}" class="${status}" name="${name}"></sl-icon> 
      ${text}
    </p>
    `;
  }
}
customElements.define('password-requirement', PasswordRequirement);