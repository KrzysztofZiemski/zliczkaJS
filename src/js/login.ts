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
    const fields: HTMLFormControlsCollection = this.form.elements;
    let isOk = true;
    // @ts-ignore: Unreachable code error
    const login: string = fields[0].value;
    // @ts-ignore: Unreachable code error
    const password: string = fields[1].value;
    if (!this.validateLogin(login)) isOk = false;
    if (!this.validatePassword(password)) isOk = false;
    if (!isOk) return alert("uzupełnij login i hasło");
  }
  validateLogin(login: string): boolean {
    return login.length > 3 ? true : false;
  }
  validatePassword(password: string) {
    return password.length > 5 ? true : false;
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
