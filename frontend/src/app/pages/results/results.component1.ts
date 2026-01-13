import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="thankyou-container">
      <mat-card class="thankyou-card">
        <mat-card-content>
          <h2 class="title">Thanks — you’re all set</h2>
          <p class="subtitle">We appreciate your time. You’ll be taken to NashTech Accelerators in <strong>{{ countdown }}</strong> second{{ countdown !== 1 ? 's' : '' }}.</p>
          <div class="actions">
            <button class="cta" mat-raised-button (click)="visitAccelerators()" aria-label="Open NashTech Accelerators">
              <mat-icon class="cta-icon">launch</mat-icon>
              <span class="cta-text">Open NashTech Accelerators</span>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .thankyou-container { min-height: calc(100vh - 100px); display:flex; align-items:center; justify-content:center; padding:24px; }
    .thankyou-card { max-width:640px; width:100%; text-align:center; padding:32px; border-radius:12px; box-shadow: 0 6px 22px rgba(20,20,40,0.08); }
    .title { margin: 0 0 8px 0; font-size:1.6rem; color: #0f1724; }
    .subtitle { margin:0; color: #475569; font-size:1rem; }
    .actions { margin-top: 22px; }

    /* CTA Button */
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      border-radius: 999px;
      color: white;
      background: linear-gradient(90deg, #0966d2 0%, #00b4d8 100%);
      box-shadow: 0 6px 18px rgba(9,102,210,0.18);
      border: none;
      text-transform: none;
      font-weight: 600;
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    .cta:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(9,102,210,0.22); }
    .cta:active { transform: translateY(0); }
    .cta-icon { font-size:18px; }
    .cta-text { font-size: 0.95rem; }
    `
  ]
})
export class ResultsComponent implements OnInit, OnDestroy {
  countdown = 5;
  private intervalId: number | null = null;
  private readonly targetUrl = 'https://accelerator.nashtechglobal.com';

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  private startCountdown(): void {
    this.clearCountdown();
    this.intervalId = window.setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        this.clearCountdown();
        window.location.href = this.targetUrl;
      }
    }, 1000);
  }

  private clearCountdown(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  visitAccelerators(): void {
    window.open(this.targetUrl, '_blank');
  }
}