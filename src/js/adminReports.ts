import { Reports } from "./scripts/reports";
import { getStringData } from "./scripts/helpers";
import { Loader } from "./scripts/loader";
import { Message } from "./scripts/message";
import { ReportInterface } from "./scripts/reports";
import { AdminReportTable } from "./scripts/adminReportTable";
import { EmployeesApi, GettingEmployee } from "./scripts/employees";

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

    if (reports) this.renderReportsTable(reports);
  }

  async getReport(start: string, end: string, id: string) {
    const loader = new Loader();
    loader.setShow();
    try {
      ////////fetchByEmployee(dateStart: string, dateEnd: string, id: string)

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

  renderReportsTable(reports: Array<ReportInterface>) {
    if (reports.length === 0) {
      const tablePanel = new AdminReportTable(
        document.querySelector("#container")
      );
      tablePanel.renderRow(["brak raportów"]);
      return;
    }
    const dateText = (date: string) => date.slice(0, 10).replace(/-/g, "/");
    //for headers
    const tableDates = {};

    //for bodyTable
    const tableNamesTasks = {};

    reports.forEach(({ date, tasks, userId }) => {
      const dateString = dateText(date);
      tableDates[dateString] = tableDates[dateString]
        ? tableDates[dateString] + 1
        : 1;

      tasks.forEach(({ name, count, time, intensityTime }) => {
        if (tableNamesTasks[name]) {
          tableNamesTasks[name].push({ date, count, time, intensityTime });
        } else {
          tableNamesTasks[name] = [{ date, count, time, intensityTime }];
        }
      });
    });

    //headers

    const headers = [];
    for (let date in tableDates) {
      headers.push(dateText(date));
    }
    headers.sort((a, b) => {
      const aDate = new Date(a).getTime;
      const bDate = new Date(b).getTime;
      if (a <= b) return -1;
      if (a > b) return 1;
      return 0;
    });

    //body
    const rows = [];
    const sumRow = ["SUMA"];

    for (let name in tableNamesTasks) {
      const row = [name];

      // time and count data for each header
      for (let i = 1; i < headers.length * 2 + 1; i++) {
        row[i] = "";
      }

      tableNamesTasks[name].forEach(({ count, date, intensityTime, time }) => {
        const index = headers.findIndex(
          (headerDate) => headerDate === dateText(date)
        );

        //calcule position for data(2 datas for one header date and first position is task name)
        const useIndex = index * 2 + 1;

        row[useIndex] = row[useIndex]
          ? String(Number(row[useIndex]) + count)
          : String(count);
        const usedTime = intensityTime || time;
        const addingValue = Number(usedTime) * count;

        row[useIndex + 1] = row[useIndex + 1]
          ? String(Number(row[useIndex + 1]) + addingValue)
          : String(addingValue);

        //calculation for last row summary

        const newValueCount: string = sumRow[useIndex]
          ? Number(sumRow[useIndex]) + count
          : count;
        sumRow[useIndex] = String(newValueCount);

        const newValueTime: string = sumRow[useIndex + 1]
          ? String(Number(sumRow[useIndex + 1]) + addingValue)
          : String(addingValue);

        sumRow[useIndex + 1] = newValueTime;
      });
      rows.push(row);
    }

    const tablePanel = new AdminReportTable(
      document.querySelector("#container")
    );

    tablePanel.renderHeaders(headers);

    rows.forEach((row) => tablePanel.renderRow(row));

    const effectiveRow = [];
    const valueTargetTimeForPerson = 415;

    for (let i = 2; i < sumRow.length; i = i + 2) {
      const date = headers[i / 2 - 1 || 0];
      const count = tableDates[date];
      const max = valueTargetTimeForPerson * count;
      effectiveRow.push(Math.round((Number(sumRow[i]) / max) * 100));
    }
    tablePanel.renderSumRow(sumRow);

    tablePanel.renderPercent(effectiveRow);
  }
}

new AdminReport();
