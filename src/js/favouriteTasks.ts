const FAVOURITE_TASK = "FAVOURITE_TASK";
import { TaskInterface } from "./tasks";

interface FavouriteTaskInterface extends TaskInterface {
  count: number;
}

const sortProvider = (a: FavouriteTaskInterface, b: FavouriteTaskInterface) => {
  if (a.count > b.count) return -1;
  if (a.count < b.count) return 1;
  return 0;
};

export class FavouriteTasks {
  getAll(): Array<FavouriteTaskInterface> {
    const favouriteId: Array<FavouriteTaskInterface> | null = JSON.parse(
      localStorage.getItem(FAVOURITE_TASK)
    );

    return Array.isArray(favouriteId) ? favouriteId : [];
  }

  add(addedTask: TaskInterface) {
    const tasks: Array<FavouriteTaskInterface> = this.getAll() || [];
    const existingTask: FavouriteTaskInterface | undefined = tasks.find(
      (element: TaskInterface) => addedTask.id === element.id
    );

    if (existingTask === undefined) {
      const {
        id,
        name,
        active,
        intensityTime,
        type,
        isParameterized,
      } = addedTask;

      const newTask: FavouriteTaskInterface = {
        id,
        name,
        active,
        intensityTime,
        type,
        isParameterized,
        count: 1,
      };

      tasks.push(newTask);
    } else {
      existingTask.count++;
    }

    localStorage.setItem(FAVOURITE_TASK, JSON.stringify(tasks));
  }
  getTop(): Array<FavouriteTaskInterface> {
    return this.getAll().sort(sortProvider).slice(0, 2);
  }
}
