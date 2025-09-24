import { Routes } from '@angular/router';
import { AssessmentGuard } from './guards/assessment.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/user-details',
    pathMatch: 'full'
  },
  {
    path: 'user-details',
    loadComponent: () => import('./pages/user-details/user-details.component').then(m => m.UserDetailsComponent)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent),
    canActivate: [AssessmentGuard]
  },
  {
    path: 'assessment',
    loadComponent: () => import('./pages/assessment/assessment.component').then(m => m.AssessmentComponent),
    canActivate: [AssessmentGuard]
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent),
    canActivate: [AssessmentGuard]
  },
  {
    path: '**',
    redirectTo: '/user-details'
  }
];
