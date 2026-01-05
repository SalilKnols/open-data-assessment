import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssessmentService } from '../../services/assessment.service';
import { Question, Answer } from '../../models/assessment.model';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="assessment-container" *ngIf="currentQuestion && !isSubmitting">

      <div class="container">
        <div class="assessment-content fade-in">
          <!-- Compact Progress Header -->
          <div class="progress-header card-nashtech">
            <div class="progress-info">
              <div class="question-meta">
                <span class="question-number">Question {{ currentQuestionIndex }}</span>
                <span class="question-total">of {{ totalQuestions }}</span>
              </div>
              <div class="theme-info">
                <span class="theme-badge" [ngClass]="'theme-' + currentQuestion.theme">
                  {{ getThemeIcon(currentQuestion.theme) }} {{ getThemeTitle(currentQuestion.theme) }}
                </span>
                <span *ngIf="isSaving$ | async" class="saving-badge fade-in">
                  <mat-icon>cloud_upload</mat-icon> Saving...
                </span>
              </div>
            </div>
            <div class="progress-visual">
              <mat-progress-bar 
                mode="determinate" 
                [value]="getQuestionProgress()"
                class="question-progress">
              </mat-progress-bar>
              <span class="progress-text">{{ getQuestionProgress() }}% Complete</span>
            </div>
          </div>

          <!-- Question Card -->
          <mat-card class="question-card card-nashtech">
            <mat-card-header class="question-header">
              <div class="question-icon-wrapper" [ngClass]="'theme-' + currentQuestion.theme">
                <span class="question-icon">{{ getThemeIcon(currentQuestion.theme) }}</span>
              </div>
              <div class="question-content">
                <mat-card-title class="question-title">{{ currentQuestion.question }}</mat-card-title>
                <mat-card-subtitle class="question-subtitle">
                  Select the option that best describes your organization's current maturity level
                </mat-card-subtitle>
              </div>
            </mat-card-header>

            <mat-card-content class="question-body">
              <!-- Compact Maturity Explanation -->
              <div class="maturity-explanation">
                <h4>ODI Maturity Framework</h4>
                <div class="maturity-levels">
                  <div class="maturity-level">
                    <span class="level-number">1</span>
                    <span class="level-name">Initial</span>
                  </div>
                  <div class="level-arrow">→</div>
                  <div class="maturity-level">
                    <span class="level-number">2</span>
                    <span class="level-name">Repeatable</span>
                  </div>
                  <div class="level-arrow">→</div>
                  <div class="maturity-level">
                    <span class="level-number">3</span>
                    <span class="level-name">Defined</span>
                  </div>
                  <div class="level-arrow">→</div>
                  <div class="maturity-level">
                    <span class="level-number">4</span>
                    <span class="level-name">Managed</span>
                  </div>
                  <div class="level-arrow">→</div>
                  <div class="maturity-level">
                    <span class="level-number">5</span>
                    <span class="level-name">Optimising</span>
                  </div>
                </div>
              </div>

              <form [formGroup]="answerForm" class="answer-form">
                <mat-radio-group formControlName="selectedOption" class="answer-options">
                  <mat-radio-button 
                    *ngFor="let option of currentQuestion.options; let i = index; trackBy: trackByOption"
                    [value]="option"
                    class="answer-option"
                    [class.selected]="answerForm.get('selectedOption')?.value === option">
                    <div class="option-content">
                      <div class="option-level">Level {{ i + 1 }}</div>
                      <div class="option-text">{{ getCleanOptionText(option) }}</div>
                    </div>
                  </mat-radio-button>
                </mat-radio-group>
              </form>
            </mat-card-content>

            <mat-card-actions class="question-actions">
              <button 
                mat-outlined-button 
                (click)="goToPrevious()"
                [disabled]="isFirstQuestion"
                class="nav-button prev-button">
                <mat-icon>chevron_left</mat-icon>
                Previous
              </button>

              <div class="action-spacer"></div>

              <button 
                mat-raised-button 
                color="primary"
                (click)="goToNext()"
                [disabled]="!answerForm.get('selectedOption')?.value"
                class="nav-button next-button">
                {{ isLastQuestion ? 'Complete Assessment' : 'Next Question' }}
                <mat-icon>{{ isLastQuestion ? 'check_circle' : 'chevron_right' }}</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>

          <!-- Aligned Help Section -->
          <div class="help-section">
            <div class="help-card">
              <div class="help-content">
                <mat-icon class="help-icon">help_outline</mat-icon>
                <div class="help-text">
                  <h4>Need Help?</h4>
                  <p>
                    Choose the option that most accurately reflects your organization's <strong>current practices</strong>. 
                    If you're between two levels, select the lower one for a more conservative assessment.
                  </p>
                  <p class="tip-section"><strong>Tip:</strong> <span [innerHTML]="formatTip(currentQuestion.tip)"></span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!currentQuestion || isSubmitting">
      <div class="container">
        <div class="loading-content">
          <mat-icon class="loading-icon pulse">psychology</mat-icon>
          <h3 *ngIf="!isSubmitting">Loading Assessment Questions...</h3>
          <h3 *ngIf="isSubmitting">Generating Personalized Recommendations...</h3>
          <p *ngIf="!isSubmitting">Preparing your personalized ODI framework evaluation</p>
          <p *ngIf="isSubmitting">Our AI is analyzing your responses to provide tailored advice</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assessment-container {
      min-height: calc(100vh - 140px);
      padding: var(--nashtech-spacing-md) 0;
    }

    .assessment-content {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-lg);
      max-width: 800px;
      margin: 0 auto;
    }

    /* Compact Progress Header */
    .progress-header {
      padding: var(--nashtech-spacing-md);
      background: var(--nashtech-bg-gradient-subtle);
      border: 1px solid var(--nashtech-primary);
      border-radius: var(--nashtech-radius-md);
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--nashtech-spacing-sm);
      flex-wrap: wrap;
      gap: var(--nashtech-spacing-sm);
    }

    .question-meta {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
    }

    .question-number {
      font-size: 1rem;
      font-weight: 600;
      color: var(--nashtech-primary);
    }

    .question-total {
      font-size: 0.9375rem;
      color: var(--nashtech-text-secondary);
    }

    .theme-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
      padding: var(--nashtech-spacing-xs) var(--nashtech-spacing-sm);
      border-radius: var(--nashtech-radius-full);
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--nashtech-white);
    }

    .saving-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8125rem;
      color: var(--nashtech-text-secondary);
      font-weight: 500;
      margin-left: 8px;
    }

    .saving-badge mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
    }

    .progress-visual {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
    }

    .question-progress {
      flex: 1;
      height: 6px !important;
      border-radius: var(--nashtech-radius-sm) !important;
    }

    .progress-text {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--nashtech-primary);
      min-width: 70px;
      text-align: right;
    }

    /* Compact Question Card */
    .question-card {
      box-shadow: var(--nashtech-shadow-md);
    }

    .question-header {
      display: flex;
      align-items: flex-start;
      gap: var(--nashtech-spacing-md);
      padding: var(--nashtech-spacing-lg) var(--nashtech-spacing-lg) var(--nashtech-spacing-sm);
    }

    .question-icon-wrapper {
      width: 3rem;
      height: 3rem;
      border-radius: var(--nashtech-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--nashtech-shadow-sm);
    }

    .question-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .question-content {
      flex: 1;
    }

    .question-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      line-height: 1.3;
      margin-bottom: var(--nashtech-spacing-xs);
    }

    .question-subtitle {
      font-size: 0.9375rem;
      color: var(--nashtech-text-secondary);
      line-height: 1.4;
    }

    .question-body {
      padding: 0 var(--nashtech-spacing-lg) var(--nashtech-spacing-md);
    }

    /* Compact Maturity Framework */
    .maturity-explanation {
      background: var(--nashtech-bg-secondary);
      border: 1px solid var(--nashtech-border);
      border-radius: var(--nashtech-radius-md);
      padding: var(--nashtech-spacing-sm);
      margin-bottom: var(--nashtech-spacing-lg);
    }

    .maturity-explanation h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
      text-align: center;
    }

    .maturity-levels {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
      flex-wrap: wrap;
      justify-content: center;
    }

    .maturity-level {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 60px;
    }

    .level-number {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: var(--nashtech-primary);
      color: var(--nashtech-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
      margin-bottom: 2px;
    }

    .level-name {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
    }

    .level-arrow {
      color: var(--nashtech-primary);
      font-weight: bold;
      font-size: 0.875rem;
    }

    /* Answer Options */
    .answer-form {
      margin-top: var(--nashtech-spacing-sm);
    }

    .answer-options {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-sm);
    }

    .answer-option {
      background: var(--nashtech-white);
      border: 2px solid var(--nashtech-border);
      border-radius: var(--nashtech-radius-md);
      padding: var(--nashtech-spacing-sm);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      width: 100%;
      position: relative;
    }

    .answer-option:hover {
      border-color: var(--nashtech-primary);
      background: var(--nashtech-bg-accent);
      transform: translateY(-1px);
      box-shadow: var(--nashtech-shadow-sm);
    }

    .answer-option.selected {
      border-color: var(--nashtech-primary);
      background: var(--nashtech-bg-accent);
      box-shadow: var(--nashtech-shadow-sm);
    }

    .option-content {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-xs);
      width: 100%;
    }

    .option-level {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--nashtech-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .option-text {
      font-size: 0.875rem;
      line-height: 1.4;
      color: var(--nashtech-text-primary);
    }

    /* Hide Radio Button */
    ::ng-deep .answer-option .mdc-radio {
      display: none !important;
    }

    ::ng-deep .answer-option .mdc-form-field {
      width: 100%;
    }

    ::ng-deep .answer-option .mdc-form-field > label {
      width: 100%;
      cursor: pointer;
    }

    /* Question Actions */
    .question-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--nashtech-spacing-sm) var(--nashtech-spacing-lg) var(--nashtech-spacing-lg);
      background: var(--nashtech-bg-secondary);
      border-top: 1px solid var(--nashtech-border);
    }

    .nav-button {
      height: 40px;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--nashtech-radius-md);
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
      min-width: 120px;
    }

    .prev-button {
      color: var(--nashtech-text-secondary);
    }

    .action-spacer {
      flex: 1;
    }

    /* Aligned Help Section */
    .help-section {
      margin-top: var(--nashtech-spacing-md);
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .help-card {
      background: var(--nashtech-bg-accent);
      border: 1px solid var(--nashtech-primary);
      border-radius: var(--nashtech-radius-md);
      padding: var(--nashtech-spacing-md);
      border-left: 4px solid var(--nashtech-primary);
    }

    .help-content {
      display: flex;
      align-items: flex-start;
      gap: var(--nashtech-spacing-sm);
    }

    .help-icon {
      color: var(--nashtech-primary);
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .help-text {
      flex: 1;
    }

    .help-text h4 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .help-text p {
      font-size: 0.875rem;
      color: var(--nashtech-text-secondary);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
      line-height: 1.4;
    }

    .help-text p:last-child {
      margin-bottom: 0;
    }

    .tip-section {
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--nashtech-text-secondary);
      margin-top: var(--nashtech-spacing-md);
      margin-bottom: 0;
    }

    /* Loading State */
    .loading-container {
      min-height: 40vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      text-align: center;
      color: var(--nashtech-text-secondary);
    }

    .loading-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      overflow: visible;
      color: var(--nashtech-primary);
      margin-bottom: var(--nashtech-spacing-md);
    }
    
    .loading-icon.pulse {
      animation: thinking 2s infinite ease-in-out;
    }

    @keyframes thinking {
      0% {
        transform: scale(0.95);
        opacity: 0.7;
        text-shadow: 0 0 0 rgba(230, 81, 0, 0);
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
        text-shadow: 0 0 20px rgba(230, 81, 0, 0.4);
      }
      100% {
        transform: scale(0.95);
        opacity: 0.7;
        text-shadow: 0 0 0 rgba(230, 81, 0, 0);
      }
    }

    .loading-content h3 {
      font-size: 1.25rem;
      color: var(--nashtech-text-primary);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .loading-content p {
      font-size: 0.9375rem;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .question-header {
        flex-direction: column;
        text-align: center;
        gap: var(--nashtech-spacing-sm);
        padding: var(--nashtech-spacing-md);
      }

      .question-icon-wrapper {
        width: 2.5rem;
        height: 2.5rem;
      }

      .question-icon {
        font-size: 1.25rem;
      }

      .question-title {
        font-size: 1.125rem;
      }

      .question-body {
        padding: 0 var(--nashtech-spacing-md) var(--nashtech-spacing-sm);
      }

      .progress-info {
        flex-direction: column;
        align-items: stretch;
        gap: var(--nashtech-spacing-xs);
      }

      .maturity-levels {
        flex-direction: column;
        gap: var(--nashtech-spacing-xs);
      }

      .level-arrow {
        transform: rotate(90deg);
      }

      .question-actions {
        flex-direction: column;
        gap: var(--nashtech-spacing-sm);
        padding: var(--nashtech-spacing-sm);
      }

      .nav-button {
        width: 100%;
        justify-content: center;
      }

      .action-spacer {
        display: none;
      }

      .help-content {
        flex-direction: column;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .progress-visual {
        flex-direction: column;
        gap: var(--nashtech-spacing-xs);
      }

      .progress-text {
        text-align: center;
        min-width: auto;
      }

      .answer-option {
        padding: var(--nashtech-spacing-xs);
      }
    }
  `]
})
export class AssessmentComponent implements OnInit {
  currentQuestion: Question | null = null;
  currentQuestionIndex = 1;
  totalQuestions = 0;
  allQuestions: Question[] = [];
  answerForm: FormGroup;
  isSaving$: Observable<boolean>;

  isSubmitting = false;

  get isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 1;
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.totalQuestions;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private assessmentService: AssessmentService
  ) {
    this.answerForm = this.fb.group({
      selectedOption: ['', Validators.required]
    });
    this.isSaving$ = this.assessmentService.isSaving$;
  }

  ngOnInit() {
    this.allQuestions = this.assessmentService.getQuestions();
    this.totalQuestions = this.assessmentService.getTotalQuestions();

    // Determine which question to show
    const currentStep = this.assessmentService.getCurrentStep();
    if (currentStep >= 2 && currentStep <= this.totalQuestions + 1) {
      this.currentQuestionIndex = currentStep - 1;
    } else {
      this.currentQuestionIndex = 1;
      this.assessmentService.setCurrentStep(2);
    }

    this.loadCurrentQuestion();
  }

  private loadCurrentQuestion() {
    this.currentQuestion = this.allQuestions[this.currentQuestionIndex - 1];

    if (this.currentQuestion) {
      // Load existing answer if available
      const existingAnswer = this.assessmentService.getAnswer(this.currentQuestion.id);
      if (existingAnswer) {
        this.answerForm.patchValue({
          selectedOption: existingAnswer.selectedOption
        });
      } else {
        this.answerForm.reset();
      }
    }
  }

  goToPrevious() {
    if (!this.isFirstQuestion) {
      // Save current answer if provided
      this.saveCurrentAnswer();

      this.currentQuestionIndex--;
      this.assessmentService.setCurrentStep(this.currentQuestionIndex + 1);
      this.loadCurrentQuestion();
    }
  }

  goToNext() {
    if (this.answerForm.valid) {
      // Save current answer
      this.saveCurrentAnswer();

      if (this.isLastQuestion) {
        // Complete assessment and go to results
        this.isSubmitting = true;
        this.assessmentService.completeAssessment().then(() => {
          this.router.navigate(['/results']);
        }).catch(error => {
          console.error('Error completing assessment:', error);
          this.isSubmitting = false;
        });
      } else {
        // Go to next question
        this.currentQuestionIndex++;
        // Save new step position
        this.assessmentService.setCurrentStep(this.currentQuestionIndex + 1);
        this.loadCurrentQuestion();
      }
    }
  }

  private saveCurrentAnswer() {
    const selectedOption = this.answerForm.get('selectedOption')?.value;
    if (selectedOption && this.currentQuestion) {
      this.assessmentService.saveAnswer(this.currentQuestion.id, selectedOption);
    }
  }

  getQuestionProgress(): number {
    return Math.round((this.currentQuestionIndex / this.totalQuestions) * 100);
  }

  getThemeTitle(themeId: string): string {
    const themes = this.assessmentService.getThemes();
    const theme = themes.find(t => t.id === themeId);
    return theme?.title || '';
  }

  getThemeIcon(themeId: string): string {
    const themes = this.assessmentService.getThemes();
    const theme = themes.find(t => t.id === themeId);
    return theme?.icon || '';
  }

  getCleanOptionText(option: string): string {
    // Remove the level number prefix (e.g., "1. Initial -") to show just the description
    const match = option.match(/^\d+\. \w+ - (.+)$/);
    return match ? match[1] : option;
  }

  trackByOption(index: number, option: string): string {
    return option;
  }

  formatTip(tip: string | undefined): string {
    if (!tip) return "Focus on what your organization actually does consistently, not what it aspires to do.";

    // Convert Markdown bold to HTML strong
    let formatted = tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert Markdown italic to HTML em
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Split by the level separator pattern
    // The regex captures the punctuation/space to preserve it if needed, or we just reconstruct
    // We want to handle the FIRST occurrence differently (double break) than the rest (single break)

    let parts = formatted.split(/(\.|\?)\s+(?=<strong>[A-Z])/);

    if (parts.length > 1) {
      // parts[0] is the intro text
      // parts[1] is the punctuation (. or ?)
      // parts[2] is the rest starting after the whitespace
      // Wait, split keeps capturing groups. 

      // Let's use a simpler replacement loop or callback to count replacements
      let replaceCount = 0;
      formatted = formatted.replace(/(\.|\?)\s+(<strong>[A-Z])/g, (match, p1, p2) => {
        replaceCount++;
        // First match gets double break (gap), subsequent matches get single break
        const separator = replaceCount === 1 ? '<br><br>' : '<br>';
        return `${p1}${separator}${p2}`;
      });
    }

    return formatted;
  }
}
