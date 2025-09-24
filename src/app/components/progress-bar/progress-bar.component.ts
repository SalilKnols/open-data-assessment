import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container" *ngIf="shouldShowProgress">
      <div class="progress-info">
        <span class="progress-text">{{ progressText }}</span>
        <span class="progress-percentage">{{ progressPercentage }}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          [style.width.%]="progressPercentage">
          <div class="progress-shine"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
      margin-top: var(--nashtech-spacing-sm);
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--nashtech-spacing-xs);
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .progress-text {
      color: var(--nashtech-white);
      opacity: 0.9;
    }

    .progress-percentage {
      color: var(--nashtech-white);
      font-weight: 600;
      background: rgba(255, 255, 255, 0.2);
      padding: 2px var(--nashtech-spacing-xs);
      border-radius: var(--nashtech-radius-full);
      font-size: 0.75rem;
      min-width: 40px;
      text-align: center;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--nashtech-radius-sm);
      overflow: hidden;
      position: relative;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0.9) 0%, 
        rgba(255, 255, 255, 1) 50%, 
        rgba(255, 255, 255, 0.9) 100%);
      border-radius: var(--nashtech-radius-sm);
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .progress-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 100%
      );
      animation: shine 3s infinite linear;
    }

    @keyframes shine {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .progress-info {
        font-size: 0.75rem;
      }

      .progress-percentage {
        font-size: 0.6875rem;
        padding: 2px 4px;
        min-width: 35px;
      }

      .progress-bar {
        height: 5px;
      }
    }
  `]
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  progressPercentage = 0;
  progressText = 'Getting Started';
  shouldShowProgress = false;

  private destroy$ = new Subject<void>();

  constructor(private assessmentService: AssessmentService) {}

  ngOnInit() {
    this.assessmentService.assessmentData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateProgress();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateProgress() {
    const currentStep = this.assessmentService.getCurrentStep();
    this.shouldShowProgress = currentStep > 0 && this.assessmentService.hasUserDetails();

    if (this.shouldShowProgress) {
      this.progressPercentage = this.assessmentService.getProgressPercentage();
      this.progressText = this.assessmentService.getProgressText();
    }
  }
}
