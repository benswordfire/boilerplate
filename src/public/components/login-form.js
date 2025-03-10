import globalStyles from '../css/globalStyles.js';

class LoginForm extends HTMLElement {
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
    <form action="api/v1/login" novalidate>
      <h2 style="text-align: center;">Welcome back!</h2>
      <p style="text-align: center; margin-bottom: 8px;">Login with your credentials.</p>
      <form-field label="Email" type="email" id="email" name="email" required></form-field>
      <form-field label="Password" type="password" id="password" name="password" required></form-field>
      <primary-button>Login</primary-button>
      <p style="text-align: center;">or</p>
      <a class="google-btn" href="/google">
          <img src="../../public/google.png" alt="Google Login" width="24px">
          Sign in with Google
      </a>
    </form>
    `;
  }

  handleSubmit() {
    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const isTwoFactorStep = this.shadowRoot.getElementById('twoFactorAuth');
      console.log(isTwoFactorStep)
      const formData = new FormData(form);
      const data = {};
      console.log(data)
      if (isTwoFactorStep) {
        data.twoFactorAuthToken = formData.get('twoFactorAuth');
      } else {
        data.email = formData.get('email');
        data.password = formData.get('password');
      }

      try {

        const response = await fetch(`${form.getAttribute('action')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.twoFactorRequired) {
          this.shadowRoot.querySelector('#email').remove();
          this.shadowRoot.querySelector('#password').remove();

          const twoFactorAuthField = document.createElement('form-field');
          twoFactorAuthField.setAttribute('label', 'twoFactorAuth');
          twoFactorAuthField.setAttribute('id', 'twoFactorAuth');
          twoFactorAuthField.setAttribute('type', 'text');
          twoFactorAuthField.setAttribute('name', 'twoFactorAuth');
          twoFactorAuthField.setAttribute('required', 'required');

          form.insertBefore(twoFactorAuthField, form.querySelector('primary-button'));
        } else if (result.authorized) {
          window.location.href = '/settings';
        } else {
          const existingToast = form.querySelector('toast-message');
          if (existingToast) {
            existingToast.remove();
          };
  
          let toastMessage = document.createElement('toast-message');
  
          form.prepend(toastMessage);
  
          toastMessage.showToastMessage(result.message, result.success ? 'success' : 'error');
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
}

customElements.define('login-form', LoginForm);
