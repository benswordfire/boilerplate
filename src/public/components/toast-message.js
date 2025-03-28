class ToastMessage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        .toast-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background-color: #f5f7fa;
          font-size: 16px;
          border-radius: 4px;
          border: 2px solid transparent;
          margin-bottom: 24px;
        }
        .toast-message {
          margin: 0;
          text-align: center;
        }
        .success { border-color: #1BE163; }
        .error { border-color: #FF3C3f; }
      </style>
      <div class="toast-container">
        <sl-icon id="toast-icon" style="height: 20px; width: 20px;" name="check-circle-fill"></sl-icon>
        <p class="toast-message"></p>
      </div>
    `;
  }

  showToastMessage(message, type) {
    const toast = this.shadowRoot.querySelector('.toast-container');
    const toastContent = this.shadowRoot.querySelector('.toast-message');
    const toastIcon = this.shadowRoot.querySelector('#toast-icon');
    if (!toastIcon) {
      return;
    }

    if (type === 'success') {
      toastIcon.setAttribute('name', 'check-circle-fill');
      console.log('icon:set')
      toastIcon.style.color = '#1BE163';
    } else if (type === 'error') {
      toastIcon.setAttribute('name', 'x-circle-fill');
      toastIcon.style.color = '#FF3C3F';
    }

    toastContent.textContent = message;
    toast.classList.add(type);
  }
}

customElements.define('toast-message', ToastMessage);
