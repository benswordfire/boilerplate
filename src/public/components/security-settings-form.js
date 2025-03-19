import globalStyles from '../css/globalStyles.js';

class SecuritySettingsForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [globalStyles];
  }

  connectedCallback() {
    const userData = this.getAttribute('user') ? JSON.parse(this.getAttribute('user')) : {};
    
    const { isTwoFactorEnabled = '', email = '', phoneNumber = '' } = userData;

    this.render(isTwoFactorEnabled, email, phoneNumber);
    this.handleSubmit();
  }

  render(isTwoFactorEnabled, email, phoneNumber) {
    console.log(isTwoFactorEnabled)
    this.shadowRoot.innerHTML = `
    <form action="api/v1/update-settings" novalidate>
    <legend>Password security</legend>
    <p>You can change your password.</p>
    <form-field label="Password" type="password" id="password" name="password" required></form-field>
    <legend>Two-Factor Authentication</legend>
    <label for="isTwoFactorEnabled">Select 2FA Method</label>
    <select style="padding: 8px;" id="isTwoFactorEnabled" name="isTwoFactorEnabled">
      <option  value="disabled" ${isTwoFactorEnabled === "disabled" ? "selected" : ""}>Disabled</option>
      <option value="email" ${isTwoFactorEnabled === "email" ? "selected" : ""}>Email</option>
      <option value="sms" ${isTwoFactorEnabled === "sms" ? "selected" : ""}>SMS</option>
    </select>

      <button id="submitButton" type="submit">Update</button>
    </form>
    `;
  }

  handleSubmit() {
    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
        console.log(data)
      try {
        const response = await fetch(`${form.getAttribute('action')}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          window.location.reload();
        }

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

customElements.define('security-settings-form', SecuritySettingsForm);
