import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, delay, map, switchMap, take, tap } from "rxjs";
import { Candidate } from "../models/candidate.model";
import { HttpClient } from "@angular/common/http";
import { apiUrl } from "src/constants/url.constant";

@Injectable()
export class CandidateService {
    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private _candidateList$ = new BehaviorSubject<Candidate[]>([]);
    get candidateList$(): Observable<Candidate[]> {
        return this._candidateList$.asObservable();
    }

    lastChangeDate = 0;
    constructor(private http: HttpClient) { }
    private setLoading(status: boolean): void {
        this._loading$.next(status);
    }

    getCandidate() {
        if (Date.now() - this.lastChangeDate < 60000)
            return;
        this.setLoading(true);
        this.http.get<Candidate[]>(apiUrl + "/candidates").pipe(
            delay(1000),
            tap(val => {
                this._candidateList$.next(val);
                this.setLoading(false);
                this.lastChangeDate = Date.now();
            })
        ).subscribe();
    }

    getCandidateById(id: number): Observable<Candidate> {
        if (this.lastChangeDate === 0) {
            this.getCandidate();
        }
        return this.candidateList$.pipe(
            map(candidates => candidates.filter(candidate => candidate.id === id)[0])
        );



    }

    refuseCandidate(id: number): void {
        this.setLoading(true);
        this.http.delete(`${apiUrl}/candidates/${id}`).pipe(
            delay(1000),
            switchMap(() => this.candidateList$),
            take(1),
            map(candidates => candidates.filter(candidate => candidate.id !== id)),
            tap(candidates => {
                this._candidateList$.next(candidates);
                this.setLoading(false);
            })
        ).subscribe();
    }

    hireCandidate(id: number): void {
        this.candidateList$.pipe(
            take(1),
            map(candidates => candidates
                .map(candidate => candidate.id === id ?
                    { ...candidate, company: 'Snapface Ltd' } :
                    candidate
                )
            ),
            tap(updatedCandidates => this._candidateList$.next(updatedCandidates)),
            switchMap(updatedCandidates =>
                this.http.patch(`${apiUrl}/candidates/${id}`,
                    updatedCandidates.find(candidate => candidate.id === id))
            )
        ).subscribe();
    }
}
