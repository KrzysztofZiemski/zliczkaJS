import { SERVER } from "./consts";
import { Loader } from "./loader";

const requestParam: RequestInit = {
  // credentials: 'include',
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

export interface TaskInterface {
  id: number;
  name: string;
  active: boolean;
  intensityTime: number;
  type: string;
  isParameterized: boolean;
}

export class TasksApi {
  private url: string;
  private tasks: Array<TaskInterface>;
  private fetched: boolean;

  constructor() {
    this.url = `${SERVER}/tasks`;
    this.fetched = false;
  }

  async fetch(): Promise<void> {
    const loader = new Loader();
    loader.setShow();
    try {
      const tasksResponse = await fetch(this.url, requestParam);
      loader.setHide();
      if (tasksResponse.ok) {
        const tasks: Array<TaskInterface> = await tasksResponse.json();
        this.fetched = true;
        this.tasks = tasks;
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
    return this.tasks;
  }
  get(id: number): TaskInterface {
    return this.tasks.find((task) => task.id === id);
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
      types[el.type] = "";
    });
    for (let type in types) {
      ouptut.push(type);
    }
    return ouptut;
  }
  addOptions(tasksArr: Array<TaskInterface>) {
    if (!Array.isArray(tasksArr)) return;

    const types = this.getTypes(tasksArr);

    types.forEach((type) => {
      const optgroup = document.createElement("optgroup");
      optgroup.setAttribute("label", type || "brak");
      tasksArr.forEach((task) => {
        if (task.type === type) {
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
