import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AssessmentService } from '../services/assessment.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentGuard implements CanActivate {

  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.assessmentService.hasUserDetails()) {
      return true;
    } else {
      this.router.navigate(['/user-details']);
      return false;
    }
  }
}
