import { Loader } from "./scripts/loader";
import { Message } from "./scripts/message";

const logout = async () => {
  const url: string = "/api/auth/logout";
  const loader = new Loader();
  loader.setShow();
  const response = await fetch(url);
  loader.setHide();
  if (response.ok) {
    const message = new Message();
    message.setAction(() => {
      document.location.href = "/";
    });
    message.set("Wylogowano");
  } else {
    const message = new Message();
    message.set("błąd wylogowania", `${response.status}`);
  }
};
logout();
