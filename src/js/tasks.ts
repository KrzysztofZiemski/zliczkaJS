import {SERVER} from './consts';

const requestParam:RequestInit  = {
    credentials: 'include'
};

export interface TaskInterface{
    id:string,
    name:string,
    active:boolean,
    intensityTime:number,
    quantity:number,
    time:number,
}

export class Tasks{
    url:string;
    tasks:Array<TaskInterface>;
    fetched:boolean;

    constructor(){
        this.url = `${SERVER}/tasks`;
        this.fetched=false;
    }

    ff(){
        alert('ssssss')
    }

    async fetchAll(){
        try{
            const tasksResponse = await fetch(this.url,requestParam);    
            if(tasksResponse.ok) {
                const tasks:Array<TaskInterface> = await tasksResponse.json();
                this.tasks = tasks;
                this.fetched=true
            }else{
                throw new Error(`Error connection getting tasks status ${tasksResponse.status}`)
            }
            

        }catch(e){
            //handle
        }
    }
    getAll():Array<TaskInterface>{
        return this.tasks;
    }
  
    get(id:string):TaskInterface{
        return this.tasks.find(task=>task.id)
    }
}

