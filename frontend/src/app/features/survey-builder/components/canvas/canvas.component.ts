import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SurveyElement, QuestionType } from '../../../../core/models/survey-element.model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="survey-paper" cdkDropList (cdkDropListDropped)="drop($event)">
        <!-- Editable Header -->
        <div class="paper-header text-center mb-12 group">
            <input [(ngModel)]="surveyTitle" 
                   class="text-4xl font-extrabold text-gray-900 tracking-tight text-center w-full bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-300 transition-all duration-200 hover:bg-gray-50 rounded-lg px-4 py-2" 
                   placeholder="Untitled Survey">
            <textarea [(ngModel)]="surveyDescription" 
                      class="text-gray-500 mt-2 text-lg text-center w-full bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-300 resize-none overflow-hidden transition-all duration-200 hover:bg-gray-50 rounded-lg px-4 py-2" 
                      rows="1"
                      (input)="autoResize($event)"
                      placeholder="Add a description to your survey..."></textarea>
        </div>

        <div class="paper-body min-h-[400px] flex flex-col gap-6">
            <!-- Empty State -->
            <div *ngIf="elements.length === 0" class="empty-state border-2 border-dashed border-gray-300 rounded-2xl p-16 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <span class="material-icons text-3xl">post_add</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-600">Start Building</h3>
                <p class="text-sm text-gray-400 mt-2">Drag questions from the sidebar</p>
            </div>

            <!-- List of Questions -->
            <div *ngFor="let element of elements; let i = index" 
                 class="question-wrapper group relative transition-all duration-200"
                 (click)="selectElement(element)"
                 cdkDrag>
                
                <!-- Card Container -->
                <div class="bg-white rounded-2xl p-8 border hover:shadow-lg transition-all duration-300 transform relative"
                     [class.border-blue-500]="selectedElementId === element.id"
                     [class.border-2]="selectedElementId === element.id"
                     [class.shadow-xl]="selectedElementId === element.id"
                     [class.border-gray-200]="selectedElementId !== element.id">
                     
                     <!-- Editable Question Title -->
                     <div class="mb-6 flex gap-3 items-baseline">
                        <span class="text-2xl font-bold text-blue-100 select-none">{{ i + 1 }}.</span>
                        <input [(ngModel)]="element.title"
                               class="text-2xl font-bold text-gray-800 bg-transparent border-none focus:ring-0 focus:border-b-2 focus:border-blue-500 w-full p-0 transition-colors placeholder-gray-400"
                               placeholder="Question Title">
                     </div>

                     <div [ngSwitch]="element.type">
                         
                         <!-- Text Question -->
                         <div *ngSwitchCase="'text'">
                            <input disabled type="text" class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" placeholder="Type your answer here...">
                         </div>

                         <!-- Rating Question -->
                         <div *ngSwitchCase="'rating'" class="flex gap-2">
                            <span *ngFor="let star of [1,2,3,4,5]" class="material-icons text-yellow-400 text-4xl cursor-pointer hover:scale-110 transition">star_border</span>
                         </div>

                         <!-- Radio Question -->
                         <div *ngSwitchCase="'radiogroup'" class="space-y-3">
                            <div *ngFor="let choice of element.choices; let choiceIndex = index; trackBy: trackByIndex"
                                 class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 group/choice relative transition-colors">
                                <span class="material-icons text-gray-300">radio_button_unchecked</span>
                                <input [(ngModel)]="element.choices![choiceIndex]"
                                       class="bg-transparent border-none focus:ring-0 w-full text-gray-700 font-medium placeholder-gray-400"
                                       placeholder="Option Label">
                                
                                <!-- Remove Option Button -->
                                <button (click)="removeChoice(element, choiceIndex); $event.stopPropagation()"
                                        class="opacity-0 group-hover/choice:opacity-100 text-gray-400 hover:text-red-500 transition p-1">
                                    <span class="material-icons text-lg">close</span>
                                </button>
                            </div>
                            
                            <!-- Add Option Button -->
                            <button (click)="addChoice(element); $event.stopPropagation()" 
                                    class="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition mt-2">
                                <span class="material-icons text-sm">add</span> Add Option
                            </button>
                         </div>

                         <!-- Checkbox Question -->
                         <div *ngSwitchCase="'checkbox'" class="space-y-3">
                            <div *ngFor="let choice of element.choices; let choiceIndex = index; trackBy: trackByIndex"
                                 class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 group/choice relative transition-colors">
                                <span class="material-icons text-gray-300">check_box_outline_blank</span>
                                <input [(ngModel)]="element.choices![choiceIndex]"
                                       class="bg-transparent border-none focus:ring-0 w-full text-gray-700 font-medium placeholder-gray-400"
                                       placeholder="Option Label">

                                <!-- Remove Option Button -->
                                <button (click)="removeChoice(element, choiceIndex); $event.stopPropagation()"
                                        class="opacity-0 group-hover/choice:opacity-100 text-gray-400 hover:text-red-500 transition p-1">
                                    <span class="material-icons text-lg">close</span>
                                </button>
                            </div>

                            <!-- Add Option Button -->
                            <button (click)="addChoice(element); $event.stopPropagation()" 
                                    class="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition mt-2">
                                <span class="material-icons text-sm">add</span> Add Option
                            </button>
                         </div>

                         <div *ngSwitchDefault>
                            <p class="text-gray-400 text-sm uppercase">Unknown Type: {{ element.type }}</p>
                         </div>
                     </div>
                </div>
                
                <!-- Floating Drag Handle -->
                <div *ngIf="selectedElementId === element.id" class="absolute -right-12 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-1 z-10">
                    <div class="w-10 h-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center cursor-move text-white hover:bg-blue-700 transition" cdkDragHandle title="Drag to reorder">
                        <span class="material-icons text-lg">drag_indicator</span>
                    </div>
                </div>

                <!-- Delete Action -->
                <button (click)="removeElement(i); $event.stopPropagation()" class="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50">
                    <span class="material-icons">delete_outline</span>
                </button>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .survey-paper {
        @apply w-full max-w-4xl mx-auto min-h-[85vh] transition-all duration-300;
    }
  `]
})
export class CanvasComponent {
  elements: SurveyElement[] = [];
  selectedElementId: string | null = null;
  surveyTitle: string = 'Untitled Survey';
  surveyDescription: string = '';

  @Output() elementSelected = new EventEmitter<SurveyElement | null>();

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
    } else {
      const type = event.item.data as QuestionType;
      this.addElement(type, event.currentIndex);
    }
  }

  addElement(type: QuestionType, index?: number) {
    const newElement: SurveyElement = {
      id: crypto.randomUUID(),
      type: type,
      title: this.getDefaultTitle(type),
      name: `question${this.elements.length + 1}`,
      isRequired: false,
      choices: (type === 'radiogroup' || type === 'checkbox') ? ['Option 1', 'Option 2'] : undefined
    };

    if (index !== undefined) {
      this.elements.splice(index, 0, newElement);
    } else {
      this.elements.push(newElement);
    }
    this.selectElement(newElement);
  }

  addChoice(element: SurveyElement) {
    if (!element.choices) element.choices = [];
    element.choices.push(`Option ${element.choices.length + 1}`);
  }

  removeChoice(element: SurveyElement, index: number) {
    if (element.choices && element.choices.length > 1) {
      element.choices.splice(index, 1);
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  selectElement(element: SurveyElement) {
    this.selectedElementId = element.id;
    this.elementSelected.emit(element);
  }

  removeElement(index: number) {
    const removedId = this.elements[index].id;
    this.elements.splice(index, 1);
    if (this.selectedElementId === removedId) {
      this.selectedElementId = null;
      this.elementSelected.emit(null);
    }
  }

  getDefaultTitle(type: QuestionType): string {
    switch (type) {
      case 'text': return 'What is your answer?';
      case 'rating': return 'How would you rate this?';
      case 'radiogroup': return 'Select one option';
      case 'checkbox': return 'Select all that apply';
      default: return 'New Question';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'text': return 'text_fields';
      case 'rating': return 'star_rate';
      case 'radiogroup': return 'radio_button_checked';
      case 'checkbox': return 'check_box';
      default: return 'help_outline';
    }
  }

  autoResize(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
