import { SERVER } from "./consts";

interface loginInterface {
  login: string;
  password: string;
}

class Login {
  form: HTMLFormElement;
  url: string;
  constructor() {
    this.url = `${SERVER}/auth`;
    this.form = document.querySelector('form[name="login"]');
    this.form.addEventListener("submit", this.handleLogin.bind(this));
  }

  handleLogin(e: Event) {
    e.stopImmediatePropagation();
    e.preventDefault();
    // this.disableFields();
    const isOk: boolean = this.validate();
    if (!isOk) {
      // this.enableFields();
      return alert("uzupełnij login i hasło");
    }
    // @ts-ignore: Unreachable code error
    this.login(this.form.elements[0].value, this.form.elements[1].value);
  }

  async login(login: string, password: string) {
    const data: loginInterface = { login, password };
    console.log(login, password);
    const response = await fetch(this.url, {
      mode: "cors",
      credentials: "include",
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("po odpowiedzi", response);
  }

  validate(): boolean {
    const fields: HTMLFormControlsCollection = this.form.elements;
    let isOk = true;
    // @ts-ignore: Unreachable code error
    const login: string = fields[0].value;
    // @ts-ignore: Unreachable code error
    const password: string = fields[1].value;
    if (!this.validateLogin(login)) isOk = false;
    if (!this.validatePassword(password)) isOk = false;
    return isOk;
  }
  validateLogin(login: string): boolean {
    return login.length > 3 ? true : false;
  }
  validatePassword(password: string): boolean {
    return password.length > 3 ? true : false;
  }
}

new Login();
