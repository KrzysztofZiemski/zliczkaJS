import { Message } from "./message";

export interface AddTask {
  name: string;
  group: string;
  parameterized: boolean | null;
  intensityTime: number | null;
}
export interface Task {
  name: string;
  group: string;
  parameterized: boolean | null;
  intensityTime: number | null;
  active: boolean;
  id: string;
  editable?: boolean;
}

let tasks: Array<Task> = [];

export class AdminTasks {
  url: string;
  constructor() {
    this.url = "../api/tasks/";
  }

  public addTask(data: AddTask) {
    return fetch(this.url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
  }
  public async update(id: string) {
    const data = tasks.find((task) => task.id === id);
    const response = await fetch(`${this.url}/${id}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    if (response.ok) {
      return response.json();
    } else {
      const error = new Error(`${response}`);
      error.message = `status ${response.status}`;
      throw error;
    }
  }
  public async fetchAll(): Promise<void> {
    try {
      const response = await fetch(this.url);
      if (response.ok) {
        const fetchedTasks: Array<Task> = await response.json();
        tasks = fetchedTasks;
      } else {
        throw new Error(`${response.status}`);
        //TODO handle error
      }
    } catch (err) {
      //TODO handle error
    }
  }
  public getAll() {
    return tasks;
  }
  public setEditable(id: string, value: boolean = true) {
    const modifyTask: Task = tasks.find((task) => task.id === id);
    modifyTask.editable = value;
  }
  public remove(id: string) {
    return fetch(`${this.url}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }
}

export class TableAdminTasks {
  container: HTMLTableSectionElement;
  stringFilter: string;
  filterCheckbox: HTMLInputElement;

  constructor() {
    this.stringFilter = "";
    this.filterCheckbox = document.querySelector("#filter-checkbox");
    const table = document.querySelector("#task-list");
    if (table) this.container = table.querySelector("tbody");

    this.listeners();
  }
  listeners() {
    const inputFilter: HTMLInputElement = document.querySelector("#filter");
    inputFilter.addEventListener("change", this.handleFilterChange.bind(this));
    document
      .querySelector("#filter-checkbox")
      .addEventListener("change", this.render.bind(this));
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
      "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center"
    );
    const span1: HTMLSpanElement = document.createElement("span");

    span1.setAttribute(
      "class",
      `relative inline-block px-3 py-1 font-semibold ${
        value === "aktywny" || value === "TAK"
          ? "text-green-900"
          : "text-red-900"
      } leading-tight text-center min-w-72`
    );

    const span2: HTMLSpanElement = document.createElement("span");
    span2.setAttribute(
      "class",
      `absolute inset-0 ${
        value === "aktywny" || value === "TAK" ? "bg-green-200" : "bg-red-200"
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

  private createButton(id: string) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
    );

    const editButton: HTMLButtonElement = document.createElement("button");

    editButton.setAttribute(
      "class",
      "px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none w-36"
    );

    editButton.innerText = "EDYTUJ";
    //todo button loader
    editButton.addEventListener("click", () => {
      const adminTaskApi = new AdminTasks();
      adminTaskApi.setEditable(id);
      this.render();
    });
    td.append(editButton);

    return td;
  }
  private createChangeButton(id: string) {
    //todo
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
    );

    const editButton: HTMLButtonElement = document.createElement("button");

    editButton.setAttribute(
      "class",
      "px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none w-36"
    );

    editButton.innerText = "ZAPISZ";
    //todo button loader
    editButton.addEventListener("click", async () => {
      try {
        await new AdminTasks().update(id);
        const adminTaskApi = new AdminTasks();
        adminTaskApi.setEditable(id, false);
        this.render();
        new Message().set("Zaktualizowano");
      } catch (err) {
        new Message().set(
          "Wystąpił błąd podczas aktualizacji",
          err.message || null
        );
      }
    });
    td.append(editButton);

    return td;
  }

  private createTr(task: Task) {
    const tr: HTMLTableRowElement = document.createElement("tr");

    const name: HTMLTableCellElement = this.createTd(task.name);
    const group: HTMLTableCellElement = this.createTd(task.group);

    const intensityValue =
      Math.floor(task.intensityTime / 60) > 0
        ? `${Math.floor(task.intensityTime / 60)} h ${
            task.intensityTime % 60
          } min`
        : `${Math.floor(task.intensityTime % 60)} min`;

    const intensityTime = this.createTd(intensityValue);

    const status: HTMLTableCellElement = this.createActiveFieldTd(
      task.parameterized ? "TAK" : "NIE"
    );

    const active: HTMLTableCellElement = this.createActiveFieldTd(
      task.active ? "aktywny" : "nieaktywny"
    );

    let button: HTMLTableCellElement;

    button = this.createButton(task.id);

    tr.append(name);
    tr.append(group);
    tr.append(intensityTime);
    tr.append(status);
    tr.append(active);
    tr.append(button);
    this.container.append(tr);
  }
  createInputTdGroup(task: Task) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
    );

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute(
      "class",
      "shadow appearance-none border rounded max-w-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    );
    input.value = task.group;
    input.addEventListener("change", (e) => {
      //@ts-ignore
      task.group = e.target.value;
    });
    td.append(input);
    return td;
  }
  createInputTdName(task: Task) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
    );

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute(
      "class",
      "shadow appearance-none border rounded max-w-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    );
    input.value = task.name;
    input.addEventListener("change", (e) => {
      //@ts-ignore
      task.name = e.target.value;
    });
    td.append(input);
    return td;
  }

  createSelectParametrized(task: Task) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
    );
    const select = document.createElement("select");
    select.value = task.parameterized ? "true" : "false";
    select.setAttribute(
      "class",
      "w-full shadow appearance-none border rounded max-w-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    );

    const optionTrue = document.createElement("option");
    optionTrue.value = "true";
    optionTrue.innerText = "TAK";

    const optionFalse = document.createElement("option");
    optionFalse.value = "false";
    optionFalse.innerText = "NIE";
    select.addEventListener("change", (e) => {
      //@ts-ignore
      if (e.target.value === "false") task.active = false;
      //@ts-ignore
      if (e.target.value === "true") task.active = true;
    });
    select.append(optionTrue);
    select.append(optionFalse);
    td.append(select);
    return td;
  }

  createSelectActive(task: Task) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
    );
    const select = document.createElement("select");

    const optionTrue = document.createElement("option");
    optionTrue.value = "true";
    optionTrue.innerText = "AKTYWNY";

    const optionFalse = document.createElement("option");
    optionFalse.value = "false";
    optionFalse.innerText = "NIEAKTYWNY";

    select.setAttribute(
      "class",
      "shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    );
    select.addEventListener("change", (e) => {
      //@ts-ignore
      if (e.target.value === "false") task.active = false;
      //@ts-ignore
      if (e.target.value === "true") task.active = true;
    });

    select.append(optionTrue);
    select.append(optionFalse);

    select.value = task.active ? "true" : "false";

    td.append(select);
    return td;
  }
  createInputTdIntensityTime(task: Task) {
    const td: HTMLTableDataCellElement = document.createElement("td");
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
    );

    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute(
      "class",
      "shadow appearance-none border rounded max-w-2xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    );
    input.value = String(task.intensityTime);
    input.addEventListener("change", (e) => {
      //@ts-ignore
      task.intensityTime = Number(e.target.value);
    });
    td.append(input);
    return td;
  }
  handleFilterChange(e) {
    this.stringFilter = e.target.value.toLowerCase().trim();
    this.render();
  }

  filter(list: Array<Task>) {
    const x = list.filter(({ name, group, active }) => {
      const stringToCheck = `${name}${group}`;
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
    return x;
  }

  private createFormTr(task: Task) {
    const tr: HTMLTableRowElement = document.createElement("tr");
    const name = this.createInputTdName(task);
    const group = this.createInputTdGroup(task);
    const intensityTime = this.createInputTdIntensityTime(task);
    const parameterized = this.createSelectParametrized(task);
    const active = this.createSelectActive(task);
    const button = this.createChangeButton(task.id);
    tr.append(name);
    tr.append(group);
    tr.append(intensityTime);
    tr.append(parameterized);
    tr.append(active);
    tr.append(button);
    this.container.append(tr);
  }

  public render() {
    this.container.innerHTML = "";
    const list: Array<Task> = new AdminTasks().getAll();
    const listAfterFilters = this.filter(list);
    listAfterFilters.forEach((task) => {
      if (task.editable) return this.createFormTr(task);
      return this.createTr(task);
    });
  }
}
