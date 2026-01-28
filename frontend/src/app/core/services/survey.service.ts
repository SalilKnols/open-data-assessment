import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SurveyElement } from '../models/survey-element.model';

export interface SurveyRequest {
    title: string;
    description: string;
    schemaJson: {
        pages: {
            name: string;
            elements: SurveyElement[];
        }[];
    };
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class SurveyService {
    private apiUrl = 'http://localhost:8081/api/surveys';

    constructor(private http: HttpClient) { }

    createSurvey(surveyData: SurveyRequest): Observable<any> {
        return this.http.post(this.apiUrl, surveyData);
    }

    updateSurvey(id: number, surveyData: SurveyRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, surveyData);
    }

    getSurvey(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }
}
