import globalStyles from '../css/globalStyles.js';

class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [globalStyles];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
    /* Add these styles */
    :host {
      display: block;
      max-width: 480px;
      width: 100%;
      padding: 16px;
    }

    form {
      max-width: 480px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    </style>
    <form action="api/v1/register" novalidate>
    <h2 style="text-align: center;">Create a new account</h2>
    <p style="text-align: center; margin-bottom: 8px;">Start your journey by creating an account.</p>
    <form-field label="Email" type="email" inputid="email" name="email" required></form-field>
    <form-field label="Password" type="password" inputid="password" name="password" required></form-field>
    <primary-button>Create a new account</primary-button>
    <p style="text-align: center;">or</p>
    <a class="google-btn" href="/google">
        <img src="../../public/google.png" alt="Google Login" width="24px">
        Sign up with Google
    </a>
    </form>
    `;
  }

  addEventListeners() {
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

customElements.define('register-form', RegisterForm);
