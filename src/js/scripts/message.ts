export class Message {
  messageContainer: HTMLDivElement;
  textElementHeader: HTMLHeadElement;
  textElement: HTMLParagraphElement;
  closeBtn: HTMLButtonElement;
  action: Function | undefined;

  constructor() {
    this.messageContainer = document.querySelector("#message-container");
    this.textElementHeader = document.querySelector("#message-text");
    this.textElement = document.querySelector("#message-text2");
    this.closeBtn = document.querySelector("#close-message-btn");
  }

  set(message: string, submessage: string = "") {
    this.textElementHeader.innerText = message;
    this.textElement.innerText = submessage;
    this.messageContainer.classList.add("flex");
    this.messageContainer.classList.remove("hidden");

    this.closeBtn.addEventListener("click", this.close.bind(this));
  }
  setAction(cb: Function) {
    this.action = cb;
  }

  close() {
    if (this.closeBtn !== undefined)
      this.closeBtn.removeEventListener("click", this.close.bind(this));

    this.textElementHeader.innerText = "";
    this.textElement.innerText = "";
    this.messageContainer.classList.add("hidden");
    this.messageContainer.classList.remove("flex");
    if (this.action) this.action();
  }
}
