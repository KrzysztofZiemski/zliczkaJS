import { Reports } from "./scripts/reports";
import { getStringData } from "./scripts/helpers";
import { Loader } from "./scripts/loader";
import { Message } from "./scripts/message";
import { ReportInterface } from "./scripts/reports";
import { AdminReportTable } from "./scripts/adminReportTable";

export class AdminReport {
  report: Reports;
  constructor() {
    this.init();
  }

  init() {
    this.report = new Reports();
    this.addListeners();
    this.setDefaultDates();
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
    const reports = await this.getReport(startInput.value, endInput.value);

    if (reports) this.renderAdminReport(reports);
  }

  async getReport(start: string, end: string) {
    const loader = new Loader();
    loader.setShow();
    try {
      const reports: Array<ReportInterface> = await this.report.fetchAll(
        start,
        end
      );
      loader.setHide();
      return reports;
    } catch (err) {
      loader.setHide();
      const message = new Message();
      message.set("Błąd podczas pobierania raportów", err);
    }
  }
  renderTr() {}

  renderAdminReport(reports: Array<ReportInterface>) {
    const tableDates = {};
    const tableNamesTasks = {};
    reports.forEach(({ date, tasks, userId }) => {
      tableDates[date] = "";
      
      tasks.forEach(({ name, count, time, intensityTime }) => {
        tableNamesTasks[name] = "";
      });
    });

    const headers = [];

    for (let date in tableDates) {
      headers.push(date.slice(0, 10).replace(/-/g, "/"));
    }

    const tablePanel = new AdminReportTable(
      document.querySelector("#container")
    );

    tablePanel.renderHeaders(headers);
  }
}

new AdminReport();
