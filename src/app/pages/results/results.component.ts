import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentResult, AssessmentData, UserDetails } from '../../models/assessment.model';
declare var XLSX: any;

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="results-container" *ngIf="results && assessmentData">
      <div class="container">
        <div class="results-content fade-in">
          <!-- Compact Results Header -->
          <div class="results-header">
            <div class="completion-badge gradient-bg">
              <mat-icon class="completion-icon">check_circle</mat-icon>
              <h1 class="results-title">Assessment Complete!</h1>
              <p class="results-subtitle">
                Your NashTech Open Data Maturity Assessment is ready
              </p>
            </div>
          </div>

          <!-- Compact Overall Score Card -->
          <mat-card class="score-card card-nashtech-gradient">
            <mat-card-content>
              <div class="score-content">
                <div class="score-visual">
                  <div class="score-circle">
                    <div class="score-number">{{ getScorePercentage() }}%</div>
                    <div class="score-label">Overall Score</div>
                  </div>
                </div>
                <div class="score-info">
                  <div class="maturity-level">
                    <div class="level-badge">
                      {{ results.maturityLevel }} Level
                    </div>
                    <h3 class="level-title">{{ getLevelDescription() }}</h3>
                    <p class="level-description">{{ getLevelExplanation() }}</p>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Compact ODI Framework -->
          <mat-card class="framework-card card-nashtech">
            <mat-card-header>
              <div class="framework-header">
                <mat-icon class="framework-icon">school</mat-icon>
                <div>
                  <mat-card-title>ODI Maturity Framework</mat-card-title>
                  <mat-card-subtitle>Your position on the official 5-level scale</mat-card-subtitle>
                </div>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="framework-scale">
                <div class="scale-item" [class.current-level]="results.maturityLevel === 'Beginner'">
                  <div class="scale-number">1</div>
                  <div class="scale-name">Initial</div>
                </div>
                <div class="scale-connector"></div>
                <div class="scale-item" [class.current-level]="results.maturityLevel === 'Developing'">
                  <div class="scale-number">2</div>
                  <div class="scale-name">Repeatable</div>
                </div>
                <div class="scale-connector"></div>
                <div class="scale-item" [class.current-level]="results.maturityLevel === 'Advanced'">
                  <div class="scale-number">3</div>
                  <div class="scale-name">Defined</div>
                </div>
                <div class="scale-connector"></div>
                <div class="scale-item" [class.current-level]="results.maturityLevel === 'Leading'">
                  <div class="scale-number">4</div>
                  <div class="scale-name">Managed</div>
                </div>
                <div class="scale-connector"></div>
                <div class="scale-item" [class.current-level]="results.maturityLevel === 'Optimizing'">
                  <div class="scale-number">5</div>
                  <div class="scale-name">Optimising</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Compact Theme Breakdown -->
          <mat-card class="themes-card card-nashtech">
            <mat-card-header>
              <mat-card-title>Theme Performance Analysis</mat-card-title>
              <mat-card-subtitle>Your scores across the 5 ODI assessment themes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="themes-grid">
                <div 
                  *ngFor="let theme of getThemesWithScores(); trackBy: trackByThemeId"
                  class="theme-result-item">
                  <div class="theme-header">
                    <div class="theme-icon-wrapper" [ngClass]="'theme-' + theme.id">
                      <span class="theme-icon">{{ theme.icon }}</span>
                    </div>
                    <div class="theme-meta">
                      <h4 class="theme-name">{{ theme.title }}</h4>
                      <div class="theme-score-display">
                        <span class="score-number">{{ getThemeScorePercentage(theme.id) }}%</span>
                        <span class="score-level">({{ getThemeLevel(theme.id) }})</span>
                      </div>
                    </div>
                  </div>
                  <div class="theme-progress-container">
                    <mat-progress-bar 
                      mode="determinate" 
                      [value]="getThemeScorePercentage(theme.id)"
                      class="theme-progress">
                    </mat-progress-bar>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Compact Recommendations -->
          <mat-card class="recommendations-card card-nashtech">
            <mat-card-header>
              <div class="recommendations-header">
                <mat-icon class="recommendations-icon">lightbulb</mat-icon>
                <div>
                  <mat-card-title>NashTech Accelerator Recommendations</mat-card-title>
                  <mat-card-subtitle>Key steps to accelerate your open data maturity</mat-card-subtitle>
                </div>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="recommendations-list">
                <div 
                  *ngFor="let recommendation of results.recommendations.slice(0, 3); let i = index"
                  class="recommendation-item">
                  <div class="recommendation-number gradient-bg">{{ i + 1 }}</div>
                  <div class="recommendation-content">
                    <p>{{ recommendation }}</p>
                  </div>
                </div>
              </div>
              <div class="accelerator-cta">
                <p>Ready to accelerate your progress? <strong>NashTech Accelerators</strong> can help you implement these recommendations faster.</p>
                <button mat-raised-button color="primary" class="cta-button" (click)="visitAccelerators()">
                  <mat-icon>rocket_launch</mat-icon>
                  Explore Accelerators
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Compact Summary -->
          <mat-card class="summary-card card-nashtech-accent">
            <mat-card-header>
              <mat-card-title>Assessment Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="summary-grid">
                <div class="summary-item">
                  <mat-icon class="summary-icon">person</mat-icon>
                  <div class="summary-info">
                    <div class="summary-label">Participant</div>
                    <div class="summary-value">{{ assessmentData.userDetails?.fullName }}</div>
                  </div>
                </div>
                <div class="summary-item">
                  <mat-icon class="summary-icon">business</mat-icon>
                  <div class="summary-info">
                    <div class="summary-label">Organization</div>
                    <div class="summary-value">{{ assessmentData.userDetails?.organization }}</div>
                  </div>
                </div>
                <div class="summary-item">
                  <mat-icon class="summary-icon">schedule</mat-icon>
                  <div class="summary-info">
                    <div class="summary-label">Duration</div>
                    <div class="summary-value">{{ getCompletionTime() }}</div>
                  </div>
                </div>
                <div class="summary-item">
                  <mat-icon class="summary-icon">quiz</mat-icon>
                  <div class="summary-info">
                    <div class="summary-label">Questions</div>
                    <div class="summary-value">{{ assessmentData.answers.length }}/{{ totalQuestions }}</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Action Buttons -->
          <div class="results-actions">
            <button 
              mat-raised-button 
              color="primary"
              (click)="downloadExcelReport()"
              class="action-button primary-action">
              <mat-icon>file_download</mat-icon>
              Download Excel Report
            </button>

            <button 
              mat-outlined-button
              (click)="shareResults()"
              class="action-button">
              <mat-icon>share</mat-icon>
              Share Results
            </button>

            <button 
              mat-outlined-button
              (click)="retakeAssessment()"
              class="action-button">
              <mat-icon>refresh</mat-icon>
              Retake Assessment
            </button>
          </div>

          <!-- Compact Next Steps -->
          <mat-card class="next-steps-card card-nashtech-gradient">
            <mat-card-content>
              <div class="next-steps-content">
                <mat-icon class="next-steps-icon">trending_up</mat-icon>
                <div class="next-steps-text">
                  <h3>What's Next?</h3>
                  <p>
                    Partner with NashTech to accelerate your digital transformation using our proven 
                    accelerator platform and expertise.
                  </p>
                  <div class="contact-links">
                    <a href="https://accelerator.nashtechglobal.com" target="_blank" rel="noopener" class="contact-link">
                      <mat-icon>launch</mat-icon>
                      NashTech Accelerators
                    </a>
                    <a href="https://nashtech.com" target="_blank" rel="noopener" class="contact-link">
                      <mat-icon>business</mat-icon>
                      About NashTech
                    </a>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!results || !assessmentData">
      <div class="container">
        <div class="loading-content">
          <mat-icon class="loading-icon pulse">analytics</mat-icon>
          <h3>Analyzing Your Results...</h3>
          <p>Processing responses using the official ODI framework</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      min-height: calc(100vh - 140px);
      padding: var(--nashtech-spacing-md) 0;
    }

    .results-content {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-lg);
      max-width: 900px;
      margin: 0 auto;
    }

    /* Compact Results Header */
    .results-header {
      text-align: center;
      margin-bottom: var(--nashtech-spacing-md);
    }

    .completion-badge {
      padding: var(--nashtech-spacing-lg);
      border-radius: var(--nashtech-radius-lg);
      color: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-lg);
      position: relative;
      overflow: hidden;
    }

    .completion-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
      pointer-events: none;
    }

    .completion-icon {
      font-size: 2.5rem;
      margin-bottom: var(--nashtech-spacing-sm);
    }

    .results-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .results-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
    }

    /* Compact Score Card */
    .score-card {
      border: none;
      box-shadow: var(--nashtech-shadow-lg);
      position: relative;
      overflow: hidden;
    }

    .score-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .score-content {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xl);
      padding: var(--nashtech-spacing-lg);
    }

    .score-visual {
      flex-shrink: 0;
    }

    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--nashtech-white);
      box-shadow: inset 0 4px 8px rgba(255, 255, 255, 0.1);
    }

    .score-number {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
    }

    .score-label {
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.9;
      margin-top: var(--nashtech-spacing-xs);
    }

    .score-info {
      flex: 1;
    }

    .maturity-level {
      text-align: left;
    }

    .level-badge {
      display: inline-block;
      padding: var(--nashtech-spacing-xs) var(--nashtech-spacing-md);
      border-radius: var(--nashtech-radius-full);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--nashtech-spacing-sm);
      background: rgba(255, 255, 255, 0.2);
      color: var(--nashtech-white);
    }

    .level-title {
      font-size: 1.375rem;
      font-weight: 600;
      color: var(--nashtech-white);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .level-description {
      font-size: 0.9375rem;
      color: var(--nashtech-white);
      opacity: 0.9;
      margin: 0;
      line-height: 1.5;
    }

    /* Framework Card */
    .framework-card .framework-header {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
    }

    .framework-icon {
      color: var(--nashtech-primary);
      font-size: 1.5rem;
    }

    .framework-scale {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--nashtech-spacing-sm);
      padding: var(--nashtech-spacing-md) 0;
    }

    .scale-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 70px;
      transition: all 0.3s ease;
    }

    .scale-item.current-level {
      transform: scale(1.1);
    }

    .scale-number {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--nashtech-gray-300);
      color: var(--nashtech-gray-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9375rem;
      margin-bottom: var(--nashtech-spacing-xs);
      transition: all 0.3s ease;
    }

    .scale-item.current-level .scale-number {
      background: var(--nashtech-bg-gradient);
      color: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-sm);
    }

    .scale-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
    }

    .scale-connector {
      width: 1.5rem;
      height: 2px;
      background: var(--nashtech-gray-300);
      flex-shrink: 0;
    }

    /* Compact Themes Grid */
    .themes-grid {
      display: grid;
      gap: var(--nashtech-spacing-md);
    }

    .theme-result-item {
      padding: var(--nashtech-spacing-md);
      background: var(--nashtech-bg-secondary);
      border-radius: var(--nashtech-radius-md);
      border: 1px solid var(--nashtech-border);
      transition: all 0.3s ease;
    }

    .theme-result-item:hover {
      background: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-sm);
    }

    .theme-header {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
      margin-bottom: var(--nashtech-spacing-sm);
    }

    .theme-icon-wrapper {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--nashtech-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--nashtech-shadow-sm);
    }

    .theme-icon {
      font-size: 1.25rem;
    }

    .theme-meta {
      flex: 1;
    }

    .theme-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .theme-score-display {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
    }

    .score-number {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--nashtech-primary);
    }

    .score-level {
      font-size: 0.8125rem;
      color: var(--nashtech-text-muted);
      font-weight: 500;
    }

    .theme-progress-container {
      margin-bottom: var(--nashtech-spacing-xs);
    }

    .theme-progress {
      height: 6px !important;
      border-radius: var(--nashtech-radius-sm) !important;
    }

    /* Compact Recommendations */
    .recommendations-header {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
    }

    .recommendations-icon {
      color: var(--nashtech-secondary);
      font-size: 1.5rem;
    }

    .recommendations-list {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-sm);
      margin-bottom: var(--nashtech-spacing-lg);
    }

    .recommendation-item {
      display: flex;
      align-items: flex-start;
      gap: var(--nashtech-spacing-sm);
    }

    .recommendation-number {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      color: var(--nashtech-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .recommendation-content p {
      margin: 0;
      line-height: 1.5;
      color: var(--nashtech-text-primary);
      font-size: 0.9375rem;
    }

    .accelerator-cta {
      background: var(--nashtech-bg-gradient-subtle);
      border: 1px solid var(--nashtech-primary);
      border-radius: var(--nashtech-radius-md);
      padding: var(--nashtech-spacing-md);
      text-align: center;
    }

    .accelerator-cta p {
      font-size: 0.9375rem;
      color: var(--nashtech-text-secondary);
      margin: 0 0 var(--nashtech-spacing-sm) 0;
      line-height: 1.5;
    }

    .cta-button {
      min-width: 180px;
      height: 40px;
      font-size: 0.9375rem;
      font-weight: 500;
    }

    /* Compact Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--nashtech-spacing-sm);
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
      padding: var(--nashtech-spacing-sm);
      background: var(--nashtech-white);
      border-radius: var(--nashtech-radius-md);
      border: 1px solid var(--nashtech-border);
    }

    .summary-icon {
      color: var(--nashtech-primary);
      font-size: 1.25rem;
    }

    .summary-info {
      flex: 1;
    }

    .summary-label {
      font-size: 0.8125rem;
      color: var(--nashtech-text-muted);
      font-weight: 500;
    }

    .summary-value {
      font-size: 0.9375rem;
      color: var(--nashtech-text-primary);
      font-weight: 600;
      margin-top: 2px;
    }

    /* Action Buttons */
    .results-actions {
      display: flex;
      gap: var(--nashtech-spacing-sm);
      justify-content: center;
      flex-wrap: wrap;
      padding: var(--nashtech-spacing-md) 0;
    }

    .action-button {
      min-width: 160px;
      height: 40px;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--nashtech-radius-md);
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
    }

    .primary-action {
      box-shadow: var(--nashtech-shadow-md);
    }

    /* Compact Next Steps */
    .next-steps-card {
      border: none;
      box-shadow: var(--nashtech-shadow-md);
    }

    .next-steps-content {
      display: flex;
      align-items: flex-start;
      gap: var(--nashtech-spacing-md);
      padding: var(--nashtech-spacing-md);
    }

    .next-steps-icon {
      color: var(--nashtech-white);
      font-size: 2rem;
      flex-shrink: 0;
    }

    .next-steps-text {
      flex: 1;
    }

    .next-steps-text h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--nashtech-white);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .next-steps-text p {
      color: var(--nashtech-white);
      opacity: 0.9;
      line-height: 1.5;
      margin: 0 0 var(--nashtech-spacing-sm) 0;
      font-size: 0.9375rem;
    }

    .contact-links {
      display: flex;
      gap: var(--nashtech-spacing-sm);
      flex-wrap: wrap;
    }

    .contact-link {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
      color: var(--nashtech-white);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      padding: var(--nashtech-spacing-xs) var(--nashtech-spacing-sm);
      border-radius: var(--nashtech-radius-md);
      background: rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .contact-link:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
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
      font-size: 3rem;
      color: var(--nashtech-primary);
      margin-bottom: var(--nashtech-spacing-md);
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
      .results-title {
        font-size: 1.625rem;
      }

      .score-content {
        flex-direction: column;
        text-align: center;
        gap: var(--nashtech-spacing-lg);
      }

      .score-circle {
        width: 100px;
        height: 100px;
      }

      .score-number {
        font-size: 1.75rem;
      }

      .maturity-level {
        text-align: center;
      }

      .framework-scale {
        flex-direction: column;
        gap: var(--nashtech-spacing-sm);
      }

      .scale-connector {
        width: 2px;
        height: 1rem;
        transform: rotate(90deg);
      }

      .theme-header {
        flex-direction: column;
        text-align: center;
        gap: var(--nashtech-spacing-xs);
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }

      .results-actions {
        flex-direction: column;
        align-items: center;
      }

      .action-button {
        width: 100%;
        max-width: 250px;
      }

      .next-steps-content {
        flex-direction: column;
        text-align: center;
        gap: var(--nashtech-spacing-sm);
      }

      .contact-links {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .completion-icon {
        font-size: 2rem;
      }

      .results-title {
        font-size: 1.5rem;
      }

      .results-subtitle {
        font-size: 0.9375rem;
      }

      .score-circle {
        width: 90px;
        height: 90px;
      }

      .score-number {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  results: AssessmentResult | null = null;
  assessmentData: AssessmentData | null = null;
  totalQuestions = 0;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService
  ) {}

  ngOnInit() {
    this.totalQuestions = this.assessmentService.getTotalQuestions();

    // Load XLSX library dynamically
    this.loadXLSXLibrary().then(() => {
      console.log('XLSX library loaded successfully');
    }).catch(error => {
      console.warn('Could not load XLSX library:', error);
    });

    this.assessmentService.assessmentData$.subscribe(data => {
      this.assessmentData = data;

      // Calculate results if assessment is complete
      if (data.answers.length === this.totalQuestions) {
        this.results = this.assessmentService.completeAssessment();
      } else {
        // Redirect back to assessment if not complete
        this.router.navigate(['/assessment']);
      }
    });
  }

  private async loadXLSXLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof XLSX !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load XLSX library'));
      document.head.appendChild(script);
    });
  }

  getScorePercentage(): number {
    if (!this.results) return 0;
    return Math.round((this.results.overallScore / 5) * 100);
  }

  getLevelDescription(): string {
    if (!this.results) return '';

    const descriptions = {
      'Beginner': 'Initial Level',
      'Developing': 'Repeatable Level', 
      'Advanced': 'Defined Level',
      'Leading': 'Managed Level',
      'Optimizing': 'Optimising Level'
    };

    return descriptions[this.results.maturityLevel] || '';
  }

  getLevelExplanation(): string {
    if (!this.results) return '';

    const explanations = {
      'Beginner': 'Your organization is at the Initial level. NashTech Accelerators can help establish foundational processes quickly.',
      'Developing': 'Your organization shows Repeatable practices. Our accelerator templates can standardize your approach.',
      'Advanced': 'Your organization has Defined processes. NashTech can help optimize and scale these practices.',
      'Leading': 'Your organization demonstrates Managed practices. Let us help you drive innovation.',
      'Optimizing': 'Your organization exemplifies the Optimising level. Partner with NashTech to lead transformation.'
    };

    return explanations[this.results.maturityLevel] || '';
  }

  getThemesWithScores() {
    const themes = this.assessmentService.getThemes();
    return themes.map(theme => ({
      ...theme,
      score: this.results?.themeScores[theme.id] || 0
    }));
  }

  getThemeScorePercentage(themeId: string): number {
    if (!this.results) return 0;
    const score = this.results.themeScores[themeId] || 0;
    return Math.round((score / 5) * 100);
  }

  getThemeLevel(themeId: string): string {
    if (!this.results) return '';

    const score = this.results.themeScores[themeId] || 0;

    if (score >= 4.5) return 'Optimising';
    if (score >= 3.5) return 'Managed';
    if (score >= 2.5) return 'Defined';
    if (score >= 1.5) return 'Repeatable';
    return 'Initial';
  }

  getCompletionTime(): string {
    if (!this.assessmentData?.startTime || !this.assessmentData?.endTime) {
      return 'N/A';
    }

    const duration = this.assessmentData.endTime.getTime() - this.assessmentData.startTime.getTime();
    const minutes = Math.round(duration / (1000 * 60));

    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} min`;
  }

  async downloadExcelReport() {
    if (!this.results || !this.assessmentData) return;

    try {
      if (typeof XLSX === 'undefined') {
        alert('Excel export feature is loading. Please try again in a moment.');
        await this.loadXLSXLibrary();
      }

      const workbook = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ['NashTech Open Data Maturity Assessment Report'],
        ['Generated:', new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()],
        [],
        ['PARTICIPANT INFORMATION'],
        ['Name:', this.assessmentData.userDetails?.fullName || 'N/A'],
        ['Organization:', this.assessmentData.userDetails?.organization || 'N/A'],
        ['Email:', this.assessmentData.userDetails?.emailAddress || 'N/A'],
        ['Phone:', this.assessmentData.userDetails?.phoneNumber || 'N/A'],
        [],
        ['OVERALL RESULTS'],
        ['Overall Score:', `${this.getScorePercentage()}% (${this.results.overallScore.toFixed(1)}/5.0)`],
        ['Maturity Level:', `${this.results.maturityLevel} (${this.getLevelDescription()})`],
        ['Assessment Duration:', this.getCompletionTime()],
        ['Questions Completed:', `${this.assessmentData.answers.length}/${this.totalQuestions}`],
        [],
        ['THEME SCORES'],
        ['Theme', 'Score (%)', 'Level', 'Score (1-5)']
      ];

      // Add theme scores
      this.getThemesWithScores().forEach(theme => {
        summaryData.push([
          theme.title,
          `${this.getThemeScorePercentage(theme.id)}%`,
          this.getThemeLevel(theme.id),
          (this.results?.themeScores[theme.id] || 0).toFixed(1)
        ]);
      });

      // Add recommendations
      summaryData.push([]);
      summaryData.push(['RECOMMENDATIONS']);
      this.results.recommendations.forEach((rec, i) => {
        summaryData.push([`${i + 1}.`, rec]);
      });

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Detailed Responses Sheet
      const responsesData = [
        ['Question ID', 'Theme', 'Question', 'Selected Answer', 'Score (1-5)']
      ];

      const questions = this.assessmentService.getQuestions();
      this.assessmentData.answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (question) {
          responsesData.push([
            question.id.toString(),
            question.theme.replace('-', ' ').toUpperCase(),
            question.question,
            answer.selectedOption,
            answer.score.toString()
          ]);
        }
      });

      const responsesSheet = XLSX.utils.aoa_to_sheet(responsesData);
      XLSX.utils.book_append_sheet(workbook, responsesSheet, 'Detailed Responses');

      // Theme Analysis Sheet
      const themeData = [
        ['Theme Analysis', '', '', ''],
        ['Theme', 'Questions Count', 'Average Score', 'Maturity Level']
      ];

      this.getThemesWithScores().forEach(theme => {
        const themeQuestions = questions.filter(q => q.theme === theme.id);
        themeData.push([
          theme.title,
          themeQuestions.length.toString(),
          (this.results?.themeScores[theme.id] || 0).toFixed(2),
          this.getThemeLevel(theme.id)
        ]);
      });

      const themeSheet = XLSX.utils.aoa_to_sheet(themeData);
      XLSX.utils.book_append_sheet(workbook, themeSheet, 'Theme Analysis');

      // Generate and download file
      const fileName = `NashTech-OpenData-Assessment-${this.assessmentData.userDetails?.organization?.replace(/[^a-zA-Z0-9]/g, '') || 'Report'}-${Date.now()}.xlsx`;
      XLSX.writeFile(workbook, fileName);

    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to generate Excel report. Please try again.');
    }
  }

  shareResults() {
    const shareData = {
      title: 'NashTech Open Data Maturity Assessment Results',
      text: `I completed the NashTech Open Data Assessment using the official ODI framework and scored ${this.getScorePercentage()}% (${this.results?.maturityLevel} level)! Powered by NashTech Accelerators.`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Results link copied to clipboard!');
    }
  }

  retakeAssessment() {
    if (confirm('Are you sure you want to retake the assessment? This will reset all your current answers.')) {
      this.assessmentService.resetAssessment();
      this.router.navigate(['/user-details']);
    }
  }

  visitAccelerators() {
    window.open('https://accelerator.nashtechglobal.com', '_blank');
  }

  trackByThemeId(index: number, theme: any): string {
    return theme.id;
  }
}
