import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AssessmentService } from '../../services/assessment.service';
import { UserDetails } from '../../models/assessment.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="user-details-container">
      <div class="container">
        <!-- Compact Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">
              <span class="gradient-text">NashTech</span> Open Data Assessment
            </h1>
            <p class="hero-description">
              Professional Open Data Maturity Assessment using the official ODI framework
            </p>
          </div>
        </div>

        <!-- Form Section with Perfect Alignment -->
        <div class="form-section">
          <mat-card class="form-card">
            <mat-card-header class="card-header">
              <mat-card-title class="form-title">Begin Your Assessment</mat-card-title>
              <mat-card-subtitle class="form-subtitle">
                Please provide your details to start your organization's open data maturity journey
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content class="card-content">
              <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">

                <!-- Full Name Field -->
                <div class="form-field-wrapper">
                  <mat-form-field appearance="outline" class="full-width-field">
                    <mat-label>Full Name</mat-label>
                    <input 
                      matInput 
                      formControlName="fullName" 
                      placeholder=" Enter your full name"
                      autocomplete="name"
                      required>
                    <mat-icon matSuffix>person</mat-icon>
                    <mat-error *ngIf="userForm.get('fullName')?.hasError('required')">
                      Full Name is required
                    </mat-error>
                    <mat-error *ngIf="userForm.get('fullName')?.hasError('minlength')">
                      Name must be at least 2 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Phone Number Field -->
                <div class="form-field-wrapper">
                  <mat-form-field appearance="outline" class="full-width-field">
                    <mat-label>Phone Number</mat-label>
                    <input 
                      matInput 
                      formControlName="phoneNumber" 
                      type="tel"
                      placeholder=" Enter your phone number"
                      autocomplete="tel"
                      required>
                    <mat-icon matSuffix>phone</mat-icon>
                    <mat-error *ngIf="userForm.get('phoneNumber')?.hasError('required')">
                      Phone Number is required
                    </mat-error>
                    <mat-error *ngIf="userForm.get('phoneNumber')?.hasError('pattern')">
                      Please enter a valid phone number
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Email Address Field -->
                <div class="form-field-wrapper">
                  <mat-form-field appearance="outline" class="full-width-field">
                    <mat-label>Email Address</mat-label>
                    <input 
                      matInput 
                      formControlName="emailAddress" 
                      type="email"
                      placeholder=" Enter your email address"
                      autocomplete="email"
                      required>
                    <mat-icon matSuffix>email</mat-icon>
                    <mat-error *ngIf="userForm.get('emailAddress')?.hasError('required')">
                      Email Address is required
                    </mat-error>
                    <mat-error *ngIf="userForm.get('emailAddress')?.hasError('email')">
                      Please enter a valid email address
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Organization Field -->
                <div class="form-field-wrapper">
                  <mat-form-field appearance="outline" class="full-width-field">
                    <mat-label>Organization</mat-label>
                    <input 
                      matInput 
                      formControlName="organization" 
                      placeholder=" Enter your organization name"
                      autocomplete="organization"
                      required>
                    <mat-icon matSuffix>business</mat-icon>
                    <mat-error *ngIf="userForm.get('organization')?.hasError('required')">
                      Organization is required
                    </mat-error>
                    <mat-error *ngIf="userForm.get('organization')?.hasError('minlength')">
                      Organization name must be at least 2 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Submit Button -->
                <div class="form-actions">
                  <button 
                    mat-raised-button 
                    color="primary" 
                    type="submit"
                    [disabled]="userForm.invalid || isSubmitting"
                    class="submit-button">
                    <mat-icon>{{isSubmitting ? 'hourglass_empty' : 'rocket_launch'}}</mat-icon>
                    {{ isSubmitting ? 'Starting...' : 'Start Assessment' }}
                  </button>
                </div>
              </form>
            </mat-card-content>

            
          </mat-card>
        </div>

        <!-- Compact Info Cards -->
        <div class="info-section">
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon gradient-bg">
                <mat-icon>assessment</mat-icon>
              </div>
              <div class="info-text">
                <h4>47 ODI Questions</h4>
                <p>Official framework evaluation</p>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon gradient-bg">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="info-text">
                <h4>25-35 Minutes</h4>
                <p>Professional assessment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-details-container {
      min-height: calc(100vh - 140px);
      padding: var(--nashtech-spacing-md) 0;
    }

    /* Compact Hero Section */
    .hero-section {
      text-align: center;
      padding: var(--nashtech-spacing-lg) 0 var(--nashtech-spacing-xl);
    }

    .hero-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--nashtech-text-primary);
      margin: 0 0 var(--nashtech-spacing-sm) 0;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 1rem;
      color: var(--nashtech-text-secondary);
      line-height: 1.4;
      margin: 0 0 var(--nashtech-spacing-lg) 0;
    }

    .hero-features {
      display: flex;
      justify-content: center;
      gap: var(--nashtech-spacing-lg);
      flex-wrap: wrap;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-xs);
      font-weight: 500;
      color: var(--nashtech-text-primary);
      font-size: 0.875rem;
    }

    .feature-icon {
      color: var(--nashtech-primary);
      font-size: 1rem;
    }

    /* Form Section - Perfect Alignment */
    .form-section {
      display: flex;
      justify-content: center;
      margin-bottom: var(--nashtech-spacing-xl);
    }

    .form-card {
      width: 100%;
      max-width: 500px;
      box-shadow: var(--nashtech-shadow-md);
      border-radius: var(--nashtech-radius-lg);
      border: 1px solid var(--nashtech-border);
    }

    .card-header {
      text-align: center;
      padding: var(--nashtech-spacing-lg) var(--nashtech-spacing-lg) var(--nashtech-spacing-sm);
    }

    .form-title {
      font-size: 1.375rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin-bottom: var(--nashtech-spacing-xs);
    }

    .form-subtitle {
      font-size: 0.9375rem;
      color: var(--nashtech-text-secondary);
      line-height: 1.4;
    }

    .card-content {
      padding: 0 var(--nashtech-spacing-lg) var(--nashtech-spacing-md);
    }

    /* Perfect Form Field Alignment */
    .user-form {
      display: flex;
      flex-direction: column;
      gap: var(--nashtech-spacing-md);
      width: 100%;
    }

    .form-field-wrapper {
      width: 100%;
      display: block;
    }

    .full-width-field {
      width: 100%;
      display: block;
    }

    /* Critical Angular Material Form Field Fixes */
    ::ng-deep .full-width-field {
      width: 100% !important;
    }

    /* Fix the label positioning to prevent overlap */
    ::ng-deep .full-width-field .mat-mdc-form-field-infix {
      padding: 16px 0 !important;
      min-height: 56px !important;
      width: 100% !important;
      display: flex !important;
      align-items: center !important;
    }

    ::ng-deep .full-width-field .mat-mdc-input-element {
      width: 100% !important;
      font-size: 16px !important;
      line-height: 1.5 !important;
      padding: 0 16px !important;
      margin: 0 !important;
      border: none !important;
      outline: none !important;
      background: transparent !important;
    }

    /* Label positioning - this prevents the overlap */
    ::ng-deep .full-width-field .mat-mdc-floating-label {
      position: absolute !important;
      left: 16px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      font-size: 16px !important;
      color: #666 !important;
      pointer-events: none !important;
      transition: all 0.2s ease !important;
    }

    /* When field is focused or has content, move label up */
    ::ng-deep .full-width-field.mat-focused .mat-mdc-floating-label,
    ::ng-deep .full-width-field .mat-mdc-floating-label.mdc-floating-label--float-above {
      top: 0 !important;
      left: 12px !important;
      font-size: 12px !important;
      color: var(--nashtech-primary) !important;
      background: white !important;
      padding: 0 4px !important;
      transform: translateY(-50%) !important;
      z-index: 2 !important;
    }

    /* Outline styling */
    ::ng-deep .full-width-field .mat-mdc-form-field-outline {
      color: var(--nashtech-border) !important;
    }

    ::ng-deep .full-width-field.mat-focused .mat-mdc-form-field-outline-thick {
      color: var(--nashtech-primary) !important;
      opacity: 1 !important;
    }

    ::ng-deep .full-width-field .mat-mdc-form-field-outline-start,
    ::ng-deep .full-width-field .mat-mdc-form-field-outline-end,
    ::ng-deep .full-width-field .mat-mdc-form-field-outline-gap {
      border-color: var(--nashtech-border) !important;
    }

    ::ng-deep .full-width-field.mat-focused .mat-mdc-form-field-outline-start,
    ::ng-deep .full-width-field.mat-focused .mat-mdc-form-field-outline-end,
    ::ng-deep .full-width-field.mat-focused .mat-mdc-form-field-outline-gap {
      border-color: var(--nashtech-primary) !important;
    }

    /* Icon positioning */
    ::ng-deep .full-width-field .mat-mdc-form-field-icon-suffix {
      color: var(--nashtech-gray-500) !important;
      margin-right: 12px !important;
      position: absolute !important;
      right: 0 !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
    }

    ::ng-deep .full-width-field.mat-focused .mat-mdc-form-field-icon-suffix {
      color: var(--nashtech-primary) !important;
    }

    /* Error message styling */
    ::ng-deep .full-width-field .mat-mdc-form-field-subscript-wrapper {
      padding: 0 16px !important;
      margin-top: 4px !important;
    }

    ::ng-deep .full-width-field .mat-mdc-form-field-error {
      font-size: 12px !important;
      color: #f44336 !important;
    }

    /* Hide placeholder when label is present */
    ::ng-deep .full-width-field .mat-mdc-input-element::placeholder {
      color: transparent !important;
    }

    ::ng-deep .full-width-field.mat-focused .mat-mdc-input-element::placeholder {
      color: #999 !important;
      opacity: 0.7 !important;
    }

    /* Form Actions */
    .form-actions {
      margin-top: 0;
      text-align: center;
    }

    .submit-button {
      min-width: 180px;
      height: 44px;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: var(--nashtech-radius-md);
      box-shadow: var(--nashtech-shadow-md);
    }

    /* Compact Info Section */
    .info-section {
      margin-top: var(--nashtech-spacing-xl);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: var(--nashtech-spacing-md);
      max-width: 600px;
      margin: 0 auto;
    }

    .info-card {
      display: flex;
      align-items: center;
      gap: var(--nashtech-spacing-sm);
      padding: var(--nashtech-spacing-md);
      background: var(--nashtech-white);
      border-radius: var(--nashtech-radius-md);
      border: 1px solid var(--nashtech-border);
      transition: all 0.3s ease;
      box-shadow: var(--nashtech-shadow-sm);
    }

    .info-card:hover {
      transform: translateY(-1px);
      box-shadow: var(--nashtech-shadow-md);
    }

    .info-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--nashtech-shadow-sm);
    }

    .info-icon mat-icon {
      font-size: 1rem;
      color: var(--nashtech-white);
      /* Ensure the icon itself is a centered block */
      height: 1rem;
      width: 1rem;
      line-height: 1rem;
    }

    .info-text {
      flex: 1;
    }

    .info-text h4 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--nashtech-text-primary);
      margin: 0 0 2px 0;
    }

    .info-text p {
      font-size: 0.8125rem;
      color: var(--nashtech-text-secondary);
      margin: 0;
      line-height: 1.2;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 1.75rem;
      }

      .hero-features {
        flex-direction: column;
        align-items: center;
        gap: var(--nashtech-spacing-sm);
      }

      .form-card {
        margin: 0 var(--nashtech-spacing-md);
      }

      .submit-button {
        width: 100%;
        min-width: auto;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      /* Prevent iOS zoom */
      ::ng-deep .full-width-field .mat-mdc-input-element {
        font-size: 16px !important;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 1.625rem;
      }

      .form-title {
        font-size: 1.25rem;
      }

      .form-subtitle {
        font-size: 0.875rem;
      }

      .card-content {
        padding: 0 var(--nashtech-spacing-md) var(--nashtech-spacing-sm);
      }
    }
  `]
})
export class UserDetailsComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private assessmentService: AssessmentService
  ) {
    this.userForm = this.createForm();
  }

  async ngOnInit() {
    // Wait for the service to finish restoring potential previous sessions
    // This prevents a race condition where checkPreviousSession overwrites our reset
    try {
      await firstValueFrom(this.assessmentService.initialized$);
    } catch (e) {
      console.warn('Initialization check failed', e);
    }

    // Reset current step to 0 when on user details page
    this.assessmentService.setCurrentStep(0);
    // Ensure we start fresh
    this.assessmentService.resetAssessment();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\d\s\-\(\)\+]+$/)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      organization: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  async onSubmit() {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      try {
        const userDetails: UserDetails = this.userForm.value;
        const email = userDetails.emailAddress;

        // Try to resume first
        const resumed = await this.assessmentService.resumeExistingAssessment(email);

        if (resumed) {
          console.log('Resuming assessment for', email);
          // Just update the user details in case they changed name/phone/org but kept email
          // This keeps the ID and answers but updates the metadata
          await this.assessmentService.setUserDetails(userDetails);
        } else {
          console.log('Starting new assessment for', email);
          this.assessmentService.resetAssessment(); // Ensure fresh state
          await this.assessmentService.setUserDetails(userDetails);
        }

        console.log('Assessment started/resumed successfully, navigating...');

        // Navigate to welcome page
        setTimeout(() => {
          this.router.navigate(['/welcome']);
        }, 800);
      } catch (error) {
        console.error('Error starting assessment:', error);
        this.isSubmitting = false;
        // Optionally show a user-visible error here
        alert(`Failed to start assessment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      console.log('Form is invalid or already submitting');
      console.log('Form is invalid or already submitting');
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }
}
