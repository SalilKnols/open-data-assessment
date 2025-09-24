import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProgressBarComponent],
  template: `
    <div class="app">
      <header class="app-header gradient-bg">
        <div class="container">
          <div class="header-content">
            <div class="brand-section">
              <h1 class="brand-title">
                <span class="brand-main">NashTech</span>
                <span class="brand-sub">Open Data Assessment</span>
              </h1>
              <p class="brand-tagline">Official ODI Framework • Accelerated Results</p>
            </div>
          </div>
          <app-progress-bar></app-progress-bar>
        </div>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-brand">
              <h3 class="footer-title">NashTech Accelerators</h3>
              <p class="footer-description">Speed up development with proven assessment templates</p>
            </div>

            <div class="footer-links">
              <div class="footer-section">
                <h4>Assessment</h4>
                <ul>
                  <li><a href="https://theodi.org" target="_blank" rel="noopener">ODI Framework</a></li>
                  <li><a href="#" target="_blank" rel="noopener">Maturity Model</a></li>
                </ul>
              </div>

              <div class="footer-section">
                <h4>NashTech</h4>
                <ul>
                  <li><a href="https://accelerator.nashtechglobal.com" target="_blank" rel="noopener">Accelerators</a></li>
                  <li><a href="https://nashtech.com" target="_blank" rel="noopener">About Us</a></li>
                </ul>
              </div>

              <div class="footer-section">
                <h4>Resources</h4>
                <ul>
                  <li><a href="https://theodi.org" target="_blank" rel="noopener">Open Data Institute</a></li>
                  <li><a href="#" target="_blank" rel="noopener">Documentation</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <p>&copy; 2024 NashTech - Part of Nash Squared Group. Powered by official ODI framework.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--nashtech-bg-secondary);
    }

    /* Compact Header */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--nashtech-shadow-md);
    }

    .header-content {
      padding: var(--nashtech-spacing-lg) 0 var(--nashtech-spacing-sm);
    }

    .brand-section {
      text-align: center;
    }

    .brand-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--nashtech-white);
      margin: 0 0 var(--nashtech-spacing-xs) 0;
      line-height: 1.2;
    }

    .brand-main {
      display: inline;
      font-size: 1.75rem;
      letter-spacing: -0.01em;
      margin-right: var(--nashtech-spacing-xs);
    }

    .brand-sub {
      display: inline;
      font-size: 1rem;
      font-weight: 500;
      opacity: 0.9;
    }

    .brand-tagline {
      font-size: 0.875rem;
      color: var(--nashtech-white);
      opacity: 0.8;
      margin: 0;
      font-weight: 400;
    }

    .app-main {
      flex: 1;
      padding: var(--nashtech-spacing-xl) 0;
    }

    /* Compact Footer */
    .app-footer {
      background: var(--nashtech-gray-900);
      color: var(--nashtech-white);
      padding: var(--nashtech-spacing-xl) 0 var(--nashtech-spacing-md);
      margin-top: auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--nashtech-spacing-xl);
      margin-bottom: var(--nashtech-spacing-lg);
    }

    .footer-brand {
      max-width: 350px;
    }

    .footer-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--nashtech-white);
      margin: 0 0 var(--nashtech-spacing-sm) 0;
      background: var(--nashtech-bg-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .footer-description {
      color: var(--nashtech-gray-400);
      line-height: 1.5;
      margin: 0;
      font-size: 0.9375rem;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--nashtech-spacing-lg);
    }

    .footer-section h4 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--nashtech-white);
      margin: 0 0 var(--nashtech-spacing-sm) 0;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section li {
      margin-bottom: var(--nashtech-spacing-xs);
    }

    .footer-section a {
      color: var(--nashtech-gray-400);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: var(--nashtech-white);
    }

    .footer-bottom {
      border-top: 1px solid var(--nashtech-gray-700);
      padding-top: var(--nashtech-spacing-md);
      text-align: center;
    }

    .footer-bottom p {
      color: var(--nashtech-gray-500);
      font-size: 0.8125rem;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .brand-title {
        font-size: 1.25rem;
      }

      .brand-main {
        font-size: 1.5rem;
      }

      .brand-sub {
        font-size: 0.9375rem;
      }

      .brand-tagline {
        font-size: 0.8125rem;
      }

      .header-content {
        padding: var(--nashtech-spacing-md) 0 var(--nashtech-spacing-xs);
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: var(--nashtech-spacing-md);
      }

      .footer-links {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--nashtech-spacing-md);
      }
    }

    @media (max-width: 480px) {
      .brand-main {
        display: block;
        margin-right: 0;
      }

      .brand-sub {
        display: block;
        margin-top: var(--nashtech-spacing-xs);
      }

      .footer-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  title = 'NashTech Open Data Maturity Assessment - Improved UI';
}
