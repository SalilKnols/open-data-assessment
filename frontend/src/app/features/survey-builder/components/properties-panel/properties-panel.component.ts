import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SurveyElement } from '../../../../core/models/survey-element.model';

@Component({
    selector: 'app-properties-panel',
    standalone: true,
    imports: [CommonModule, FormsModule, InputComponent],
    template: `
    <div class="properties-container h-full p-6 flex flex-col bg-white overflow-y-auto border-l border-gray-100 shadow-xl z-20">
        <div class="mb-4 border-b border-gray-100 pb-4">
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Properties</h2>
        </div>

        <div *ngIf="element; else noSelection" class="space-y-6">
            
            <!-- Variable Name (Removed as per user request to avoid confusion) -->
            <!-- Use internal IDs for now -->

            <!-- Required Toggle -->
            <div class="form-group flex justify-between items-center">
                <label class="text-sm font-medium text-gray-700">Required</label>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="element.isRequired" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            
            <div class="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <h4 class="text-xs font-bold text-blue-800 uppercase mb-2">{{ element?.type }} Settings</h4>
                 <p class="text-xs text-blue-600">Custom options for this type coming soon.</p>
            </div>

        </div>

        <ng-template #noSelection>
            <div class="h-full flex flex-col items-center justify-center text-center opacity-40">
                <span class="material-icons text-6xl text-gray-300 mb-4">touch_app</span>
                <p class="text-gray-500 font-medium">Select an element on the canvas to edit its properties.</p>
            </div>
        </ng-template>
    </div>
  `,
    styles: []
})
export class PropertiesPanelComponent {
    @Input() element: SurveyElement | null = null;
}
