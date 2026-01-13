import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AssessmentService } from '../services/assessment.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentGuard implements CanActivate {

  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.assessmentService.initialized$.pipe(
      filter(isInit => isInit),
      take(1),
      map(() => {
        if (this.assessmentService.hasUserDetails()) {
          return true;
        } else {
          this.router.navigate(['/user-details']);
          return false;
        }
      })
    );
  }
}
