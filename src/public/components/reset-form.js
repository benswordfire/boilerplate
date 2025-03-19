import globalStyles from '../css/globalStyles.js';

class PasswordResetForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [globalStyles];
  }

  connectedCallback() {
    this.render();
    this.handleSubmit();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <form action="api/v1/password-reset" novalidate>
      <h2 style="text-align: center; font-size: 24px; color: var(--primary-color);">Reset your password</h2>
      <p style="text-align: center; margin-bottom: 8px; font-weight: 400px; color: #5a6b80;">Please provide the email address associated with your account and we will send you the instructions to reset your account.</p>
      <form-field label="Email" type="email" inputid="email" name="email" required></form-field>
      <button id="submitButton" type="submit">Send instructions</button>
    </form>
    `;
  }

  handleSubmit() {
    const form = this.shadowRoot.querySelector('form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const response = await fetch(`${form.getAttribute('action')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        const existingToast = form.querySelector('toast-message');
        if (existingToast) {
          existingToast.remove();
        };

        let toastMessage = document.createElement('toast-message');

        form.prepend(toastMessage);

        toastMessage.showToastMessage(result.message, result.success ? 'success' : 'error');

      } catch (error) {
        console.error(error);
      }
    });
  }
}

customElements.define('reset-form', PasswordResetForm);
