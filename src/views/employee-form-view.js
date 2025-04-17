import { LitElement, html, css } from 'lit';

export class EmployeeFormView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    h2 {
      text-align: center;
      margin-bottom: 2rem;
    }

    form label {
      display: block;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    form input,
    form select {
      width: 100%;
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    form button {
      margin-top: 1.5rem;
      width: 100%;
      background-color: #007bff;
      color: white;
      padding: 0.75rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    form button:hover {
      background-color: #0056b3;
    }

    @media (max-width: 600px) {
      .form-container {
        padding: 1rem;
      }

      form label {
        font-size: 0.9rem;
      }
    }
  `;

  static properties = {
    employeeData: { type: Object }
  };

  constructor() {
    super();
    this.employeeData = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      employmentDate: '',
      phone: '',
      email: '',
      department: 'Tech',
      position: 'Junior'
    };
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.employeeData = {
      ...this.employeeData,
      [name]: value
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const newEmployee = {
      id: Date.now(),
      ...this.employeeData
    };

    let existing = [];
    const raw = localStorage.getItem('employees');
    if (raw) existing = JSON.parse(raw);

    existing.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(existing));

    alert('Employee added successfully!');
    location.hash = '#/employees';
  }

  render() {
    const d = this.employeeData;
    return html`
      <div class="form-container">
        <h2>Add New Employee</h2>
        <form @submit=${this.handleSubmit}>
          <label>First Name:
            <input name="firstName" .value=${d.firstName} @input=${this.handleInput} required />
          </label>
          <label>Last Name:
            <input name="lastName" .value=${d.lastName} @input=${this.handleInput} required />
          </label>
          <label>Date of Birth:
            <input type="date" name="dateOfBirth" .value=${d.dateOfBirth} @input=${this.handleInput} required />
          </label>
          <label>Employment Date:
            <input type="date" name="employmentDate" .value=${d.employmentDate} @input=${this.handleInput} required />
          </label>
          <label>Phone:
            <input name="phone" .value=${d.phone} @input=${this.handleInput} />
          </label>
          <label>Email:
            <input name="email" .value=${d.email} @input=${this.handleInput} />
          </label>
          <label>Department:
            <select name="department" @change=${this.handleInput}>
              <option value="Tech" ?selected=${d.department === 'Tech'}>Tech</option>
              <option value="Analytics" ?selected=${d.department === 'Analytics'}>Analytics</option>
            </select>
          </label>
          <label>Position:
            <select name="position" @change=${this.handleInput}>
              <option value="Junior" ?selected=${d.position === 'Junior'}>Junior</option>
              <option value="Medior" ?selected=${d.position === 'Medior'}>Medior</option>
              <option value="Senior" ?selected=${d.position === 'Senior'}>Senior</option>
            </select>
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form-view', EmployeeFormView);