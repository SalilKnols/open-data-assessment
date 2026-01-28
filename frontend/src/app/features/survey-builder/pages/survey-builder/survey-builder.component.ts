import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ToolboxComponent } from '../../components/toolbox/toolbox.component';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { PropertiesPanelComponent } from '../../components/properties-panel/properties-panel.component';
import { SurveyElement } from '../../../../core/models/survey-element.model';
import { SurveyService, SurveyRequest } from '../../../../core/services/survey.service';

@Component({
  selector: 'app-survey-builder',
  standalone: true,
  imports: [CommonModule, DragDropModule, ToolboxComponent, CanvasComponent, PropertiesPanelComponent],
  templateUrl: './survey-builder.component.html',
  styleUrls: ['./survey-builder.component.scss']
})
export class SurveyBuilderComponent {
  @ViewChild(CanvasComponent) canvas!: CanvasComponent;

  selectedElement: SurveyElement | null = null;

  constructor(private surveyService: SurveyService) { }

  onElementSelected(element: SurveyElement | null) {
    this.selectedElement = element;
  }

  showSuccessModal = false;

  saveSurvey() {
    if (!this.canvas) return;

    const request: SurveyRequest = {
      title: this.canvas.surveyTitle || 'Untitled Survey',
      description: this.canvas.surveyDescription || '',
      status: 'DRAFT', // Default status
      schemaJson: {
        pages: [
          {
            name: 'page1',
            elements: this.canvas.elements
          }
        ]
      }
    };

    console.log('Saving survey...', request);

    this.surveyService.createSurvey(request).subscribe({
      next: (response) => {
        console.log('Survey saved successfully!', response);
        this.showSuccessModal = true;
        // Auto-close after 3 seconds
        setTimeout(() => {
          this.showSuccessModal = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error saving survey:', err);
        alert('Failed to save survey. Check console for details.');
      }
    });
  }

  openPreview() {
    if (!this.canvas) return;

    const previewData = {
      title: this.canvas.surveyTitle || 'Untitled Survey',
      description: this.canvas.surveyDescription || '',
      elements: this.canvas.elements
    };

    localStorage.setItem('preview_draft', JSON.stringify(previewData));

    // Open in a named tab to avoid duplicates
    window.open('/preview', 'survey_preview_tab');
  }

  closeModal() {
    this.showSuccessModal = false;
  }
}
