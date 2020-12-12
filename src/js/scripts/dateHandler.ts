import { getStringData, setDateFormat } from "./helpers";

export class DateHandler {
  date: Date;
  inputDate: HTMLInputElement;

  constructor(inputDate: HTMLInputElement) {
    this.inputDate = inputDate;
    this.init();
  }
  init(): void {
    this.date = setDateFormat(new Date());
    this.inputDate.value = getStringData(this.date, true);
    this.inputDate.addEventListener("change", this.change.bind(this));
  }

  getDate(): Date {
    return this.date;
  }
  change(e: Event): void {
    // @ts-ignore
    this.date = new Date(e.target.value);
  }
}
