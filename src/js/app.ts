// import "../style/tailwind.css";
//tymc\zsowo wyłączyłem style
import { TasksApi, RenderTasksElements, TaskInterface } from "./scripts/tasks";
import {
  Reports,
  RenderReportsElements,
  ReportInterface,
  TYPE_FIELD_REPORT,
} from "./scripts/reports";
import { DateHandler } from "./scripts/dateHandler";
import { FavouriteTasks } from "./scripts/favouriteTasks";

class App {
  tasks: TasksApi;
  taskElementCreator: RenderTasksElements;
  dateHandler: DateHandler;
  report: Reports;
  favouriteTasks: FavouriteTasks;

  constructor() {
    this.tasks = new TasksApi();
    this.report = new Reports();
    this.favouriteTasks = new FavouriteTasks();
    this.taskElementCreator = new RenderTasksElements(
      document.querySelector("#selectTasks")
    );
    this.dateHandler = new DateHandler(document.querySelector("#date-panel"));

    this.init();
  }

  async init() {
    await this.tasks.fetch();
    await this.report.fetch(this.dateHandler.getDateFormat());
    this.taskElementCreator.addOptions(this.tasks.getAll());
    this.favouriteTasks.render();

    if (this.tasks.getAll().length > 0) this.renderDashboard();

    this.addListeners();
  }

  addListeners() {
    document
      .querySelector("#dateForm")
      .addEventListener("submit", this.getNewRaport.bind(this));

    document
      .querySelector("#taskForm")
      .addEventListener("submit", this.addTaskToReport.bind(this));

    document
      .querySelector("#dashboard")
      .addEventListener("change", this.changeDashboard.bind(this));

    document
      .querySelector("#save-report")
      .addEventListener("click", this.saveReport.bind(this));
    document
      .querySelector("textarea[name='description']")
      .addEventListener("change", this.handleReportComment.bind(this));

    window.onbeforeunload = function () {
      return "Czy na pewno chcesz wyjść ze strony? Sprawdź czy zmiany są zapisane";
    };
  }
  handleReportComment(e) {
    new Reports().comment(e.target.value);
  }
  warningExitPage(e: Event) {
    return "są niezapisane zmiany";
  }

  async saveReport() {
    const ok: boolean = window.confirm("Czy wysłać raport?");
    if (ok) {
      await this.report.save();
      this.renderDashboard();
    }
  }

  changeDashboard(e: Event) {
    // @ts-ignore: Unreachable code error
    const value: number = e.target.value;
    // @ts-ignore: Unreachable code error
    const id: string = e.target.dataset.id;
    // @ts-ignore: Unreachable code error
    //ONE OF TYPE_FIELD_REPORT
    const type: string = e.target.dataset.type;
    this.report.change(id, value, type);
    this.renderDashboard();
  }

  renderDashboard() {
    new RenderReportsElements().render();
  }
  getNewRaport(e: Event) {
    e.preventDefault();
    console.log("event zmieniam date", e);
  }

  addTaskToReport(e: Event) {
    e.preventDefault();
    const idTask = this.taskElementCreator.getContainer().value;

    const addedTask: TaskInterface = this.tasks.get(idTask);

    const { id, name, parameterized } = addedTask;

    //TODO
    this.favouriteTasks.add(addedTask);

    this.report.add(id, name, parameterized, addedTask.intensityTime);
    this.renderDashboard();
  }
}

new App();
