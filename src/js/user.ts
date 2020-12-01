import {SERVER} from './consts';

interface UserInterface{
    id:string;
    name:string;
    lastName:string;
    mail:string;
    permission:number;
}


const requestParam:RequestInit  = {
    // credentials: 'include',
    mode: "cors",
    headers: {
        "Content-Type": "application/json"
      },
      method:'POST'
};

class UserApi{
    private url:string;
    private user:UserInterface;
    private logged:boolean;

    constructor(){
        this.url=`${SERVER}/user`
    }
    async login(login:string,password:string){
        try{
            const userResponse = await fetch(this.url,requestParam);
            if(userResponse.ok){
                const user:UserInterface = await userResponse.json();
                this.logged=true;
                this.user = user;
            }else{
                throw new Error(`${userResponse.text}`);
            } 
        }catch(err){
            //handle error
        }
    }
    get(){
        if(this.logged){
            return this.user;
        }
    }
    //admin 10
    isCan(requiredPermission:number){
        if(this.logged){
            return requiredPermission <= this.user.permission
        }else{
            false;
        }
    }

}