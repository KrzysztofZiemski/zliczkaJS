import { getStringData } from "./helpers";
import { Loader } from "./loader";
import { Message } from "./message";

const requestParam: RequestInit = {
  // credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

export const TYPE_FIELD_REPORT = {
  TIME: "TIME",
  COUNT: "COUNT",
};

interface TaskReportInterface {
  taskId: string;
  name: string;
  parametrized: boolean;
  count: number;
  time?: number;
  intensityTime?: number;
}

export interface ReportInterface {
  id: string;
  userId: string;
  description: string;
  date: string;
  tasks: Array<TaskReportInterface>;
  confirmed: boolean;
}

let report: ReportInterface;
let fetched: boolean;
let saved: boolean;

export class Reports {
  private url: string;
  private isLoading: boolean;

  constructor() {
    this.url = `../api/reports`;
  }

  async fetch(date: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${this.url}/${date}`);
      if (response.status === 200) {
        fetched = true;
        const fetchedReport: ReportInterface = await response.json();
        report = fetchedReport;
        saved = true;
      } else if (response.status === 204) {
        const response = await fetch(`${this.url}/create/${date}`);

        if (response.status === 200) {
          fetched = true;
          const fetchedReport: ReportInterface = await response.json();
          report = fetchedReport;
          saved = true;
          console.log("fetch", report);
          return;
        }
        const error = new Error();
        error.message = `Błąd ${response.status}`;
        throw error;
      } else {
        const error = new Error(`Błąd ${response.status}`);
        error.message = `Błąd ${response.status}`;
        throw error;
      }
      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;

      new Message().set(
        "Błąd podczas pobierania zadań - spróbuj za chwilę",
        `${err.message}`
      );
      return Promise.reject();
    }
  }

  isSaved(): boolean {
    return saved;
  }
  async save(): Promise<Response> {
    report.date = report.date.slice(0, 10);

    const options = {
      method: "PUT",
      body: JSON.stringify(report),
    };
    const loader = new Loader();

    this.isLoading = true;
    setTimeout(() => {
      if (this.isLoading) loader.setShow();
    }, 200);

    try {
      const response = await fetch(`${this.url}/${report.id}`, {
        ...requestParam,
        ...options,
      });
      this.isLoading = false;
      loader.setHide();
      if (response.status === 200) {
        saved = true;
        return response;
      } else {
        throw new Error(`${response.status}`);
      }
    } catch (e) {
      this.isLoading = false;
      loader.setHide();
      throw new Error(`${e.status || e}`);
    }
  }

  add(
    id: string,
    name: string,
    parametrized: boolean,
    intensityTime?: number
  ): void {
    saved = false;
    const doubledItem: TaskReportInterface | undefined = this.get(id);

    if (doubledItem !== undefined) {
      //TODO addition count++ or not?
    } else {
      let newItem: TaskReportInterface;
      parametrized
        ? (newItem = {
            taskId: id,
            name,
            parametrized: parametrized,
            count: 1,
            intensityTime,
          })
        : (newItem = {
            taskId: id,
            name,
            parametrized: parametrized,
            count: 1,
            time: 0,
          });

      report.tasks.push(newItem);
    }
    console.log("pod dodaniu", report.tasks);
  }
  remove(id: string) {
    saved = false;
    report.tasks = report.tasks.filter((el) => el.taskId !== id);
  }

  private updateCount(id: string, value: number) {
    this.get(id).count = value;
  }

  private updateTime(id: string, value: number) {
    this.get(id).time = value;
  }

  get(id: string): TaskReportInterface {
    return report.tasks.find((el) => el.taskId === id);
  }
  change(id: string, value: number, type: string) {
    saved = false;
    if (type === TYPE_FIELD_REPORT.COUNT) {
      this.updateCount(id, value);
    } else if (TYPE_FIELD_REPORT.TIME) {
      this.updateTime(id, value);
    }
  }
  comment(value: string) {
    report.description = value;
  }
  getAll() {
    if (!report) return;
    return report.tasks;
  }

  getData() {
    return new Date(report.date);
  }

  getDescription(): string {
    return report.description;
  }
}

const headers: Array<string> = ["zadanie", "ilość", "czas", ""];

export class RenderReportsElements {
  container: HTMLElement;

  constructor() {
    this.container = document.querySelector("#dashboard");
  }
  getContainer(): HTMLElement {
    return this.container;
  }
  private createCaption(date: Date, isSaved: boolean) {
    const caption: HTMLTableCaptionElement = document.createElement("caption");
    caption.setAttribute(
      "class",
      `p-3 rounded-t-lg bg-blue-800 text-lg text-white rounded-t-lg font-bold`
    );
    caption.innerText = `Zadania z dnia ${getStringData(date)}`;
    this.container.append(caption);
  }
  private createTd() {}

  static createTr() {}

  private createThead() {
    const thead: HTMLElement = document.createElement("thead");
    const tr: HTMLTableRowElement = document.createElement("tr");
    tr.setAttribute("class", "");
    headers.forEach((headerString) => {
      const th: HTMLTableHeaderCellElement = this.createTh(headerString);

      tr.append(th);
    });
    thead.append(tr);
    this.container.append(thead);
  }

  private createTh(name: string): HTMLTableHeaderCellElement {
    const th = document.createElement("th");
    th.setAttribute(
      "class",
      "px-6 py-6 border-b-2 border-gray-300 text-left text-lg leading-4 text-blue-500 tracking-wider"
    );
    th.innerText = name;
    return th;
  }

  private createInput() {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("min", "0");
    input.setAttribute("type", "number");
    input.setAttribute(
      "class",
      "text-center w-14 border border-gray-300 rounded-lg text-xl"
    );
    return input;
  }
  removeTaskReport(id: string) {
    new Reports().remove(id);
    this.render();
  }

  private createBody(reports: Array<TaskReportInterface>) {
    if (!Array.isArray(reports)) return;

    const tbody: HTMLElement = document.createElement("tbody");

    reports.forEach(({ name, count, time, taskId: id }, index) => {
      //create tr
      const tr = document.createElement("tr");
      const classTr = index % 2 ? "bg-gray-100 m-4 " : "bg-gray-200 m-4";
      tr.setAttribute("class", classTr);

      //create td name
      const tdName = document.createElement("td");
      tdName.innerText = name;
      tdName.setAttribute(
        "class",
        "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
      );

      //create td count
      const tdCount = document.createElement("td");
      tdCount.setAttribute(
        "class",
        "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
      );
      const inputCount: HTMLInputElement = this.createInput();
      inputCount.dataset.id = String(id);
      inputCount.dataset.type = TYPE_FIELD_REPORT.COUNT;

      //appearance-none

      inputCount.value = String(count);
      tdCount.append(inputCount);

      //create td time
      const tdTime = document.createElement("td");
      tdTime.setAttribute(
        "class",
        "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
      );
      if (time || time === 0) {
        const inputTime: HTMLInputElement = this.createInput();
        inputTime.value = String(time);
        inputTime.dataset.id = String(id);
        inputTime.dataset.type = TYPE_FIELD_REPORT.TIME;
        tdTime.append(inputTime);
      }
      const tdButton = document.createElement("td");
      tdButton.setAttribute(
        "class",
        "px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5"
      );
      const button: HTMLButtonElement = document.createElement("button");
      button.setAttribute("class", "focus:outline-none");

      // button.innerHTML = "USUŃ";
      button.append(this.createSVG());
      //tutaj
      button.addEventListener("click", this.removeTaskReport.bind(this, id));
      tdButton.append(button);

      tr.append(tdName);
      tr.append(tdCount);
      tr.append(tdTime);
      tr.append(tdButton);
      tbody.append(tr);
    });
    this.container.append(tbody);
  }
  setTable(isSaved) {
    this.container.innerHTML = null;
    this.container.classList.add("border-blue-500");
  }
  createSVG(): SVGElement {
    //@ts-ignore
    const svgEl: SVGElement = document
      .querySelector("#svg-delete")
      .cloneNode(true);
    svgEl.setAttribute("width", "25");
    svgEl.setAttribute("height", "25");
    svgEl.setAttribute("class", "fill-current hover:text-blue-600");
    return svgEl;
  }
  public render() {
    const reportApi = new Reports();

    const reports: Array<TaskReportInterface> = reportApi.getAll();

    const date: Date = reportApi.getData();
    const isSaved: boolean = reportApi.isSaved();

    this.setTable(isSaved);
    this.createCaption(date, isSaved);
    this.createThead();
    this.createBody(reports);
  }
}
