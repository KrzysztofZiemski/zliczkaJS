export class AdminReportTable {
  container: HTMLElement;
  head: HTMLElement;
  body: HTMLElement;
  constructor(container: HTMLElement) {
    this.container = container;
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
      "p-4 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider border-l-2 border-r-2"
    );
    th.innerText = text || "";
    return th;
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
    values.forEach((header) => {
      const td = document.createElement("td");
      td.innerText = header;
      tr.append(td);
    });
    this.body.prepend(tr);
  }
}
