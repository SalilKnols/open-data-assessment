import { Routes } from '@angular/router';
import { SurveyBuilderComponent } from './features/survey-builder/pages/survey-builder/survey-builder.component';
import { AppComponent } from './app.component'; // Or a Home/Dashboard placeholder

export class DefaultLayoutComponent { } // Just a placeholder if needed

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'builder',
        pathMatch: 'full'
    },
    {
        path: 'builder',
        loadComponent: () => import('./features/survey-builder/pages/survey-builder/survey-builder.component').then(m => m.SurveyBuilderComponent)
    }
];
