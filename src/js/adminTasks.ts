import { AddAdminTask } from "./scripts/addAdminTask";
import { AdminTasks, TableAdminTasks, Task } from "./scripts/adminTasksApi";
import { UserPanel } from "./scripts/userPanel";
import { EmployeesApi } from "./scripts/employees";

class AdminTask {
  addTasks: AddAdminTask;
  tasksApi: AdminTasks;

  constructor() {
    this.addTasks = new AddAdminTask();
    this.tasksApi = new AdminTasks();
    this.setUserPanel();
    this.render();
  }
  async render() {
    await this.tasksApi.fetchAll();
    this.renderTable();
  }
  async setUserPanel() {
    try {
      const { name, lastName } = await new EmployeesApi().getSelf();
      new UserPanel(`${name} ${lastName}`);
    } catch (err) {
      console.log(err);
    }
  }
  renderTable() {
    const tasks: Array<Task> = this.tasksApi.getAll();
    new TableAdminTasks().render();
  }
}

new AdminTask();
