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
  getDateFormat() {
    const year = this.date.getFullYear();
    const month =
      this.date.getMonth() > 8
        ? this.date.getMonth() + 1
        : `0${this.date.getMonth()}`;
    const day =
      this.date.getDate() > 9 ? this.date.getDate() : `0${this.date.getDate()}`;
    return `${year}-${month}-${day}`;
  }
  change(e: Event): void {
    // @ts-ignore
    this.date = new Date(e.target.value);
    console.log(this.date);
    console.log("po", this.getDateFormat());
  }
}
