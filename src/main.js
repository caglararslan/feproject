import { html, LitElement, css } from 'lit';
import './views/employee-list-view.js';
import './views/employee-form-view.js';

class EmployeeApp extends LitElement {
  static styles = css`
    :host {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1a1a1a;
      background-color: #f9f9f9;
      display: block;
      min-height: 100vh;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #ff6200;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #fff;
    }

    nav {
      display: flex;
      align-items: center;
    }

    nav a {
      margin-left: 1.5rem;
      text-decoration: none;
      font-weight: 600;
      color: #fff;
      transition: color 0.3s ease;
    }

    nav a:hover {
      color: #000066;
    }

    main {
      padding: 2rem;
    }

    .lang-switcher button {
      text-decoration: none;
      font-weight: 500;
      color: #fff;
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      transition: color 0.3s ease;
    }
    
    .lang-switcher {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
    
    .lang-switcher button.active {
      color: #000066;
      font-weight: 600;
    }

    footer {
      display:flex;
      flex-direction:column;
      align-items:center;
      background: #ff6200;
    }

    footer p{
      color: #fff;
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        align-items: flex-start;
      }

      nav {
        margin-top: 0.5rem;
      }

      nav a {
        margin-left: 0;
        margin-right: 1rem;
      }

      main {
        padding: 1rem;
      }
    }
  `;

  renderContent() {
    const hash = location.hash || '#/employees';

    if (hash === '#/add') {
      return html`<employee-form-view></employee-form-view>`;
    }

    return html`<employee-list-view .lang=${this.selectedLanguage}></employee-list-view>`;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', () => this.requestUpdate());
  }

  static properties = {
    selectedLanguage: { type: String }
  };
  
  constructor() {
    super();
    this.selectedLanguage = 'EN';
  }

  setLanguage(lang) {
    this.selectedLanguage = lang;
  }

  translations = {
    EN: {
      editButton: "Edit",
      deleteButton: "Delete",
      employeeList: "Employee List",
      addEmployee: "Add New Employee",
      footerText: "© 2025 ING Employee Portal"
    },
    TR: {
      editButton: "Düzenle",
      deleteButton: "Sil",
      employeeList: "Çalışan Listesi",
      addEmployee: "Yeni Çalışan Ekle",
      footerText: "© 2025 ING Çalışan Portalı"
    }
  };

  render() {
    const current = location.hash;

    return html`
      <header>
        <img src="/ing_footer.png" alt="Logo" style="height: 50px;" />
        <nav>
          <a href="#/employees" class=${current === '#/employees' ? 'active' : ''}>
            ${this.translations[this.selectedLanguage].employeeList}
          </a>
          <a href="#/add" class=${current === '#/add' ? 'active' : ''}>
            ${this.translations[this.selectedLanguage].addEmployee}
          </a>
          <span class="lang-switcher">
            <button @click=${() => this.setLanguage('TR')} class=${this.selectedLanguage === 'TR' ? 'active' : ''}>TR</button>
            <span>|</span>
            <button @click=${() => this.setLanguage('EN')} class=${this.selectedLanguage === 'EN' ? 'active' : ''}>EN</button>
          </span>
        </nav>
      </header>

      <main>
        ${this.renderContent()}
      </main>

      <footer>
        <img src="/ing_footer.png" alt="ING Footer Logo" style="height: 50px;"/>
        <p>${this.translations[this.selectedLanguage].footerText}</p>
      </footer>
    `;
  }
}

customElements.define('employee-app', EmployeeApp);