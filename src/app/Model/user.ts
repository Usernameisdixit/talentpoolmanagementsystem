export class User {
    vchUserName:string;
    vchPassword:string;
    vchEmail:string;
    newPassword:string;
    confirmPassword:string;
    bitFirstLogin:boolean;

     constructor(){
this.vchUserName='';
this.vchPassword='';
this.vchEmail='';
this.newPassword='';
this.confirmPassword='';
this.bitFirstLogin=false;
    }
}
