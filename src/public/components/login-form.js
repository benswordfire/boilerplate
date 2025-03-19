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
    <form class="public" action="api/v1/login" novalidate>
      <h2 id="headline" style="text-align: center; font-size: 24px; color: var(--primary-color);">Welcome back!</h2>
      <p id="subheadline" style="text-align: center; margin-bottom: 8px; font-weight: 400px; color:rgb(72, 83, 97);">Login with your credentials.</p>
      <form-field label="Email" type="email" id="email" name="email" required></form-field>
      <form-field label="Password" type="password" id="password" name="password" required></form-field>
      <button id="submitButton" type="submit">Login</button>
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
      const formData = new FormData(form);
      const data = {};
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
        console.log(result)

        if (result.twoFactorRequired) {
          this.shadowRoot.querySelector('#email').remove();
          this.shadowRoot.querySelector('#password').remove();
          this.shadowRoot.querySelector('.google-btn').remove();
          document.querySelector('.nav-link').remove();

          this.shadowRoot.getElementById('headline').textContent = 'Two Factor Authentication';
          this.shadowRoot.getElementById('submitButton').textContent = 'Verify code';

          if (result.twoFactorAuthType === 'email') {
            this.shadowRoot.getElementById('subheadline').textContent = 'Enter the secret code we sent to your email.';
          }

          if (result.twoFactorAuthType === 'sms') {
            this.shadowRoot.getElementById('subheadline').textContent = 'Enter the secret code we sent via SMS.';
          }

          const twoFactorAuthField = document.createElement('form-field');
          twoFactorAuthField.setAttribute('id', 'twoFactorAuth');
          twoFactorAuthField.setAttribute('type', 'text');
          twoFactorAuthField.setAttribute('name', 'twoFactorAuth');
          twoFactorAuthField.setAttribute('required', 'required');

          
          form.insertBefore(twoFactorAuthField, form.querySelector('#submitButton'));

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
