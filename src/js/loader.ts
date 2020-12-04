export class Loader {
  lodaderContainer: HTMLDivElement;
  hide: boolean;

  constructor() {
    this.lodaderContainer = document.querySelector("#loader");
    this.hide = true;
  }
  toggle(): void {
    this.hide = this.lodaderContainer.classList.toggle("hidden");
  }
  setShow() {
    this.hide = false;
  }
  setHide() {}

  isHide(): boolean {
    return this.hide;
  }
}
