import { ChangeEvent } from "mongodb";
import {
  AddingEmployeeInterface,
  EmployeesApi,
  GettingEmployee,
  TableEmployees,
} from "./scripts/employees";
import { Loader } from "./scripts/loader";
import { Message } from "./scripts/message";

class AppUsers {
  constructor() {
    this.addListeners();
    this.handleEmployeesList();
  }
  public async handleEmployeesList() {
    await new EmployeesApi().fetchAll();
    this.renderTable();
  }

  addListeners(): void {
    document
      .querySelector("#add-user-form")
      .addEventListener("submit", this.handleAddEmployee.bind(this));
  }
  renderTable() {
    new TableEmployees().render();
  }

  async handleAddEmployee(e: Event) {
    e.preventDefault();

    const nameField: HTMLInputElement = document.querySelector(
      'input[name="name"]'
    );
    const LastNameField: HTMLInputElement = document.querySelector(
      'input[name="last-name"]'
    );
    const loginField: HTMLInputElement = document.querySelector(
      'input[name="login"]'
    );
    const mailField: HTMLInputElement = document.querySelector(
      'input[name="mail"]'
    );
    const passwordField: HTMLInputElement = document.querySelector(
      'input[name="password"]'
    );
    if (
      !nameField.value ||
      !LastNameField.value ||
      !loginField.value ||
      !mailField.value ||
      !passwordField.value
    )
      return alert("uzupełnij wszystkie pola");
    const loader = new Loader();
    const message = new Message();

    const data: AddingEmployeeInterface = {
      name: nameField.value,
      lastName: LastNameField.value,
      login: loginField.value,
      mail: mailField.value,
      password: passwordField.value,
    };

    try {
      loader.setShow();

      const response = await new EmployeesApi().add(data);

      if (!response.ok) {
        throw new Error(`status ${response.status}`);
      }

      loader.setHide();
      message.set("Dodano użytkownika");
    } catch (err) {
      loader.setHide();
      message.set("Błąd podczas dodawania");
    }

    //TODO handle loader and errors
  }
}
new AppUsers();
