import { Message } from "./scripts/message";
import { Loader } from "./scripts/loader";

interface loginInterface {
  login: string;
  password: string;
}

class Login {
  form: HTMLFormElement;
  url: string;
  constructor() {
    this.url = `/api/auth`;
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
    const loader = new Loader();
    loader.setShow();
    try {
      const data: loginInterface = { login, password };
      const response = await fetch(this.url, {
        mode: "cors",
        credentials: "include",
        method: "POST",
        // redirect: "follow",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      loader.setHide();
      if (response.redirected && response.status === 200) {
        document.location.href = response.url;
      }
      if (response.status === 401) {
        return new Message().set("Błędny login lub hasło");
      }
    } catch (err) {
      loader.setHide();
      return new Message().set("Błąd logoawnia - sróbuj ponownie");
    }
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
