import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="welcome-container">
      <div class="container">
        <div class="welcome-content fade-in">
          <!-- Compact Welcome Header -->
          <div class="welcome-header">
            <div class="welcome-badge gradient-bg">
              <mat-icon class="welcome-icon" aria-hidden="true">rocket_launch</mat-icon>
              <h1 class="welcome-title">Ready to Begin?</h1>
              <p class="welcome-subtitle">
                Your professional Open Data Maturity Assessment powered by NashTech Accelerators
              </p>
            </div>
          </div>

          <!-- Compact Assessment Info -->
          <mat-card class="info-card card-nashtech">
            <mat-card-header>
              <mat-card-title>Assessment Overview</mat-card-title>
              <mat-card-subtitle>What to expect from your ODI framework evaluation</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon-wrapper theme-data-publication">
                    <mat-icon>assessment</mat-icon>
                  </div>
                  <div class="info-details">
                    <h4>47 Official Questions</h4>
                    <p>Complete ODI framework evaluation across 5 key themes</p>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon-wrapper theme-data-literacy">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="info-details">
                    <h4>25-35 Minutes</h4>
                    <p>Professional assessment duration with progress saving</p>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon-wrapper theme-customer-support">
                    <mat-icon>analytics</mat-icon>
                  </div>
                  <div class="info-details">
                    <h4>Comprehensive Results</h4>
                    <p>Detailed analysis with Excel export and recommendations</p>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon-wrapper theme-investment">
                    <mat-icon>speed</mat-icon>
                  </div>
                  <div class="info-details">
                    <h4>NashTech Accelerated</h4>
                    <p>Powered by proven accelerator templates and expertise</p>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Compact 5 Themes Overview -->
          <mat-card class="themes-card card-nashtech">
            <mat-card-header>
              <mat-card-title>5 Assessment Themes</mat-card-title>
              <mat-card-subtitle>Official ODI framework themes you'll be evaluated on</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="themes-grid">
                <div 
                  *ngFor="let theme of themes; trackBy: trackByThemeId"
                  class="theme-item">
                  <div class="theme-icon-wrapper" [ngClass]="'theme-' + theme.id">
                    <span class="theme-icon">{{ theme.icon }}</span>
                  </div>
                  <div class="theme-info">
                    <h4 class="theme-name">{{ theme.title }}</h4>
                    <p class="theme-description">{{ theme.description }}</p>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Important Notes -->
          <mat-card class="notes-card card-nashtech-accent">
            <mat-card-content>
              <div class="notes-content">
                <mat-icon class="notes-icon">info</mat-icon>
                <div class="notes-text">
                  <h4>Important Notes</h4>
                  <ul>
                    <li><strong>Honest Assessment:</strong> Select options that reflect your organization's current practices, not aspirations</li>
                    <li><strong>Progress Saved:</strong> Your answers are automatically saved as you go</li>
                    <li><strong>Excel Export:</strong> Download comprehensive reports in Excel format</li>
                    <li><strong>NashTech Support:</strong> Get accelerator-powered recommendations for improvement</li>
                  </ul>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Start Button -->
          <div class="start-section">
            <button 
              mat-raised-button 
              color="primary"
              (click)="startAssessment()"
              class="start-button">
              <mat-icon>play_arrow</mat-icon>
              Start Assessment
            </button>
            <p class="start-note">Begin your 47-question ODI framework evaluation</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      min-height: calc(100vh - 140px);
      padding: var(--nashtech-spacing-md) 0;
    }

    .welcome-content {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-lg);
      max-width: 800px;
      margin: 0 auto;
    }

    /* Compact Welcome Header */
    .welcome-header {
      text-align: center;
      margin-bottom: var(--nashtech-spacing-md);
    }

    .welcome-badge {
      padding: var(--nashtech-spacing-xl); /* Increased padding to ensure icon visibility */
      border-radius: var(--nashtech-radius-lg);
      color: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-lg);
      position: relative;
      overflow: hidden;
    }

    .welcome-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
      pointer-events: none;
    }

    .welcome-icon {
      font-size: 2.5rem;
      /* Explicitly set width and height to match font-size for proper rendering */
      display: block;
      width: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem; /* Ensure vertical centering of the glyph */
      /* Center the block element horizontally while retaining the bottom margin */
      margin: 0 auto var(--nashtech-spacing-sm);
    }

    .welcome-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .welcome-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
      line-height: 1.4;
    }

    /* Card Header Styling */
    .card-nashtech mat-card-title,
    .themes-card mat-card-title {
      font-weight: 600; /* Make title bold */
      font-size: 1.125rem; /* Increase font size */
      color: var(--nashtech-text-primary);
    }

    .card-nashtech mat-card-subtitle,
    .themes-card mat-card-subtitle {
      font-size: 0.875rem; /* Set subtitle size for contrast */
      color: var(--nashtech-text-secondary);
    }

    /* Compact Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--nashtech-spacing-sm);
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
      padding: var(--nashtech-spacing-sm);
      background: var(--nashtech-bg-secondary);
      border-radius: var(--nashtech-radius-md);
      border: 1px solid var(--nashtech-border);
      transition: all 0.3s ease;
    }

    .info-item:hover {
      background: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-sm);
      transform: translateY(-1px);
    }

    .info-icon-wrapper {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--nashtech-shadow-sm);
    }

    .info-icon-wrapper mat-icon {
      font-size: 1.25rem;
      color: var(--nashtech-white);
      /* Use line-height: 1 to normalize vertical alignment within the flex container */
      line-height: 1;
    }

    .info-details {
      flex: 1;
      min-width: 0;
    }

    .info-details h4 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 2px 0;
    }

    .info-details p {
      font-size: 0.8125rem;
      color: var(--nashtech-text-secondary);
      margin: 0;
      line-height: 1.3;
    }

    /* Compact Themes Grid */
    .themes-grid {
      display: grid;
      gap: var(--nashtech-spacing-sm);
    }

    .theme-item {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
      padding: var(--nashtech-spacing-sm);
      background: var(--nashtech-bg-secondary);
      border-radius: var(--nashtech-radius-md);
      border: 1px solid var(--nashtech-border);
      transition: all 0.3s ease;
    }

    .theme-item:hover {
      background: var(--nashtech-white);
      box-shadow: var(--nashtech-shadow-sm);
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
      /* Normalize line-height for consistent vertical centering of emojis */
      line-height: 1;
    }

    .theme-info {
      flex: 1;
      min-width: 0;
    }

    .theme-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 2px 0;
    }

    .theme-description {
      font-size: 0.8125rem;
      color: var(--nashtech-text-secondary);
      margin: 0;
      line-height: 1.3;
    }

    /* Compact Notes Section */
    .notes-content {
      display: flex;
      align-items: flex-start;
      gap: var(--nashtech-spacing-sm);
    }

    .notes-icon {
      color: var(--nashtech-primary);
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .notes-text {
      flex: 1;
    }

    .notes-text h4 {
      font-size: 1.125rem; /* Match other card titles */
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
    }

    .notes-text ul {
      margin: 0;
      padding-left: var(--nashtech-spacing-lg);
      list-style-type: disc;
    }

    .notes-text li {
      font-size: 0.875rem;
      color: var(--nashtech-text-secondary);
      margin-bottom: var(--nashtech-spacing-xs);
      line-height: 1.4;
    }

    .notes-text li:last-child {
      margin-bottom: 0;
    }

    /* Start Section */
    .start-section {
      text-align: center;
      padding: var(--nashtech-spacing-lg) 0;
    }

    .start-button {
      min-width: 200px;
      height: 48px;
      font-size: 1rem;
      font-weight: 500;
      border-radius: var(--nashtech-radius-md);
      box-shadow: var(--nashtech-shadow-lg);
      margin-bottom: var(--nashtech-spacing-sm);
    }

    .start-note {
      font-size: 0.875rem;
      color: var(--nashtech-text-muted);
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .welcome-title {
        font-size: 1.625rem;
      }

      .welcome-subtitle {
        font-size: 0.9375rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .info-item,
      .theme-item {
        padding: var(--nashtech-spacing-xs);
      }

      .notes-content {
        flex-direction: column;
        text-align: center;
      }

      .start-button {
        width: 100%;
        max-width: 250px;
      }
    }

    @media (max-width: 480px) {
      .welcome-icon {
        font-size: 2rem;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .info-icon-wrapper,
      .theme-icon-wrapper {
        width: 2rem;
        height: 2rem;
      }

      .info-icon-wrapper mat-icon {
        font-size: 1rem;
      }

      .theme-icon {
        font-size: 1rem;
      }
    }
  `]
})
export class WelcomeComponent implements OnInit {
  themes = this.assessmentService.getThemes();

  constructor(
    private router: Router,
    private assessmentService: AssessmentService
  ) { }

  ngOnInit() {
    if (this.assessmentService.getCurrentStep() === 0) {
      this.assessmentService.setCurrentStep(1);
    }
  }

  startAssessment() {
    this.router.navigate(['/assessment']);
  }

  trackByThemeId(index: number, theme: any): string {
    return theme.id;
  }
}
