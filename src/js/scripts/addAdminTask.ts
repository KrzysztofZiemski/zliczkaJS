import { Loader } from "./loader";
import { Message } from "./message";
import { AddTask } from "./adminTasksApi";
import { AdminTasks } from "./adminTasksApi";

export class AddAdminTask {
  form: HTMLFormElement;
  data: AddTask;
  url: string;

  constructor() {
    this.form = document.querySelector("#add-task-form");
    this.data = {
      name: "",
      group: "",
      parameterized: null,
      intensityTime: null,
    };
    this.addListeners();
  }
  addListeners() {
    this.form.addEventListener("submit", this.handleAddTask.bind(this));
    this.form
      .querySelector('input[name="name"]')
      .addEventListener("change", this.changeName.bind(this));
    this.form
      .querySelector('input[name="group"]')
      .addEventListener("change", this.changeGroup.bind(this));
    this.form
      .querySelector('select[name="parameterized"]')
      .addEventListener("change", this.changeParametrized.bind(this));
    this.form
      .querySelector('input[name="intensityTime"]')
      .addEventListener("change", this.changeIntensityTime.bind(this));
  }
  private async handleAddTask(e) {
    e.preventDefault();
    const isOk = this.validate();
    if (!isOk) return alert("Uzupełnij wszystkie wymagane pola");
    const loader = new Loader();
    const message = new Message();
    try {
      loader.setShow();
      const response = await new AdminTasks().addTask(this.data);
      loader.setHide();
      if (response.status === 200) return message.set("dodano czynność");
      return message.set(
        "Nie udało się dodać czynności",
        `status ${response.status}`
      );
    } catch (err) {
      if (err.status === 401)
        return message.set("Brak uprawnień", "Zaloguj się ponownie");
      loader.setHide();
    }
  }

  private validate() {
    let isOk = true;
    if (this.data.name.length < 3) isOk = false;
    if (this.data.group.length < 3) isOk = false;
    if (this.data.parameterized === null) isOk = false;
    if (this.data.parameterized === true)
      if (this.data.intensityTime < 1 || this.data.intensityTime === null)
        isOk = false;

    return isOk;
  }
  private changeName(e) {
    this.data.name = e.target.value;
  }

  private changeGroup(e) {
    this.data.group = e.target.value;
  }
  private changeParametrized(e) {
    const intensityTimeField: HTMLSelectElement = this.form.querySelector(
      'input[name="intensityTime"]'
    );

    if (e.target.value === "true") {
      this.data.parameterized = true;
      intensityTimeField.removeAttribute("disabled");
    } else {
      this.data.parameterized = e.target.value === "false" ? false : null;
      this.data.intensityTime = null;
      intensityTimeField.value = "";
      intensityTimeField.setAttribute("disabled", "disabled");
    }
  }
  private changeIntensityTime(e) {
    this.data.intensityTime = Number(e.target.value);
  }
}
