import globalStyles from '../css/globalStyles.js';

class RegisterForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [globalStyles];
  }

  connectedCallback() {
    this.render();
    this.validatePassword();
    this.handleSubmit();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <form class="public" action="api/v1/register" novalidate>
      <h2 style="text-align: center; font-size: 24px; color: var(--primary-color);">Create a new account</h2>
      <p style="text-align: center; margin-bottom: 8px; font-weight: 400px; color:rgb(72, 83, 97);">Start your journey by creating an account.</p>
      <form-field label="Email" type="email" id="email" name="email" required></form-field>
      <form-field label="Password" type="password" id="password" name="password" required></form-field>
      <div style="display:flex; flex-direction: column; gap: 8px; margin: 8px 0px;">
      <p style="display: flex; align-items: center; gap: 4px; font-size: 14px;"><sl-icon id="passwordLength" class="invalid" style="height: 16px; width: 16px;" name="x-circle-fill"></sl-icon> At least 8 characters</p>
        <p style="display: flex; align-items: center; gap: 4px; font-size: 14px;"><sl-icon id="passwordUppercase" class="invalid" style="height: 16px; width: 16px;" name="x-circle-fill"></sl-icon> At least 1 uppercase letter</p>
        <p style="display: flex; align-items: center; gap: 4px; font-size: 14px;"><sl-icon id="passwordNumber" class="invalid" style="height: 16px; width: 16px;" name="x-circle-fill"></sl-icon> At least 1 number</p>
        <p style="display: flex; align-items: center; gap: 4px; font-size: 14px;"><sl-icon id="passwordSpecial" class="invalid" style="height: 16px; width: 16px;" name="x-circle-fill"></sl-icon> At least 1 special character</p>
      </div>
      <primary-button>Create a new account</primary-button>
      <p style="text-align: center;">or</p>
      <a class="google-btn" href="/google">
          <img src="../../public/google.png" alt="Google Login" width="24px">
          Sign up with Google
      </a>
    </form>
    `;
  }


  validatePassword() {
    const passwordField = this.shadowRoot.querySelector('#password');
    const passwordLengthIcon = this.shadowRoot.querySelector('#passwordLength');
    const passwordNumberIcon = this.shadowRoot.querySelector('#passwordNumber');
    const passwordSpecialIcon = this.shadowRoot.querySelector('#passwordSpecial');
    const passwordUppercaseIcon = this.shadowRoot.querySelector('#passwordUppercase');
  
    if (passwordField) {
      passwordField.addEventListener('input', (event) => {
        const password = event.target.value;
        console.log('Password input:', password);

        if (password.length >= 8) {
          passwordLengthIcon.setAttribute('name', 'check-circle-fill');
          passwordLengthIcon.classList.remove('invalid');
          passwordLengthIcon.classList.add('valid');
        } else {
          passwordLengthIcon.setAttribute('name', 'x-circle-fill');
          passwordLengthIcon.classList.add('invalid');
          passwordLengthIcon.classList.remove('valid');
        }

        if (/[A-Z]/.test(password)) {
          passwordUppercaseIcon.setAttribute('name', 'check-circle-fill');
          passwordUppercaseIcon.classList.remove('invalid');
          passwordUppercaseIcon.classList.add('valid');
        } else {
          passwordUppercaseIcon.setAttribute('name', 'x-circle-fill');
          passwordUppercaseIcon.classList.add('invalid');
          passwordUppercaseIcon.classList.remove('valid');
        }

        if (/[0-9]/.test(password)) {
          passwordNumberIcon.setAttribute('name', 'check-circle-fill');
          passwordNumberIcon.classList.remove('invalid');
          passwordNumberIcon.classList.add('valid');
        } else {
          passwordNumberIcon.setAttribute('name', 'x-circle-fill');
          passwordNumberIcon.classList.add('invalid');
          passwordNumberIcon.classList.remove('valid');
        }

        if (/[!@#$%^&*()_+|~-]/.test(password)) {
          passwordSpecialIcon.setAttribute('name', 'check-circle-fill');
          passwordSpecialIcon.classList.remove('invalid');
          passwordSpecialIcon.classList.add('valid');
        } else {
          passwordSpecialIcon.setAttribute('name', 'x-circle-fill');
          passwordSpecialIcon.classList.add('invalid');
          passwordSpecialIcon.classList.remove('valid');
        }
        
      });
    }
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

customElements.define('register-form', RegisterForm);
