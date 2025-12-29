import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentResult, AssessmentData } from '../../models/assessment.model';
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
                Your NashTech Open Data Maturity Assessment Results
              </p>
            </div>
          </div>

          <!-- Overall Score Card -->
          <mat-card class="score-card card-nashtech-gradient">
            <mat-card-content>
              <div class="score-content">
                <div class="score-visual">
                  <div class="score-circle">
                    <div class="score-number">{{ getOverAllScore() }}</div>
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

          <!-- Theme Performance Breakdown -->
          <mat-card class="themes-card card-nashtech">
            <mat-card-header>
              <mat-card-title>Theme Performance Analysis</mat-card-title>
              <mat-card-subtitle>Your scores across the 5 ODI assessment themes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="themes-grid">
                <div *ngIf="themePerformance.length === 0" class="no-data-message">
                  No theme data available.
                </div>
                <div 
                  *ngFor="let item of themePerformance; trackBy: trackByThemeId"
                  class="theme-result-item">
                  <div class="theme-header">
                    <div class="theme-icon-wrapper" [ngClass]="'theme-' + item.id">
                      <span class="theme-icon">{{ item.icon }}</span>
                    </div>
                    <div class="theme-meta">
                      <h4 class="theme-name">{{ item.title }}</h4>
                      <div class="theme-score-display">
                        <span class="score-percentage">{{ item.percentage }}%</span>
                        <span class="score-value">({{ item.formattedScore }}/5.0)</span>
                      </div>
                    </div>
                  </div>
                  <div class="theme-progress-container">
                    <mat-progress-bar 
                      mode="determinate" 
                      [value]="item.percentage"
                      class="theme-progress">
                    </mat-progress-bar>
                  </div>
                  <div class="theme-level-label">
                    <span class="level-badge-small">{{ item.level }}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Recommendations Card -->
          <mat-card class="recommendations-card card-nashtech">
            <mat-card-header>
              <div class="recommendations-header">
                <mat-icon class="recommendations-icon">lightbulb</mat-icon>
                <div>
                  <mat-card-title>Recommendations</mat-card-title>
                  <mat-card-subtitle>Personalized actions to improve your open data maturity</mat-card-subtitle>
                </div>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div class="recommendations-list">
                <div 
                  *ngFor="let recommendation of results.recommendations; let i = index" 
                  class="recommendation-item">
                  <div class="recommendation-number">{{ i + 1 }}</div>
                  <div class="recommendation-text">{{ recommendation }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>


          <!-- Assessment Summary -->
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
                    <div class="summary-label">Questions Completed</div>
                    <div class="summary-value">{{ assessmentData.answers.length }}/47</div>
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
              (click)="downloadPdfReport()"
              class="action-button primary-action">
              <mat-icon>picture_as_pdf</mat-icon>
              Download PDF Report
            </button>

            <button 
              mat-outlined-button
              (click)="visitAccelerators()"
              class="action-button">
              <mat-icon>rocket_launch</mat-icon>
              NashTech Accelerators
            </button>
          </div>

          <!-- Next Steps -->
          <mat-card class="next-steps-card card-nashtech-gradient">
            <mat-card-content>
              <div class="next-steps-content">
                <mat-icon class="next-steps-icon">trending_up</mat-icon>
                <div class="next-steps-text">
                  <h3>What's Next?</h3>
                  <p>
                    Partner with NashTech to accelerate your digital transformation using our proven 
                    expertise.
                  </p>
                  <div class="contact-note">
                    <span>Auto-redirect in {{ countdown }} second{{ countdown !== 1 ? 's' : '' }}</span>
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
          <h3>Calculating Your Results...</h3>
          <p>Processing your responses using the official ODI framework</p>
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

    /* Results Header */
    .results-header {
      text-align: center;
      margin-bottom: var(--nashtech-spacing-md);
    }

    .completion-badge {
      padding: var(--nashtech-spacing-xl);
      border-radius: var(--nashtech-radius-lg);
      color: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-lg);
      position: relative;
      overflow: visible;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--nashtech-spacing-md);
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
      z-index: 0;
    }

    .completion-icon {
      font-size: 80px !important;
      width: 80px !important;
      height: 80px !important;
      color: var(--nashtech-white) !important;
      position: relative !important;
      z-index: 1 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-bottom: var(--nashtech-spacing-sm) !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) !important;
      animation: pulse 2s ease-in-out infinite !important;
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

    /* Score Card */
    .score-card {
      border: none;
      box-shadow: var(--nashtech-shadow-lg);
      position: relative;
      overflow: hidden;
    }

    .score-content {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xl);
      padding: var(--nashtech-spacing-lg);
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
      flex-shrink: 0;
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

        /* Recommendations Card */
    .recommendations-card {
      border: none;
      box-shadow: var(--nashtech-shadow-md);
    }

    .recommendations-header {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
    }

    .recommendations-icon {
      color: var(--nashtech-primary);
      font-size: 1.5rem;
    }

    .recommendations-list {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-md);
    }

    .recommendation-item {
      display: flex;
      align-items: flex-start;
      gap: var(--nashtech-spacing-md);
      padding: var(--nashtech-spacing-md);
      background: var(--nashtech-bg-secondary);
      border-radius: var(--nashtech-radius-md);
      border-left: 3px solid var(--nashtech-primary);
      transition: all 0.3s ease;
    }

    .recommendation-item:hover {
      background: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-sm);
      transform: translateX(4px);
    }

    .recommendation-number {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--nashtech-primary);
      color: var(--nashtech-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9375rem;
      flex-shrink: 0;
    }

    .recommendation-text {
      flex: 1;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--nashtech-text-primary);
    }

    @media (max-width: 768px) {
      .recommendation-item {
        flex-direction: column;
        text-align: center;
        gap: var(--nashtech-spacing-sm);
      }

      .recommendation-number {
        margin: 0 auto;
      }
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

    /* Framework Scale */
    .framework-header {
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
      padding: var(--nashtech-spacing-xs);
    }

    .scale-item.current-level {
      transform: scale(1.15);
      background: var(--nashtech-bg-accent);
      border-radius: var(--nashtech-radius-md);
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
      font-size: 1.125rem;
    }

    .scale-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin-bottom: 2px;
    }

    .scale-desc {
      font-size: 0.6875rem;
      color: var(--nashtech-text-secondary);
    }

    .scale-connector {
      width: 1.5rem;
      height: 2px;
      background: var(--nashtech-gray-300);
      flex-shrink: 0;
    }

    /* Theme Results Grid */
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
      transform: translateY(-1px);
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

    .score-percentage {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--nashtech-primary);
    }

    .score-value {
      font-size: 0.875rem;
      color: var(--nashtech-text-muted);
      font-weight: 500;
    }

    .theme-progress-container {
      margin-bottom: var(--nashtech-spacing-sm);
    }

    .theme-progress {
      height: 6px !important;
      border-radius: var(--nashtech-radius-sm) !important;
    }

    .level-badge-small {
      display: inline-block;
      padding: 2px var(--nashtech-spacing-xs);
      border-radius: var(--nashtech-radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--nashtech-primary);
      color: var(--nashtech-white);
    }

    /* Summary Grid */
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

    /* Next Steps Card */
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

    .contact-note {
      font-size: 0.875rem;
      color: var(--nashtech-white);
      opacity: 0.8;
      font-style: italic;
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

      .framework-scale {
        flex-direction: column;
        gap: var(--nashtech-spacing-sm);
      }

      .scale-connector {
        width: 2px;
        height: 1rem;
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
    }
  `]
})
export class ResultsComponent implements OnInit, OnDestroy {
  results: AssessmentResult | null = null;
  assessmentData: AssessmentData | null = null;
  themePerformance: any[] = [];
  countdown = 1000;
  private countdownInterval?: any;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit() {
    // Load XLSX library
    this.loadXLSXLibrary();

    this.assessmentService.assessmentData$.subscribe(data => {
      this.assessmentData = data;

      if (data.results) {
        this.results = data.results;
        this.prepareThemePerformance();
        this.startCountdown();
      } else if (data.answers.length === 47) {
        // If we have answers but no results, it means completeAssessment wasn't called or finished.
        // Redirect back to assessment to finish submission
        this.router.navigate(['/assessment']);
      } else {
        this.router.navigate(['/assessment']);
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private async loadXLSXLibrary(): Promise<void> {
    if (typeof XLSX !== 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    document.head.appendChild(script);
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.visitAccelerators();
      }
    }, 1000);
  }

  getOverAllScore(): number {
    if (!this.results) return 0;
    return parseFloat(this.results.overallScore.toFixed(2));
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
      'Beginner': 'Your organization is at the Initial level. Focus on establishing foundational processes.',
      'Developing': 'Your organization shows Repeatable practices. Work on standardizing approaches.',
      'Advanced': 'Your organization has Defined processes. Continue optimizing and scaling.',
      'Leading': 'Your organization demonstrates Managed practices. Drive innovation forward.',
      'Optimizing': 'Your organization exemplifies the Optimising level. Lead industry transformation.'
    };
    return explanations[this.results.maturityLevel] || '';
  }

  prepareThemePerformance() {
    console.log('Preparing theme performance data...');
    const themes = this.assessmentService.getThemes();
    console.log('Themes retrieved:', themes);

    if (themes && themes.length > 0) {
      let themeScores = this.results?.themeScores;

      // Fallback: Recalculate if missing or empty
      if ((!themeScores || Object.keys(themeScores).length === 0) && this.assessmentData?.answers) {
        console.warn('Theme scores missing in results, recalculating from answers...');
        try {
          themeScores = this.assessmentService.calculateThemeScores(this.assessmentData.answers);
          console.log('Recalculated theme scores:', themeScores);
        } catch (e) {
          console.error('Failed to recalculate theme scores:', e);
        }
      }

      this.themePerformance = themes.map(theme => {
        const score = themeScores ? themeScores[theme.id] : 0;
        return {
          ...theme,
          score: score || 0,
          percentage: Math.round(((score || 0) / 5) * 100),
          level: this.getThemeLevel(theme.id),
          formattedScore: (score || 0).toFixed(1)
        };
      });
      console.log('Mapped theme performance:', this.themePerformance);
    } else {
      console.warn('No themes found in service!');
      this.themePerformance = [];
    }
  }

  getThemeScorePercentage(themeId: string): number {
    if (!this.results) return 0;
    const score = this.results.themeScores[themeId] || 0;
    return Math.round((score / 5) * 100);
  }

  getThemeScore(themeId: string): string {
    if (!this.results) return '0.0';
    return (this.results.themeScores[themeId] || 0).toFixed(1);
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
    return `${minutes} min`;
  }

  async downloadExcelReport() {
    if (!this.results || !this.assessmentData) return;

    try {
      if (typeof XLSX === 'undefined') {
        alert('Excel export loading. Please try again.');
        return;
      }

      const workbook = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        ['NashTech Open Data Maturity Assessment Report'],
        ['Generated:', new Date().toLocaleDateString()],
        [],
        ['PARTICIPANT'],
        ['Name:', this.assessmentData.userDetails?.fullName || 'N/A'],
        ['Organization:', this.assessmentData.userDetails?.organization || 'N/A'],
        [],
        ['RESULTS'],
        ['Overall Score:', `${this.getOverAllScore()} (${this.results.overallScore.toFixed(2)}/5.0)`],
        ['Maturity Level:', `${this.results.maturityLevel} (${this.getLevelDescription()})`],
        [],
        ['THEME SCORES'],
        ['Theme', 'Score (%)', 'Level', 'Score (1-5)']
      ];

      this.themePerformance.forEach(item => {
        summaryData.push([
          item.title,
          `${item.percentage}%`,
          item.level,
          item.formattedScore
        ]);
      });

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      const fileName = `ODI-Assessment-${this.assessmentData.userDetails?.organization?.replace(/[^a-zA-Z0-9]/g, '') || 'Report'}-${Date.now()}.xlsx`;
      XLSX.writeFile(workbook, fileName);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate report. Please try again.');
    }
  }

  async downloadPdfReport() {
    if (!this.results || !this.assessmentData) return;

    try {
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Header
      doc.setFillColor(230, 81, 0); // NashTech Orange
      doc.rect(0, 0, pageWidth, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text('NashTech Open Data Maturity Assessment', 14, 13);

      // User Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text('Assessment Report', 14, 30);

      doc.setFontSize(10);
      doc.text(`Participant: ${this.assessmentData.userDetails?.fullName || 'N/A'}`, 14, 40);
      doc.text(`Organization: ${this.assessmentData.userDetails?.organization || 'N/A'}`, 14, 45);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 50);

      // Results Summary
      doc.setFontSize(12);
      doc.text('Results Summary', 14, 65);

      doc.setFontSize(10);
      doc.text(`Overall Score: ${this.getOverAllScore()} / 5.0`, 14, 75);
      doc.text(`Maturity Level: ${this.results.maturityLevel}`, 14, 80);

      // Theme Scores
      let yPos = 90;
      this.themePerformance.forEach(item => {
        doc.text(`${item.title}: ${item.formattedScore} (${item.percentage}%)`, 14, yPos);
        yPos += 5;
      });

      // Questions & Answers Table
      const tableData = this.assessmentData.answers.map(answer => {
        const question = this.assessmentService.getQuestions().find(q => q.id === answer.questionId);
        return [
          question?.theme || '',
          question?.question || '',
          answer.selectedOption,
          answer.score.toString()
        ];
      });

      autoTable(doc, {
        startY: yPos + 10,
        head: [['Theme', 'Question', 'Answer', 'Score']],
        body: tableData,
        headStyles: { fillColor: [230, 81, 0] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 80 },
          2: { cellWidth: 60 },
          3: { cellWidth: 15, halign: 'center' }
        },
        styles: { fontSize: 8, overflow: 'linebreak' }
      });

      // Save
      const fileName = `ODI-Assessment-${this.assessmentData.userDetails?.organization?.replace(/[^a-zA-Z0-9]/g, '') || 'Report'}.pdf`;
      doc.save(fileName);

    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  }

  visitAccelerators() {
    window.open('https://accelerator.nashtechglobal.com', '_blank');
  }

  trackByThemeId(index: number, theme: any): string {
    return theme.id;
  }
}
