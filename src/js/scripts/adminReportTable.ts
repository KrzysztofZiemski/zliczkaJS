export class AdminReportTable {
  container: HTMLElement;
  head: HTMLElement;
  body: HTMLElement;
  constructor(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = "";
    this.container.setAttribute("class", "overflow-auto m-5 w-full flex-grow");
    this.init();
  }
  init() {
    const table = document.createElement("table");
    this.head = document.createElement("thead");
    this.body = document.createElement("tbody");
    table.append(this.head);
    table.append(this.body);
    this.container.append(table);
  }
  createHeadCell(text: string) {
    const th = document.createElement("th");
    th.setAttribute(
      "class",
      "p-4 border-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider border-l-2 border-r-2"
    );
    th.innerText = text || "";
    return th;
  }
  createTdCell(text: string) {
    const td = document.createElement("td");
    td.innerText = text;
    td.setAttribute(
      "class",
      "px-6 py-4 whitespace-no-wrap border text-blue-900 border-gray-500 text-sm leading-5 "
    );
    return td;
  }

  renderHeaders(headers: Array<string>) {
    const trHeader = document.createElement("tr");
    const trSubHeader = document.createElement("tr");

    const taskNameCell = this.createHeadCell("zadanie");
    taskNameCell.setAttribute("rowspan", "2");
    trHeader.append(taskNameCell);

    headers.forEach((header) => {
      const th = this.createHeadCell(header);
      th.setAttribute("colspan", "2");
      trHeader.append(th);
    });

    for (let i = 0; i < headers.length; i++) {
      const thCount = this.createHeadCell("ilość");
      const thTime = this.createHeadCell("czas");

      trSubHeader.append(thCount);
      trSubHeader.append(thTime);
    }
    this.head.prepend(trHeader);
    this.head.append(trSubHeader);
  }

  renderRow(values: Array<string>) {
    const tr = document.createElement("tr");
    values.forEach((cell) => {
      const td = this.createTdCell(cell);
      tr.append(td);
    });
    this.body.append(tr);
  }
  renderSumRow(values: Array<string>) {
    const tr = document.createElement("tr");
    values.forEach((header) => {
      const td = document.createElement("td");
      td.innerText = header;
      td.setAttribute(
        "class",
        "px-6 py-4 whitespace-no-wrap border text-white border-gray-500 text-sm leading-5 bg-black"
      );
      tr.append(td);
    });
    this.body.append(tr);
  }
  renderPercent(values: Array<number>) {
    const tr = document.createElement("tr");
    tr.append(this.createTdCell("EFEKTYWNOŚĆ"));

    values.forEach((cell) => {
      const td = this.createTdCell(`${cell}%`);
      if (cell > 95) {
        td.classList.add("bg-green-200");
      } else if (cell > 70) {
        td.classList.add("bg-yellow-200");
      } else {
        td.classList.add("bg-red-200");
      }
      td.setAttribute("colspan", "2");
      tr.append(td);
    });
    this.body.append(tr);
  }
}
