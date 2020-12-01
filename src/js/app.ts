import "../tailwind/tailwind.css";

import '../scss/main.scss';
import{TasksApi,RenderTasksElements} from './tasks';

(async function initSite(){
    const tasksApi = new TasksApi();
    await tasksApi.fetch();
    const tasksArr = tasksApi.getAll();

    const selectTasks:HTMLSelectElement = document.querySelector('#selectTasks');

    const taskElementCreator = new RenderTasksElements(selectTasks)
    taskElementCreator.addOptions(tasksArr)
})();





