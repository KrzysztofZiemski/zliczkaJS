const FAVOURITE_TASK = "FAVOURITE_TASK";
import { TaskInterface, TasksApi } from "./tasks";
import { Reports, RenderReportsElements } from "./reports";
// @ts-ignore: Unreachable code error
import img from "../../assets/plusImg.png";

interface FavouriteTaskInterface extends TaskInterface {
  count: number;
}

const sortProvider = (a: FavouriteTaskInterface, b: FavouriteTaskInterface) => {
  if (a.count > b.count) return -1;
  if (a.count < b.count) return 1;
  return 0;
};

export class FavouriteTasks {
  container: HTMLUListElement;
  constructor() {
    this.container = document.createElement("ul");
    document.querySelector("#favourite-tasks").append(this.container);
  }
  getAll(): Array<FavouriteTaskInterface> {
    const favouriteId: Array<FavouriteTaskInterface> | null = JSON.parse(
      localStorage.getItem(FAVOURITE_TASK)
    );

    return Array.isArray(favouriteId) ? favouriteId : [];
  }
  remove(id: string) {
    const tasks: Array<FavouriteTaskInterface> = this.getAll() || [];
    const insexDeleted = tasks.findIndex((task) => task.id === id);
    tasks.splice(insexDeleted, 1);
    localStorage.setItem(FAVOURITE_TASK, JSON.stringify(tasks));
    this.render();
  }
  add(addedTask: TaskInterface) {
    const tasks: Array<FavouriteTaskInterface> = this.getAll() || [];
    const existingTask: FavouriteTaskInterface | undefined = tasks.find(
      (element: TaskInterface) => addedTask.id === element.id
    );

    if (existingTask === undefined) {
      const newTask: FavouriteTaskInterface = {
        ...addedTask,
        count: 1,
      };

      tasks.push(newTask);
    } else {
      const { name, active, intensityTime, group, parametrized } = addedTask;
      existingTask.name = addedTask.name;
      existingTask.active = active;
      existingTask.intensityTime = intensityTime;
      existingTask.group = group;
      existingTask.parametrized = parametrized;
      existingTask.count++;
    }

    localStorage.setItem(FAVOURITE_TASK, JSON.stringify(tasks));
  }
  id: number;
  name: string;
  active: boolean;
  intensityTime: number;
  type: string;
  isParameterized: boolean;
  createButton(task: TaskInterface) {
    const button: HTMLButtonElement = document.createElement("button");
    button.setAttribute("class", "m-3 mr-6 shadow-lg");

    // const task: TaskInterface = new TasksApi().get(idFavouritedTask);
    // if (!task) return;

    const { id, name, parametrized, intensityTime } = task;
    button.addEventListener("click", () => {
      new Reports().add(id, name, parametrized, intensityTime);
      new RenderReportsElements().render();
    });

    const imgElement: HTMLImageElement = document.createElement("img");
    imgElement.setAttribute("src", `${img}`);
    imgElement.setAttribute("class", "w-9 fill-current ");

    button.append(imgElement);
    return button;
  }

  getTop(): Array<FavouriteTaskInterface> {
    return this.getAll().sort(sortProvider).slice(0, 6);
  }
  createTextElement(text: string) {
    const span: HTMLSpanElement = document.createElement("span");
    span.innerText = text;
    return span;
  }
  createTask(favouriteTask: FavouriteTaskInterface) {
    const li: HTMLLIElement = document.createElement("li");
    li.setAttribute("class", "flex items-center shadow-lg");

    const button = this.createButton(favouriteTask);
    const removeButton = this.getButtonRemove(favouriteTask.id);
    li.append(button);
    li.append(this.createTextElement(favouriteTask.name));
    li.append(removeButton);
    return li;
  }
  getButtonRemove(id: string): HTMLButtonElement {
    const button: HTMLButtonElement = document.createElement("button");
    button.innerText = "USUŃ Z LISTY";
    button.addEventListener("click", () => {
      this.remove(id);
      this.render();
    });
    button.setAttribute(
      "class",
      " bg-yellow-300 hover:bg-yellow-400 hover:text-white border border-gray-400 text-blue-700 rounded-lg uppercase m-3 mr-6 py-2 px-3 shadow-lg"
    );
    return button;
  }
  createNoActiveMessageTask(favouriteTask: FavouriteTaskInterface) {
    const li: HTMLLIElement = document.createElement("li");
    li.setAttribute("class", "flex items-center shadow-lg");
    const span = this.createTextElement(favouriteTask.name);
    span.setAttribute("class", "mx-5");
    const span2 = this.createTextElement("zadanie nieaktywne");
    span2.setAttribute("class", "text-red-500");
    const button = this.getButtonRemove(favouriteTask.id);
    li.append(button, span2, span);
    return li;
  }
  render() {
    this.container.innerHTML = "";
    const favouriteTasks = this.getTop();
    const liElements: Array<HTMLLIElement> = favouriteTasks.map(
      (favouriteTask) => {
        const allActiveTasks = new TasksApi()
          .getAll()
          .find((task) => task.id === favouriteTask.id);
        return allActiveTasks
          ? this.createTask(favouriteTask)
          : this.createNoActiveMessageTask(favouriteTask);
      }
    );
    liElements.forEach((el) => this.container.append(el));
  }
}
