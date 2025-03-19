import globalStyles from '../css/globalStyles.js';

class GeneralSettingsForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [globalStyles];
  }

  connectedCallback() {
    const userData = this.getAttribute('user') ? JSON.parse(this.getAttribute('user')) : {};

    const { firstName = '', lastName = '', email = '', phoneNumber = '' } = userData;

    this.render(firstName, lastName, email, phoneNumber);
    this.handleSubmit();
  }

  render(firstName, lastName, email, phoneNumber) {
    console.log(lastName)
    this.shadowRoot.innerHTML = `
    <form action="api/v1/update-settings" novalidate>
      <form-field label="First Name" type="text" id="firstName" name="firstName" placeholder="${firstName}" required></form-field>
      <form-field label="Last Name" type="text" id="lastName" name="lastName" placeholder="${lastName}" required></form-field>
      <form-field label="Email" type="email" id="email" name="email" placeholder="${email}" required></form-field>
      <form-field label="Phone number" type="text" id="phoneNumber" name="phoneNumber" placeholder="${phoneNumber}" required></form-field>
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
        console.log(result)
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

customElements.define('general-settings-form', GeneralSettingsForm);
