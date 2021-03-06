export interface AddingEmployeeInterface {
  name: string;
  lastName: string;
  login: string;
  mail: string;
  password: string;
}
export interface GettingEmployee extends AddingEmployeeInterface {
  id: string;
  active: boolean;
  permission: number;
  created: string;
}
export interface GettingUser {
  id: string;
  name: string;
  lastName: string;
}

const requestParam: RequestInit = {
  credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

let employeesList: Array<GettingEmployee> = [];
let fetched: boolean = false;

export class EmployeesApi {
  url: string;

  constructor() {
    this.url = "/api/users";
  }
  public getAll() {
    return employeesList;
  }
  public async fetchAll(): Promise<void> {
    try {
      const response = await fetch(`${this.url}/employees`);
      if (response.ok) {
        const employees: Array<GettingEmployee> = await response.json();
        employeesList = employees;
      } else {
        throw new Error(`${response.status}`);
        //TODO handle error
      }
    } catch (err) {
      //TODO handle error
    }
  }
  async get(id: string) {
    try {
      const response = await fetch(`${this.url}/${id}`);
      if (response.ok) {
        return response.json();
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  async getSelf() {
    try {
      const response = await fetch(`${this.url}/self`);
      if (response.ok) {
        const employees: GettingUser = await response.json();
        return employees;
      } else {
        throw new Error(`${response.status}`);
        //TODO handle error
      }
    } catch (err) {
      throw new Error(`err`);
      //TODO handle error
    }
  }

  public remove(id: string): Promise<Response> {
    const requestParam: RequestInit = {
      credentials: "include",
      mode: "cors",
      method: "DELETE",
    };
    return fetch(`${this.url}/${id}`, requestParam);
  }
  public activate(id: string): Promise<Response> {
    const requestParam: RequestInit = {
      credentials: "include",
      mode: "cors",
      method: "PUT",
    };
    return fetch(`${this.url}/activate/${id}`, requestParam);
  }

  public add(employee: AddingEmployeeInterface) {
    const requestParam: RequestInit = {
      credentials: "include",
      mode: "cors",
      method: "POST",
      body: JSON.stringify(employee),
      headers: {
        "Content-Type": "application/json",
      },
    };
    return fetch(this.url, requestParam);
  }
}

export class TableEmployees {
  container: HTMLTableSectionElement;
  stringFilter: string;
  filterCheckbox: HTMLInputElement;

  constructor() {
    this.stringFilter = "";
    this.filterCheckbox = document.querySelector("#filter-checkbox");
    const table = document.querySelector("#employees-list");
    if (table) this.container = table.querySelector("tbody");
    this.listeners();
  }
  listeners() {
    const inputFilter: HTMLInputElement = document.querySelector("#filter");
    inputFilter.addEventListener("change", this.handleChangeFilters.bind(this));

    document
      .querySelector("#filter-checkbox")
      .addEventListener("change", this.render.bind(this));
  }
  handleChangeFilters(e) {
    this.stringFilter = e.target.value.toLowerCase().trim();
    this.render();
  }

  filter(list: Array<GettingEmployee>) {
    return list.filter(({ login, mail, name, lastName, active }) => {
      const stringToCheck = `${login}${mail}${name}${lastName}`;
      const stringMatch = stringToCheck
        .toLocaleLowerCase()
        .trim()
        .includes(this.stringFilter);
      if (this.filterCheckbox.checked) {
        return stringMatch;
      } else {
        return stringMatch && active;
      }
    });
  }
  private createTd(value: string) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
    );
    td.innerText = value;
    return td;
  }
  private createActiveFieldTd(value: string) {
    const td: HTMLTableDataCellElement = document.createElement("td");

    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
    );
    const span1: HTMLSpanElement = document.createElement("span");

    span1.setAttribute(
      "class",
      `relative inline-block px-3 py-1 font-semibold ${
        value === "aktywny" ? "text-green-900" : "text-red-900"
      } leading-tight w-24 text-center`
    );

    const span2: HTMLSpanElement = document.createElement("span");
    span2.setAttribute(
      "class",
      `absolute inset-0 ${
        value === "aktywny" ? "bg-green-200" : "bg-red-200"
      } opacity-50 rounded-full`
    );
    const span3: HTMLSpanElement = document.createElement("span");
    span3.setAttribute("class", "relative text-xs");
    span3.innerText = value;
    span1.append(span2);
    span1.append(span3);
    td.append(span1);
    return td;
  }

  createButton(id: string, active: boolean) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
    );

    const button: HTMLButtonElement = document.createElement("button");
    button.setAttribute(
      "class",
      "px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none w-36"
    );
    button.innerText = active ? "dezaktywuj" : "aktywuj";
    //todo button loader
    button.addEventListener("click", async () => {
      const employeeApi = new EmployeesApi();
      if (active) {
        await employeeApi.remove(id);
      } else {
        await employeeApi.activate(id);
      }
      await employeeApi.fetchAll();
      const employees = employeeApi.getAll();

      this.render();
    });
    td.append(button);

    return td;
  }

  private createTr(employee: GettingEmployee) {
    const tr: HTMLTableRowElement = document.createElement("tr");

    const fullName: HTMLTableCellElement = this.createTd(
      `${employee.name} ${employee.lastName}`
    );
    const mail: HTMLTableCellElement = this.createTd(employee.mail);
    const login: HTMLTableCellElement = this.createTd(employee.login);
    const active: HTMLTableCellElement = this.createActiveFieldTd(
      employee.active ? "aktywny" : "nieaktywny"
    );
    const button = this.createButton(employee.id, employee.active);

    tr.append(fullName);
    tr.append(mail);
    tr.append(login);
    tr.append(active);
    tr.append(button);
    this.container.append(tr);
  }

  public render() {
    const list: Array<GettingEmployee> = new EmployeesApi().getAll();
    const afterFilterList = this.filter(list);
    this.container.innerHTML = "";
    afterFilterList.forEach((employee) => this.createTr(employee));
  }
}
