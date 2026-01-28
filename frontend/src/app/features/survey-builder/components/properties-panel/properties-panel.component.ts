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
        <div class="mb-8 border-b border-gray-100 pb-4">
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Properties</h2>
        </div>

        <div *ngIf="element; else noSelection" class="space-y-6">
            
            <!-- Question Type Switcher -->
            <div class="form-group">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Question Type</label>
                <div class="relative">
                    <select [ngModel]="element.type" (ngModelChange)="onTypeChange($event)"
                            class="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg appearance-none cursor-pointer focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 font-medium capitalize">
                        <option *ngFor="let type of questionTypes" [value]="type.value">{{ type.label }}</option>
                    </select>
                    <!-- Icon Overlay -->
                    <span class="material-icons text-blue-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {{ getIcon(element.type) }}
                    </span>
                    <!-- Dropdown Arrow -->
                    <span class="material-icons text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                </div>
            </div>

            <!-- Title Input -->
            <div class="form-group">
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Question Title</label>
                <input [(ngModel)]="element.title" 
                       class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-800 placeholder-gray-400"
                       placeholder="e.g. What is your name?">
            </div>

            <!-- Variable Name (Removed as per user request to avoid confusion) -->
            <!-- Use internal IDs for now -->

            <!-- Required Toggle -->
            <div class="form-group flex justify-between items-center py-2 border-t border-gray-50 mt-4">
                <label class="text-sm font-medium text-gray-700">Required</label>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="element.isRequired" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            
            <div class="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <h4 class="text-xs font-bold text-blue-800 uppercase mb-2">{{ element.type }} Settings</h4>
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

    questionTypes = [
        { value: 'text', label: 'Text Input' },
        { value: 'rating', label: 'Rating' },
        { value: 'radiogroup', label: 'Multiple Choice' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'dropdown', label: 'Dropdown' },
        { value: 'date', label: 'Datepicker' },
        { value: 'file', label: 'File Upload' }
    ];

    onTypeChange(newType: string) {
        if (!this.element) return;

        // Update type
        this.element.type = newType as any;

        // Initialize choices if switching to choice-based types
        if ((newType === 'radiogroup' || newType === 'checkbox' || newType === 'dropdown') && (!this.element.choices || this.element.choices.length === 0)) {
            this.element.choices = ['Option 1', 'Option 2', 'Option 3'];
        }
    }

    getIcon(type: string): string {
        switch (type) {
            case 'text': return 'text_fields';
            case 'rating': return 'star_rate';
            case 'radiogroup': return 'radio_button_checked';
            case 'checkbox': return 'check_box';
            case 'dropdown': return 'arrow_drop_down_circle';
            case 'date': return 'calendar_today';
            case 'file': return 'cloud_upload';
            default: return 'help_outline';
        }
    }
}
