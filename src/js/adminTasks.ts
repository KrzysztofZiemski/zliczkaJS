import { AddAdminTask } from "./scripts/addAdminTask";
import { AdminTasks, TableAdminTasks, Task } from "./scripts/adminTasks";

class AdminTask {
  addTasks: AddAdminTask;
  tasksApi: AdminTasks;
  stringFilter: string;
  filterCheckbox: HTMLInputElement;

  constructor() {
    this.stringFilter = "";
    this.filterCheckbox = document.querySelector("#filter-checkbox");
    this.addTasks = new AddAdminTask();
    this.tasksApi = new AdminTasks();
    this.addListeners();
    this.render();
  }
  async render() {
    await this.tasksApi.fetchAll();
    this.renderTable();
  }

  renderTable() {
    const tasks: Array<Task> = this.tasksApi.getAll();
    const list: Array<Task> = this.filter(tasks);

    new TableAdminTasks().render(list);
  }
  filter(list: Array<Task>) {
    return list.filter(({ name, group, active }) => {
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
  }
  handleFilterChange(e) {
    this.stringFilter = e.target.value.toLowerCase().trim();
    this.renderTable();
  }
  addListeners() {
    const inputFilter: HTMLInputElement = document.querySelector("#filter");
    inputFilter.addEventListener("change", this.handleFilterChange.bind(this));
    document
      .querySelector("#filter-checkbox")
      .addEventListener("change", this.renderTable.bind(this));
  }
}

new AdminTask();
