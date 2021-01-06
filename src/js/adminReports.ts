import {
  Reports,
  ReportInterface,
  TaskReportInterface,
} from "./scripts/reports";
import { getStringData } from "./scripts/helpers";
import { Loader } from "./scripts/loader";
import { Message } from "./scripts/message";
import { AdminReportTable } from "./scripts/adminReportTable";
import { EmployeesApi, GettingEmployee } from "./scripts/employees";
import { UserPanel } from "./scripts/userPanel";

interface TaskReportPlusDateInterface {
  taskId: string;
  name: string;
  parametrized: boolean;
  count: number;
  time?: number;
  intensityTime?: number;
  date: string;
}

export class AdminReport {
  report: Reports;
  constructor() {
    this.init();
  }

  init() {
    this.report = new Reports();
    this.addListeners();
    this.setDefaultDates();
    this.addEmployessList();
    this.setUserPanel();
  }

  async setUserPanel() {
    try {
      const { name, lastName } = await new EmployeesApi().getSelf();
      new UserPanel(`${name} ${lastName}`);
    } catch (err) {
      console.log(err);
    }
  }

  async addEmployessList() {
    const employesApi = new EmployeesApi();
    await employesApi.fetchAll();
    const employees: Array<GettingEmployee> = employesApi.getAll();
    employees.sort((a, b) => {
      if (a.lastName > b.lastName) return 1;
      if (a.lastName < b.lastName) return 1;
      return 0;
    });
    const select = document.querySelector("#employeeList-select");
    employees.forEach(({ id, name, lastName }) => {
      const option = document.createElement("option");
      option.value = id;
      option.innerText = `${name} ${lastName}`;
      select.append(option);
    });
  }
  getDateText(date: string): string {
    return date.slice(0, 10).replace(/-/g, "/");
  }

  setMessage() {
    const message = new Message();
  }

  addListeners() {
    document
      .querySelector("#admin-report-panel-btn")
      .addEventListener("click", this.handleGetNewReports.bind(this));
  }
  setDefaultDates() {
    const date = new Date();
    const startMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);

