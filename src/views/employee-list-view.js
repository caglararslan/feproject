import { LitElement, html, css } from 'lit';

export class EmployeeListView extends LitElement {
  static styles = css`
    /* Tablo ve responsive CSS aynı */
    :host {
      display: block;
      padding: 1rem;
    }
    .table-wrapper {
      overflow-x: auto;
    }
    table {
      width: 100%;
      min-width: 800px;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px 12px;
      border: 1px solid #ddd;
    }
    th {
      color: #fff;
      background-color: #000066;
    }
    td.actions {
      display: flex;
      gap: 0.5rem;
    }
    button {
      padding: 6px 10px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }
    .edit-btn { background-color: #007bff; color: white; }
    .delete-btn { background-color: #dc3545; color: white; }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: #000066;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
    }

    .modal h3 {
      color:#fff;
      margin-top: 0;
    }

    .modal input, .modal select {
      width: 100%;
      padding: 6px;
      margin-bottom: 1rem;
      border-radius: 12px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
    @media (max-width: 768px) {
        table, thead, tbody, th, td, tr {
          display: block;
        }
      
        thead {
          display: none;
        }
      
        tr {
          margin-bottom: 1.5rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 1rem;
          background: #fff;
        }
      
        td {
          padding: 0.5rem 0;
          text-align: right;
          position: relative;
        }
      
        td::before {
          content: attr(data-label);
          position: absolute;
          left: 0;
          font-weight: bold;
          text-align: left;
          color: #333;
        }
      
        td.actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
      
        .table-wrapper {
          padding: 0;
        }
      }
  `;

  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    editData: { type: Object },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    lang: { type: String, attribute: false }
  };

  constructor() {
    super();
    this.employees = [];
    this.showModal = false;
    this.editData = {};
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.lang = 'EN';
  }


  setLanguage(lang) {
    this.selectedLanguage = lang;
  }

  translations = {
    EN: {
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      employmentDate: "Employment Date",
      phone: "Phone",
      email: "Email",
      department: "Department",
      position: "Position",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      editTitle: "Edit Employee",
      cancel: "Cancel",
      save: "Save"
    },
    TR: {
      firstName: "Ad",
      lastName: "Soyad",
      dateOfBirth: "Doğum Tarihi",
      employmentDate: "İşe Giriş",
      phone: "Telefon",
      email: "E-posta",
      department: "Departman",
      position: "Pozisyon",
      actions: "İşlem",
      edit: "Düzenle",
      delete: "Sil",
      editTitle: "Çalışan Düzenle",
      cancel: "İptal",
      save: "Kaydet"
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.loadEmployees();
  }

  async loadEmployees() {
    const raw = localStorage.getItem('employees');
    if (raw) {
      this.employees = JSON.parse(raw);
    } else {
      const res = await fetch('/employees.json');
      const data = await res.json();
      this.employees = data;
      localStorage.setItem('employees', JSON.stringify(data));
    }
  }

  openEditModal(emp) {
    this.editData = { ...emp };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  updateField(e) {
    const { name, value } = e.target;
    this.editData = { ...this.editData, [name]: value };
  }

  submitEdit() {
    this.employees = this.employees.map(emp =>
      emp.id === this.editData.id ? { ...this.editData } : emp
    );
    localStorage.setItem('employees', JSON.stringify(this.employees));
    this.closeModal();
  }

  deleteEmployee(id) {
    const confirmed = confirm("Bu çalışanı silmek istediğinize emin misiniz?");
    if (!confirmed) return;
  
    this.employees = this.employees.filter(emp => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  renderPagination() {
    const totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
    if (totalPages <= 1) return null;
  
    return html`
      <div style="margin-top: 1rem;">
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => html`
          <button
            style="margin-right: 5px;"
            ?disabled=${page === this.currentPage}
            @click=${() => this.currentPage = page}
          >
            ${page}
          </button>
        `)}
      </div>
    `;
  }

  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    editData: { type: Object },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    lang: { type: String }
  };

  render() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageEmployees = this.employees.slice(start, end);
    return html`
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
            <th>${this.translations[this.lang].firstName}</th>
            <th>${this.translations[this.lang].lastName}</th>
            <th>${this.translations[this.lang].dateOfBirth}</th>
            <th>${this.translations[this.lang].employmentDate}</th>
            <th>${this.translations[this.lang].phone}</th>
            <th>${this.translations[this.lang].email}</th>
            <th>${this.translations[this.lang].department}</th>
            <th>${this.translations[this.lang].position}</th>
            <th>${this.translations[this.lang].actions}</th>
            </tr>
          </thead>
          <tbody>
          ${pageEmployees.map(emp => html`
          <tr>
            <td data-label="First Name">${emp.firstName}</td>
            <td data-label="First Name">${emp.lastName}</td>
            <td data-label="Date of Birth">${emp.dateOfBirth}</td>
            <td data-label="Employment Date">${emp.employmentDate}</td>
            <td data-label="Phone">${emp.phone}</td>
            <td data-label="Email">${emp.email}</td>
            <td data-label="Department">${emp.department}</td>
            <td data-label="Position">${emp.position}</td>
            <td data-label="Actions" class="actions">
            <button class="edit-btn" @click=${() => this.openEditModal(emp)}>
                ${this.translations[this.lang].edit}
            </button>
            <button class="delete-btn" @click=${() => this.deleteEmployee(emp.id)}>
            ${this.translations[this.lang].delete}
            </button>
            </td>
          </tr>
        `)}
          </tbody>
        </table>
        ${this.renderPagination()}
      </div>

      ${this.showModal ? html`
        <div class="modal-backdrop" @click=${this.closeModal}>
          <div class="modal" @click=${e => e.stopPropagation()}>
            <h3>Edit Employee</h3>
            <input name="firstName" .value=${this.editData.firstName || ''} @input=${this.updateField} placeholder="First Name">
            <input name="lastName" .value=${this.editData.lastName || ''} @input=${this.updateField} placeholder="Last Name">
            <input name="dateOfBirth" type="date" .value=${this.editData.dateOfBirth || ''} @input=${this.updateField}>
            <input name="employmentDate" type="date" .value=${this.editData.employmentDate || ''} @input=${this.updateField}>
            <input name="phone" .value=${this.editData.phone || ''} @input=${this.updateField} placeholder="Phone">
            <input name="email" .value=${this.editData.email || ''} @input=${this.updateField} placeholder="Email">
            <select name="department" @change=${this.updateField}>
              <option value="Tech" ?selected=${this.editData.department === 'Tech'}>Tech</option>
              <option value="Analytics" ?selected=${this.editData.department === 'Analytics'}>Analytics</option>
            </select>
            <select name="position" @change=${this.updateField}>
              <option value="Junior" ?selected=${this.editData.position === 'Junior'}>Junior</option>
              <option value="Medior" ?selected=${this.editData.position === 'Medior'}>Medior</option>
              <option value="Senior" ?selected=${this.editData.position === 'Senior'}>Senior</option>
            </select>
            <div class="modal-actions">
              <button @click=${this.closeModal}>Cancel</button>
              <button class="edit-btn" @click=${this.submitEdit}>Save</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('employee-list-view', EmployeeListView);