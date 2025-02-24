const template = document.createElement("template");

template.innerHTML = `
<nav id="sidebar">
  <slot></slot>
  <ul>
    <li>
    <span class="logo">Pied Piper</span>
    <button onclick="toggleSidebar()" id="toggle-btn">
      <sl-icon name="list" style="height: 24px; width: 24px;"></sl-icon>
    </button>
    </li>
    <li class="active">
    <a href="/settings" class="nav-link">
      <sl-icon name="gear-fill" style="height: 24px; width: 24px;"></sl-icon>
      <span>Settings</span>
    </a>
    </li>
    <li class="active">
    <a href="/orders" class="nav-link">
      <sl-icon name="gear-fill" style="height: 24px; width: 24px;"></sl-icon>
      <span>Orders</span>
    </a>
    </li>
  </ul>
</nav>
` 

class Sidebar extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(template.content.cloneNode(true))
  }
};

customElements.define('sidebar-component', Sidebar);