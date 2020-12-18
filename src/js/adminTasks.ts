import { AddAdminTask } from "./scripts/addAdminTask";
import { AdminTasks, TableAdminTasks, Task } from "./scripts/adminTasksApi";

class AdminTask {
  addTasks: AddAdminTask;
  tasksApi: AdminTasks;

  constructor() {
    this.addTasks = new AddAdminTask();
    this.tasksApi = new AdminTasks();

    this.render();
  }
  async render() {
    await this.tasksApi.fetchAll();
    this.renderTable();
  }

  renderTable() {
    const tasks: Array<Task> = this.tasksApi.getAll();
    new TableAdminTasks().render();
  }
}

new AdminTask();
