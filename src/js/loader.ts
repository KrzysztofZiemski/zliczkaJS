export class Loader {
  lodaderContainer: HTMLDivElement;
  hide: boolean;

  constructor() {
    this.lodaderContainer = document.querySelector("#loader");
    this.hide = true;
  }
  toggle(): void {
    this.hide = this.lodaderContainer.classList.toggle("hidden");
    this.lodaderContainer.classList.toggle("flex");
  }
  setShow() {
    this.hide = false;
    this.lodaderContainer.classList.add("flex");
    this.lodaderContainer.classList.remove("hidden");
  }
  setHide() {
    this.hide = true;
    this.lodaderContainer.classList.add("hidden");
    this.lodaderContainer.classList.remove("flex");
  }

  isHide(): boolean {
    return this.hide;
  }
}
