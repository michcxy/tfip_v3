import { Injectable, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AccountService } from "./account.service";


@Injectable()
export class AuthGuard implements CanActivate{
    router = inject(Router)
    accSvc: AccountService = inject(AccountService)

    canActivate(): boolean {
        return this.accSvc.isLoggedIn();
        // const isLoggedIn = this.accSvc.isLoggedInSubject;
        // if(isLoggedIn){
        //     return true;
        // }else{
        //     this.router.navigate(['/home']);
        //     return false;
        // }
    }
}