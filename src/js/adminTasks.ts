import { AddAdminTask } from "./scripts/addAdminTask";

class AdminTask {
  addTasks: AddAdminTask;

  constructor() {
    this.addTasks = new AddAdminTask();
  }

  addTask() {}
  validateAddTask() {}

  addListeners() {}
}

new AdminTask();
