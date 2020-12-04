import "../tailwind/tailwind.css";

import "../scss/main.scss";
import { TasksApi, RenderTasksElements } from "./tasks";
import {
  Reports,
  RenderReportsElements,
  ReportInterface,
  TYPE_FIELD_REPORT,
} from "./reports";
import { DateHandler } from "./dateHandler";

class App {
  tasks: TasksApi;
  taskElementCreator: RenderTasksElements;
  dateHandler: DateHandler;
  report: Reports;
  dashboard: HTMLTableElement;

  constructor() {
    this.tasks = new TasksApi();
    this.report = new Reports();

    this.taskElementCreator = new RenderTasksElements(
      document.querySelector("#selectTasks")
    );
    this.dateHandler = new DateHandler(document.querySelector("#date-panel"));
    this.dashboard = document.querySelector("#dashboard");

    this.init();
  }
  async init() {
    await this.tasks.fetch();
    await this.report.fetch(this.dateHandler.getDate());
    this.taskElementCreator.addOptions(this.tasks.getAll());
    this.renderDashboard();
    this.addListeners();
  }

  addListeners() {
    document
      .querySelector("#dateForm")
      .addEventListener("submit", this.getNewRaport.bind(this));

    document
      .querySelector("#taskForm")
      .addEventListener("submit", this.addTaskToReport.bind(this));

    this.dashboard.addEventListener("change", this.changeDashboard.bind(this));
    document
      .querySelector("#save-report")
      .addEventListener("click", this.saveReport.bind(this));
  }
  saveReport() {
    const ok: boolean = window.confirm("Czy wysłać raport?");
    if (ok) {
      this.report.save();
    }
  }

  changeDashboard(e: Event) {
    const value: number = Number(e.target.value);
    // @ts-ignore: Unreachable code error
    const id: number = Number(e.target.dataset.id);
    // @ts-ignore: Unreachable code error
    //ONE OF TYPE_FIELD_REPORT
    const type: string = e.target.dataset.type;
    this.report.change(id, value, type);
  }

  renderDashboard() {
    new RenderReportsElements(this.dashboard).render(
      this.report.getAll(),
      this.report.getData()
    );
  }
  getNewRaport(e: Event) {
    e.preventDefault();
    console.log("event zmieniam date", e);
  }

  addTaskToReport(e: Event) {
    e.preventDefault();
    const idTask = Number(this.taskElementCreator.getContainer().value);
    const { id, name, isParameterized } = this.tasks.get(idTask);
    this.report.add(id, name, isParameterized);
    this.renderDashboard();
  }
}

new App();
