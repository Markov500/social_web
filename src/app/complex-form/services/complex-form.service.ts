import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ComplexForm } from "../models/complex-form.model";
import { Observable, catchError, delay, mapTo, of } from "rxjs";
import { apiUrl } from "src/constants/url.constant";

@Injectable()
export class ComplexFormService {
    constructor(private http: HttpClient) { }

    saveUserInfo(formValue: ComplexForm): Observable<boolean> {
        return this.http.post(`${apiUrl}/users`, formValue).pipe(
            mapTo(true),
            delay(1000),
            catchError(() => of(false).pipe(
                delay(1000)
            ))
        );
    }
}