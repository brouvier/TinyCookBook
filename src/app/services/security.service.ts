import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { sha256 } from "js-sha256";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";

@Injectable()
export class SecurityService {

    private static APP_STORAGE = localStorage;
    private static STORAGE_TOKEN_KEY = 'appToken';

    private token: string = '';

    constructor(private msg: MessageService, private router: Router) { }

    unlock(pass: string) {
        this.token = sha256(environment.salt.concat(pass));
        SecurityService.APP_STORAGE.setItem(SecurityService.STORAGE_TOKEN_KEY, this.token);
        this.router.navigate(['list']);
        this.msg.add({ severity: 'info', summary: 'Identification', detail: 'Déverrouillage de l\'application' });
    }

    lock() {
        this.msg.add({ severity: 'warn', summary: 'Identification', detail: 'Verrouillage de l\'application' });
        this.token = '';
        SecurityService.APP_STORAGE.removeItem(SecurityService.STORAGE_TOKEN_KEY);
        this.router.navigate(['login']);
    }

    checkIsLock(withRedirect: boolean): boolean {
        const storageToken = SecurityService.APP_STORAGE.getItem(SecurityService.STORAGE_TOKEN_KEY);
        if (storageToken != null) {
            this.token = storageToken;
            if (withRedirect) {
                this.router.navigate(['list']);
            }
            return false
        } else {
            if (withRedirect) {
                this.router.navigate(['login']);
            }
            return true;
        }
    }

    getAppTocken() {
        return { 'appToken': this.token };
    }

}