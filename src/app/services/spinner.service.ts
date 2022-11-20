import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SpinnerService {

    constructor() { }

    private readonly spinnerSubject = new Subject<boolean>();
    private count = 0;

    private startSpinner(): void { this.spinnerSubject.next(true) }
    private stopSpinner(): void { this.spinnerSubject.next(false) }
    public getSpinner(): Observable<boolean> { return this.spinnerSubject.asObservable() }

    public addOneInPool(): void {
        setTimeout(() => {
            if (this.count > 0) {
                this.startSpinner();
            }
        }, 700);
        this.count++;
    }

    public releaseOneFromPool(): void {
        this.count--;
        if (this.count === 0) {
            this.stopSpinner();
        }
    }

}