    const startInput: HTMLInputElement = document.querySelector(
      "#date-panel-start"
    );
    const endInput: HTMLInputElement = document.querySelector(
      "#date-panel-end"
    );
    startInput.value = getStringData(startMonthDate, true);
    endInput.value = getStringData(date, true);
  }

  async handleGetNewReports() {
    const startInput: HTMLInputElement = document.querySelector(
      "#date-panel-start"
    );
    const endInput: HTMLInputElement = document.querySelector(
      "#date-panel-end"
    );
    const employeeSelect: HTMLInputElement = document.querySelector(
      "#employeeList-select"
    );
    const reports = await this.getReport(
      startInput.value,
      endInput.value,
      employeeSelect.value
    );

    if (reports) {
      this.renderReportsTable(reports);
      this.renderReportsList(reports);
    }
  }

  async getReport(start: string, end: string, id: string) {
    const loader = new Loader();
    loader.setShow();
    try {
      const reports: Array<ReportInterface> =
        id !== "all"
          ? await this.report.fetchByEmployee(start, end, id)
          : await this.report.fetchAll(start, end);
      loader.setHide();
      return reports;
    } catch (err) {
      loader.setHide();
      const message = new Message();
      message.set("Błąd podczas pobierania raportów", err);
    }
  }

  async renderReportsList(reports: Array<ReportInterface>) {
    const listElement: HTMLUListElement = document.querySelector(
      "#container__list"
    );
    if (listElement) listElement.innerHTML = "";

    if (reports.length === 0) return;
    const employesApi = new EmployeesApi();
    let employees: Array<GettingEmployee> = employesApi.getAll();
    if (employees.length === 0) {
      await employesApi.fetchAll();
      employees = employesApi.getAll();
    }

    try {
      let copyReports = reports.map(async ({ userId, ...report }) => {
        const user: GettingEmployee = employees.find(
          (employee) => employee.id === userId
        );
        if (user) {
          return {
            ...report,
            userId,
            name: user.name,
            lastName: user.lastName,
          };
        }
        const [userFetch]: Array<GettingEmployee> = await employesApi.get(
          userId
        );

        return {
          ...report,
          userId,
          name: userFetch.name,
          lastName: userFetch.lastName,
        };
      });
      const afterUserFetchReport: Array<any> = await Promise.all(copyReports);
      afterUserFetchReport.sort((a, b) => {
        const bDate = new Date(b.date).getTime;
        const aDate = new Date(a.date).getTime;
        if (aDate <= bDate) return -1;
        if (aDate > bDate) return 1;
        if (a.lastName > b.lastName) return 1;
        if (a.lastName < b.lastName) return 1;
        return 0;
      });

      const h2 = document.createElement("h2");
      h2.innerText = "LISTA RAPORTÓW";
      h2.setAttribute(
        "class",
        "text-center text-lg p-3 bg-blue-900 text-white"
      );
      listElement.append(h2);

      afterUserFetchReport.forEach(({ date, name, lastName, updated }) => {
        const li = document.createElement("li");

        const modified = this.getDateText(updated) !== this.getDateText(date);

        li.innerText = `${this.getDateText(date)} - ${name} ${lastName}${
          modified ? ` - zmodyfikowane dnia ${this.getDateText(updated)}` : ""
        }`;
        li.setAttribute(
          "class",
          `border list-none  rounded-sm px-3 py-3 ${
            modified ? "bg-yellow-300" : ""
          }`
        );
        listElement.append(li);
      });
    } catch (err) {
      new Message().set("błąd podczas pobierania danych pracowników", err);
    }
  }

  renderReportsTable(reports: Array<ReportInterface>) {
    //if empty list
    if (reports.length === 0) {
      const tablePanel = new AdminReportTable(
        document.querySelector("#container__table")
      );
      tablePanel.renderRow(["brak raportów"]);
      return;
    }

    //creating new tablePanel - clearing html
    const tablePanel = new AdminReportTable(
      document.querySelector("#container__table")
    );

    //declare objects

    const reportsByDate = {};
    const tasksByName = {};

    reports.forEach((report: ReportInterface) => {
      const dateText = this.getDateText(report.date);

      //for reportsByDate
      if (reportsByDate[dateText]) {
        reportsByDate[dateText].push({ ...report, date: dateText });
      } else {
        const newReport: ReportInterface = { ...report, date: dateText };
        reportsByDate[dateText] = [newReport];
      }

      //for tasksByName
      report.tasks.forEach((task: TaskReportInterface) => {
        const taskPlusDate: TaskReportPlusDateInterface = {
          ...task,
          date: dateText,
        };

        if (tasksByName[task.name]) {
          tasksByName[task.name].push(taskPlusDate);
        } else {
          tasksByName[task.name] = [taskPlusDate];
        }
      });
    });

    //declare rows for Render
    const headers = [];
    const summaryRow = [];
    const effectiveRow = [];
    const rows = [];
    //creating headers Array

    for (let date in reportsByDate) {
      headers.push(date);
    }
    headers.sort((a, b) => {
      const aDate = new Date(a).getTime();
      const bDate = new Date(b).getTime();
      if (aDate <= bDate) return -1;
      if (aDate > bDate) return 1;
      return 0;
    });

    //creating effective and summary Arrays

    headers.forEach((date) => {
      //calculations
      const numberReports: number = reportsByDate[date].length;
      const valueTargetTimeForPerson: number = 415;
      const targetTime: number = numberReports * valueTargetTimeForPerson;
      let countTasks: number = 0;
      let timeTasks: number = 0;

      const reportsInDate = reportsByDate[date];
      reportsInDate.forEach((report: ReportInterface) => {
        report.tasks.forEach(({ count, time, intensityTime }) => {
          countTasks += count;
          timeTasks += (time || intensityTime || 0) * count;
          if (time === null && intensityTime === undefined) {
          }
        });
      });

      //summary
      summaryRow.push(countTasks, timeTasks);
      //effective

      const effective = Math.round((timeTasks / targetTime) * 100 || 0);

      effectiveRow.push(effective);
    });

    //creating rows

    const lengthRows = headers.length * 2;

    for (let nameTask in tasksByName) {
      const row: Array<number> = [];
      for (let i = 0; i < lengthRows; i++) {
        row[i] = 0;
      }
      tasksByName[nameTask].forEach((task: TaskReportPlusDateInterface) => {
        const index = headers.findIndex((header) => header === task.date);
        const useIndex = index * 2;
        row[useIndex] += task.count;
        row[useIndex + 1] +=
          (task.time || task.intensityTime || 0) * task.count;
      });
      const convertToStringArray = row.map((el) => {
        if (el === 0) return " ";
        return String(el);
      });
      const renderRow = [nameTask, ...convertToStringArray];
      rows.push(renderRow);
    }
    //tasksByName

    //renders

    tablePanel.renderHeaders(headers);
    rows.forEach((row) => tablePanel.renderRow(row));

    tablePanel.renderSumRow(summaryRow);
    tablePanel.renderPercent(effectiveRow);
  }
}

new AdminReport();
