import { Loader } from "./loader";

const requestParam: RequestInit = {
  credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

export interface TaskInterface {
  id: string;
  name: string;
  active: boolean;
  intensityTime: number;
  group: string;
  parametrized: boolean;
}
let tasks: Array<TaskInterface> = [];
let fetched: boolean;

export class TasksApi {
  private url: string;

  constructor() {
    this.url = `../api/tasks`;
    fetched = false;
  }

  async fetch(): Promise<void> {
    const loader = new Loader();
    loader.setShow();
    try {
      const tasksResponse = await fetch(
        `${this.url}?active=true`,
        requestParam
      );
      loader.setHide();
      if (tasksResponse.ok) {
        const fetchedTasks: Array<TaskInterface> = await tasksResponse.json();
        fetched = true;
        tasks = fetchedTasks;
      } else {
        throw new Error(
          `Error connection getting tasks status ${tasksResponse.status}`
        );
      }
    } catch (e) {
      loader.setHide();
      //handle error
    }
  }
  getAll(): Array<TaskInterface> {
    return tasks;
  }
  get(id: string): TaskInterface | undefined {
    return tasks.find((task) => task.id === id);
  }
}

export class RenderTasksElements {
  private constainer: HTMLSelectElement;
  private options: Array<TaskInterface>;
  private types: Array<string>;

  constructor(container?: HTMLSelectElement) {
    this.constainer = container || document.createElement("select");
  }

  getContainer(): HTMLSelectElement {
    return this.constainer;
  }

  createElement(element: string, contain: string = "") {
    const output: HTMLElement = document.createElement(element);
    output.innerText = contain;
    return output;
  }
  getTypes(tasksArr: Array<TaskInterface>) {
    const types: Object = {};
    const ouptut = [];
    if (!Array.isArray(tasksArr)) return;

    tasksArr.forEach((el) => {
      types[el.group] = "";
    });
    for (let type in types) {
      ouptut.push(type);
    }
    return ouptut;
  }

  addOptions(tasksArr: Array<TaskInterface>) {
    if (!Array.isArray(tasksArr)) return;
    //todo

    const types = this.getTypes(tasksArr);

    types.forEach((type) => {
      const optgroup = document.createElement("optgroup");
      optgroup.setAttribute("label", type || "brak");
      tasksArr.forEach((task) => {
        if (task.group === type) {
          const optionElement = this.createElement("option");
          optionElement.setAttribute("value", String(task.id));
          optionElement.innerText = task.name;
          optgroup.append(optionElement);
        }
      });
      this.constainer.append(optgroup);
    });
  }
}
