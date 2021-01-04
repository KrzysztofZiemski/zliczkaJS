import { init } from "../../../backend/db/models/userSchema";

export class UserPanel {
  panel: HTMLElement;
  user: HTMLElement;
  isOpened: boolean;
  menu: HTMLElement;

  constructor(user: string) {
    this.panel = document.querySelector("#user-panel");
    this.user = document.querySelector("#user-name");
    this.user.innerText = user;
    this.closeOption = this.closeOption.bind(this);
    this.init();
  }
  closeOption() {
    this.isOpened = false;
    this.menu.classList.add("h-0");
    this.menu.classList.remove("p-3");
    document.body.removeEventListener("click", this.closeOption, true);
  }
  openOption() {
    this.isOpened = true;
    this.menu.classList.remove("h-0");
    this.menu.classList.add("p-3");

    document.body.addEventListener("click", this.closeOption, true);
  }
  handleOpening(e) {
    e.stopPropagation();
    this.isOpened ? this.closeOption() : this.openOption();
  }
  createPopupOptions() {
    const a = document.createElement("a");
    this.menu = a;
    a.setAttribute("href", "../logout");
    a.setAttribute(
      "class",
      "block overflow-hidden absolute rounded-lg -bottom-full left-0 bg-white w-full hover:bg-gray-200 hover:bg-gray-400 group-hover:text-black hover::text-white h-0"
    );
    a.innerText = "Wyloguj";
    this.panel.append(a);
  }

  init() {
    this.isOpened = false;
    this.createPopupOptions();
    this.panel.addEventListener("click", this.handleOpening.bind(this));
  }
}
