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
  addEmployeeForm: HTMLFormElement;
  constructor() {
    this.addEmployeeForm = document.querySelector("#add-user-form");
    this.addListeners();
    this.handleEmployeesList();
  }
  public async handleEmployeesList() {
    const employeesApi = new EmployeesApi();
    await employeesApi.fetchAll();
    const employeesList: Array<GettingEmployee> = employeesApi.getAll();
    new TableEmployees().render(employeesList);
  }

  addListeners(): void {
    this.addEmployeeForm.addEventListener(
      "submit",
      this.handleAddEmployee.bind(this)
    );
    const inputFilter: HTMLInputElement = document.querySelector("#filter");
    inputFilter.addEventListener("change", this.filter.bind(this));
  }
  filter(e) {
    const filter: string = e.target.value.toLowerCase().trim();
    const list: Array<GettingEmployee> = new EmployeesApi().getAll();
    const newList = list.filter(({ login, mail, name, lastName }) => {
      console.log("weszło");
      const stringToCheck = `${login}${mail}${name}${lastName}`;
      return stringToCheck.toLocaleLowerCase().trim().includes(filter);
    });

    new TableEmployees().render(newList);
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
