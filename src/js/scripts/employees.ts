export interface AddingEmployeeInterface {
  name: string;
  lastName: string;
  login: string;
  mail: string;
  password: string;
}
export interface GettingEmployee extends AddingEmployeeInterface {
  id: string;
  active: boolean;
  permission: number;
  created: string;
}

const requestParam: RequestInit = {
  credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};

export class EmployeesApi {
  url: string;

  constructor() {
    this.url = "/api/users";
  }

  async get(): Promise<void> {
    try {
      const response = await fetch(this.url);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`${response.status}`);
        //TODO handle error
      }
    } catch (er) {
      //TODO handle error
    }
  }

  public add(employee: AddingEmployeeInterface) {
    const requestParam: RequestInit = {
      credentials: "include",
      mode: "cors",
      method: "POST",
      body: JSON.stringify(employee),
      headers: {
        "Content-Type": "application/json",
      },
    };
    return fetch(this.url, requestParam);
  }
}
