import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyElement } from '../../../../core/models/survey-element.model';

@Component({
    selector: 'app-survey-preview',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      <!-- Decorative Background Blobs (ODA Theme) -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-nashtech-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-nashtech-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-8 left-20 w-96 h-96 bg-nashtech-accent rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <!-- Main Container -->
      <div class="w-full max-w-2xl relative z-10">
        
        <!-- Error State -->
        <div *ngIf="!surveyData" class="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white">
            <span class="material-icons text-6xl text-gray-300 mb-4">error_outline</span>
            <h2 class="text-xl font-bold text-gray-800">No Preview Data</h2>
            <p class="text-gray-500 mt-2">Please return to the builder and click "Preview" again.</p>
        </div>

        <ng-container *ngIf="surveyData">
            
            <!-- STEP -1: WELCOME SCREEN -->
            <div *ngIf="currentStep === -1" class="text-center p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white animate-fade-in-up">
                <!-- Logo Layout (Optional placeholder) -->
                <!-- <img src="assets/logo.png" class="h-12 mx-auto mb-8" alt="Logo"> -->

                <div class="w-20 h-20 bg-gradient-to-br from-nashtech-primary to-nashtech-secondary rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-blue-500/20 transform rotate-3">
                    <span class="material-icons text-4xl text-white">poll</span>
                </div>

                <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-nashtech-primary to-nashtech-secondary mb-6 tracking-tight leading-tight">
                    {{ surveyData.title }}
                </h1>
                
                <p class="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto">
                    {{ surveyData.description }}
                </p>

                <button (click)="startSurvey()" 
                        class="px-12 py-4 bg-gradient-to-r from-nashtech-primary to-nashtech-secondary text-white text-lg font-bold rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 mx-auto">
                    Start Survey <span class="material-icons">arrow_forward</span>
                </button>
            </div>

            <!-- STEP 0+: WIZARD -->
            <div *ngIf="currentStep >= 0">

                <!-- Progress Bar -->
                <div class="mb-8 flex items-center gap-3 px-2">
                    <button class="text-gray-400 hover:text-nashtech-primary transition p-1 rounded-full hover:bg-white/50" 
                            (click)="currentStep = -1" title="Back to Start">
                        <span class="material-icons">home</span>
                    </button>
                    <div class="h-2 flex-1 bg-white/60 backdrop-blur rounded-full overflow-hidden border border-white/50">
                        <div class="h-full bg-gradient-to-r from-nashtech-primary to-nashtech-secondary transition-all duration-500 ease-out"
                             [style.width.%]="progress"></div>
                    </div>
                    <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider tabular-nums">
                        {{ currentStep + 1 }} / {{ surveyData.elements.length }}
                    </span>
                </div>

                <!-- Question Card -->
                <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 md:p-12 transition-all duration-500 min-h-[400px] flex flex-col justify-between relative">
                    
                    <!-- Content Area -->
                    <div class="flex-1 flex flex-col justify-center">
                        
                        <!-- Question Title -->
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-8 text-center animate-fade-in-up">
                            {{ currentElement.title }}
                            <span *ngIf="currentElement.isRequired" class="text-red-500" title="Required">*</span>
                        </h2>

                        <!-- Inputs -->
                        <div [ngSwitch]="currentElement.type" class="w-full max-w-lg mx-auto animate-fade-in-up animation-delay-100">
                            
                            <!-- Text -->
                            <div *ngSwitchCase="'text'">
                                <input type="text" 
                                       class="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-nashtech-primary focus:ring-4 focus:ring-blue-50 transition-all outline-none text-xl text-center placeholder-gray-300 text-gray-800"
                                       placeholder="Type your answer...">
                            </div>

                            <!-- Rating -->
                            <div *ngSwitchCase="'rating'" class="flex justify-center gap-3">
                                <label *ngFor="let star of [1,2,3,4,5]" class="cursor-pointer group relative">
                                    <input type="radio" [name]="currentElement.id" [value]="star" class="peer sr-only">
                                    <div class="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-200 flex items-center justify-center transition-all duration-200 peer-checked:border-yellow-400 peer-checked:bg-yellow-50 group-hover:border-yellow-200 group-hover:bg-yellow-50/50">
                                        <span class="material-icons text-3xl text-gray-300 peer-checked:text-yellow-400 transition-colors">star_rate</span>
                                    </div>
                                </label>
                            </div>

                            <!-- Radio -->
                            <div *ngSwitchCase="'radiogroup'" class="space-y-3">
                                <label *ngFor="let choice of currentElement.choices" 
                                       class="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all group has-[:checked]:border-nashtech-primary has-[:checked]:bg-blue-50 has-[:checked]:shadow-md">
                                    <div class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center group-has-[:checked]:border-nashtech-primary transition-colors">
                                        <div class="w-3 h-3 rounded-full bg-nashtech-primary scale-0 group-has-[:checked]:scale-100 transition-transform"></div>
                                    </div>
                                    <input type="radio" [name]="currentElement.id" [value]="choice" class="sr-only">
                                    <span class="text-lg text-gray-700 font-medium group-has-[:checked]:text-gray-900">{{ choice }}</span>
                                </label>
                            </div>

                            <!-- Checkbox -->
                            <div *ngSwitchCase="'checkbox'" class="space-y-3">
                                <label *ngFor="let choice of currentElement.choices" 
                                       class="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all group has-[:checked]:border-nashtech-primary has-[:checked]:bg-blue-50 has-[:checked]:shadow-md">
                                    <div class="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center justify-center group-has-[:checked]:border-nashtech-primary group-has-[:checked]:bg-nashtech-primary transition-colors">
                                        <span class="material-icons text-base text-white opacity-0 group-has-[:checked]:opacity-100">check</span>
                                    </div>
                                    <input type="checkbox" [name]="currentElement.id" [value]="choice" class="sr-only">
                                    <span class="text-lg text-gray-700 font-medium group-has-[:checked]:text-gray-900">{{ choice }}</span>
                                </label>
                            </div>

                            <!-- Dropdown -->
                            <div *ngSwitchCase="'dropdown'">
                                <div class="relative">
                                    <select class="w-full p-4 pl-6 pr-12 bg-gray-50 border-2 border-gray-100 rounded-2xl appearance-none cursor-pointer focus:border-nashtech-primary focus:ring-4 focus:ring-blue-50 transition-all outline-none text-xl text-gray-800">
                                        <option value="" disabled selected>Select an option...</option>
                                        <option *ngFor="let choice of currentElement.choices" [value]="choice">{{ choice }}</option>
                                    </select>
                                    <span class="material-icons text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-2xl">expand_more</span>
                                </div>
                            </div>

                            <!-- Date -->
                            <div *ngSwitchCase="'date'">
                                <input type="date" 
                                       class="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-nashtech-primary focus:ring-4 focus:ring-blue-50 transition-all outline-none text-xl text-gray-800 text-center">
                            </div>

                            <!-- File -->
                            <div *ngSwitchCase="'file'">
                                 <div class="w-full p-10 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50 hover:bg-white hover:border-nashtech-primary transition-all group cursor-pointer flex flex-col items-center justify-center text-center">
                                    <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition group-hover:shadow-md">
                                        <span class="material-icons text-3xl text-nashtech-primary">cloud_upload</span>
                                    </div>
                                    <span class="text-lg text-gray-700 font-bold group-hover:text-nashtech-primary">Upload File</span>
                                    <span class="text-sm text-gray-400 mt-1">Drag & drop or browse</span>
                                </div>
                            </div>

                            <div *ngSwitchDefault class="text-red-500 text-center">Unknown Type</div>
                        </div>
                    </div>

                    <!-- Navigation -->
                    <div class="flex items-center justify-between mt-12 animate-fade-in">
                        
                        <!-- Prev Button -->
                        <button *ngIf="currentStep > 0" (click)="prevStep()"
                                class="px-6 py-3 text-gray-400 font-semibold hover:text-gray-600 transition flex items-center gap-2 group">
                            <span class="material-icons group-hover:-translate-x-1 transition">arrow_back</span> Back
                        </button>
                        <div *ngIf="currentStep === 0"></div> <!-- Spacer -->

                        <!-- Next/Submit Button -->
                        <button *ngIf="!isLastStep" (click)="nextStep()"
                                class="px-10 py-4 bg-gradient-to-r from-nashtech-primary to-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2">
                            Next <span class="material-icons">arrow_forward</span>
                        </button>

                        <button *ngIf="isLastStep" 
                                class="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2">
                            Submit <span class="material-icons">check</span>
                        </button>

                    </div>
                </div>
            </div>

        </ng-container>
      </div>
    </div>
  `,
    styles: [`
    @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob {
        animation: blob 7s infinite;
    }
    .animation-delay-2000 {
        animation-delay: 2s;
    }
    .animation-delay-4000 {
        animation-delay: 4s;
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.5s ease-out forwards;
    }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SurveyPreviewComponent implements OnInit {
    surveyData: { title: string, description: string, elements: SurveyElement[] } | null = null;
    currentStep = -1; // Start at -1 for Welcome Screen

    ngOnInit() {
        const data = localStorage.getItem('preview_draft');
        if (data) {
            try {
                this.surveyData = JSON.parse(data);
                if (this.surveyData?.title) {
                    document.title = `Preview: ${this.surveyData.title}`;
                }
            } catch (e) {
                console.error('Failed to parse preview data', e);
            }
        }
    }

    get currentElement(): SurveyElement {
        if (!this.surveyData || this.currentStep < 0) return {} as SurveyElement;
        return this.surveyData.elements[this.currentStep];
    }

    get isLastStep(): boolean {
        return this.currentStep === (this.surveyData?.elements.length || 0) - 1;
    }

    get progress(): number {
        if (!this.surveyData?.elements.length) return 0;
        return ((this.currentStep + 1) / this.surveyData.elements.length) * 100;
    }

    startSurvey() {
        this.currentStep = 0;
    }

    nextStep() {
        if (!this.isLastStep) {
            this.currentStep++;
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }
}
