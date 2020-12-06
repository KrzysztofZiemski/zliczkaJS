const FAVOURITE_TASK = "FAVOURITE_TASK";
import { TaskInterface, TasksApi } from "./tasks";
import { Reports, RenderReportsElements } from "./reports";

// const plusIcon = require("../assets/plus.svg") as string;
// @ts-ignore: Unreachable code error
import img from "../assets/plusImg.png";
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
      const { name, active, intensityTime, type, isParameterized } = addedTask;
      existingTask.name = addedTask.name;
      existingTask.active = active;
      existingTask.intensityTime = intensityTime;
      existingTask.type = type;
      existingTask.isParameterized = isParameterized;
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
  createButton(idFavouritedTask: number) {
    const button: HTMLButtonElement = document.createElement("button");
    button.setAttribute("class", "m-3 mr-6 shadow-lg");

    const { id, name, isParameterized }: TaskInterface = new TasksApi().get(
      idFavouritedTask
    );
    
    button.addEventListener("click", () => {
      new Reports().add(id, name, isParameterized);
      new RenderReportsElements().render();
    });

    const imgElement: HTMLImageElement = document.createElement("img");
    imgElement.setAttribute("src", `${img}`);
    // imgElement.setAttribute("src", img);
    imgElement.setAttribute("class", "w-9 fill-current "); //text-green-600 will works for imf not svg?

    button.append(imgElement);
    return button;
  }

  getTop(): Array<FavouriteTaskInterface> {
    return this.getAll().sort(sortProvider).slice(0, 2);
  }
  createTextElement(text: string) {
    const span: HTMLSpanElement = document.createElement("span");
    span.innerText = text;
    return span;
  }
  createTask(favouriteTask: FavouriteTaskInterface) {
    const li: HTMLLIElement = document.createElement("li");
    li.setAttribute("class", "flex items-center shadow-lg");
    const button = this.createButton(favouriteTask.id);
    li.append(button);
    li.append(this.createTextElement(favouriteTask.name));
    return li;
  }

  render() {
    const favouriteTasks = this.getAll();
    const liElements: Array<HTMLLIElement> = favouriteTasks.map(
      (favouriteTask) => this.createTask(favouriteTask)
    );
    liElements.forEach((el) => this.container.append(el));
  }
}
