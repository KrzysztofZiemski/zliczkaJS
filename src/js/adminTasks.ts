import { AddAdminTask } from "./scripts/addAdminTask";
import { AdminTasks, TableAdminTasks, Task } from "./scripts/adminTasks";

class AdminTask {
  addTasks: AddAdminTask;
  tasksApi: AdminTasks;

  constructor() {
    this.addTasks = new AddAdminTask();
    this.tasksApi = new AdminTasks();
    this.addListeners();
    this.render();
  }
  async render() {
    await this.tasksApi.fetchAll();
    const task: Array<Task> = this.tasksApi.getAll();

    new TableAdminTasks().render(task);
  }
  filter(e) {
    console.log("weszło");
    const filter: string = e.target.value.toLowerCase().trim();
    const list: Array<Task> = new AdminTasks().getAll();

    const newList = list.filter(({ name, group }) => {
      const stringToCheck = `${name}${group}`;
      return stringToCheck.toLocaleLowerCase().trim().includes(filter);
    });

    new TableAdminTasks().render(newList);
  }
  addListeners() {
    const inputFilter: HTMLInputElement = document.querySelector("#filter");
    inputFilter.addEventListener("change", this.filter.bind(this));
  }
}

new AdminTask();
