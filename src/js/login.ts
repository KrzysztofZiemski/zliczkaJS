import { Autch } from "./scripts/Auth";

class Login {
  form: HTMLFormElement;
  constructor() {
    this.form = document.querySelector('form[name="login"]');
    this.form.addEventListener("submit", this.login.bind(this));
  }

  login(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.disableFields();
    this.validate();
  }
  validate() {
    const fields = this.form.elements;
    let isOk = true;
    this.validateLogin(fields[0]);
    this.validatePassword(fields[1]);
  }
  validateLogin(login) {
    console.log("login", login);
  }
  validatePassword(password) {
    console.log("password", password);
  }
  enableFields() {
    const fields = this.form.elements;
    for (let i = 0; i < fields.length; i++) {
      // Disable all form controls
      fields[i].setAttribute("disabled", "false");
    }
  }
  disableFields() {
    const fields = this.form.elements;
    for (let i = 0; i < fields.length; i++) {
      // Disable all form controls
      fields[i].setAttribute("disabled", "");
    }
  }
}

new Login();
