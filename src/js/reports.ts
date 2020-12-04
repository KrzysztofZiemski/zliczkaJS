import { SERVER } from "./consts";
import { getStringData } from "./helpers";
import { Loader } from "./loader";

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
  id: number;
  name: string;
  isParameterized: boolean;
  count: number;
  time?: number;
}

export interface ReportInterface {
  idReport: number;
  userId: number;
  description: string;
  date: Date;
  tasks: Array<TaskReportInterface>;
}

export class Reports {
  private url: string;
  private date: Date;
  private fetched: boolean;
  private report: ReportInterface;
  private saved: boolean;

  constructor() {
    this.url = `${SERVER}/reports`;
  }

  async fetch(date: Date): Promise<void> {
    this.date = date;
    try {
      const response = await fetch(`${this.url}/${date.getTime()}`);

      if (response.ok) {
        this.fetched = true;
        const report: ReportInterface = await response.json();
        this.report = report;
      } else {
        throw new Error(
          `Error connection getting tasks status ${response.status}`
        );
      }
    } catch (e) {
      //handle error response
    }
  }
  async save(): Promise<Response> {
    const options = {
      method: "POST",
      body: JSON.stringify(this.report),
    };
    const loader = new Loader();

    loader.setShow();
    try {
      const response = await fetch(this.url, {
        ...requestParam,
        ...options,
      });

      if (response.ok) {
        this.saved = true;
      } else {
        throw new Error(`${response.status}`);
      }
      loader.setHide();

      return response;
    } catch (e) {
      loader.setHide();
      //handle error
    }
  }

  add(id: number, name: string, isParameterized: boolean): void {
    this.saved = false;
    const doubledItem: TaskReportInterface | undefined = this.get(id);

    if (doubledItem !== undefined) {
      //TODO addition count++ or not?
    } else {
      let newItem: TaskReportInterface;
      isParameterized
        ? (newItem = { id, name, isParameterized, count: 1 })
        : { id, name, isParameterized, count: 1, time: 0 };
      this.report.tasks.push(newItem);
    }
  }
  remove(id: number) {
    this.saved = false;
    this.report.tasks = this.report.tasks.filter((el) => el.id !== id);
  }

  updateCount(id: number, value: number) {
    this.saved = false;
    this.get(id).count = value;
  }

  updateTime(id: number, value: number) {
    this.saved = false;
    this.get(id).time = value;
  }

  get(id: number): TaskReportInterface {
    return this.report.tasks.find((el) => el.id === id);
  }
  change(id: number, value: number, type: string) {
    if (type === TYPE_FIELD_REPORT.COUNT) {
      this.updateCount(id, value);
    } else if (TYPE_FIELD_REPORT.TIME) {
      this.updateTime(id, value);
    }
  }
  getAll() {
    return this.report.tasks;
  }

  getData() {
    return this.date;
  }

  getDescription(): string {
    return this.report.description;
  }
}

const headers: Array<string> = ["zadanie", "ilość", "czas"];

export class RenderReportsElements {
  container: HTMLElement;

  constructor(table: HTMLTableElement) {
    this.container = table;
  }
  private createCaption(date: Date) {
    const caption: HTMLTableCaptionElement = document.createElement("caption");
    caption.setAttribute("class", "p-2 bg-blue-600 text-2xl");
    caption.innerText = `Zadania z dnia ${getStringData(date)}`;
    this.container.append(caption);
  }
  private createTd() {}

  static createTr() {}

  private createThead() {
    const thead: HTMLElement = document.createElement("thead");
    const tr: HTMLTableRowElement = document.createElement("tr");
    tr.setAttribute("class", "bg-gray-400");
    headers.forEach((headerString) => {
      const th: HTMLTableHeaderCellElement = this.createTh(headerString);

      tr.append(th);
    });
    thead.append(tr);
    this.container.append(thead);
  }

  private createTh(name: string): HTMLTableHeaderCellElement {
    const th = document.createElement("th");
    th.setAttribute("class", "p-4 text-center");
    th.innerText = name;
    return th;
  }

  private createInput() {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute(
      "class",
      "text-center w-14 border border-gray-300 rounded-lg"
    );
    return input;
  }

  private createBody(reports: Array<TaskReportInterface>) {
    const tbody: HTMLElement = document.createElement("tbody");
    reports.forEach(({ name, count, time, id }, index) => {
      //create tr
      const tr = document.createElement("tr");
      const classTr =
        index % 2
          ? "bg-gray-300 m-4 text-center"
          : "bg-gray-200 m-4 text-center";
      tr.setAttribute("class", classTr);

      //create td name
      const tdName = document.createElement("td");
      tdName.innerText = name;
      tdName.setAttribute("class", "p-4 pl-20 text-left");

      //create td count
      const tdCount = document.createElement("td");
      const inputCount: HTMLInputElement = this.createInput();
      inputCount.dataset.id = String(id);
      inputCount.dataset.type = TYPE_FIELD_REPORT.COUNT;

      inputCount.value = String(count);
      tdCount.append(inputCount);

      //create td time
      const tdTime = document.createElement("td");
      if (time || time === 0) {
        const inputTime: HTMLInputElement = this.createInput();
        inputTime.value = String(time);
        inputTime.dataset.id = String(id);
        inputTime.dataset.type = TYPE_FIELD_REPORT.TIME;
        tdTime.append(inputTime);
      }

      tr.append(tdName);
      tr.append(tdCount);
      tr.append(tdTime);
      tbody.append(tr);
    });
    this.container.append(tbody);
  }
  public render(reports: Array<TaskReportInterface>, date: Date) {
    this.container.innerHTML = null;
    this.createCaption(date);
    this.createThead();
    this.createBody(reports);
  }
}
