import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToolboxComponent } from '../../components/toolbox/toolbox.component';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { PropertiesPanelComponent } from '../../components/properties-panel/properties-panel.component';
import { SurveyElement } from '../../../../core/models/survey-element.model';

@Component({
  selector: 'app-survey-builder',
  standalone: true,
  imports: [CommonModule, DragDropModule, ToolboxComponent, CanvasComponent, PropertiesPanelComponent],
  templateUrl: './survey-builder.component.html',
  styleUrls: ['./survey-builder.component.scss']
})
export class SurveyBuilderComponent {
  // Logic for managing dragging or selection state will go here later
  selectedElement: SurveyElement | null = null;

  onElementSelected(element: SurveyElement | null) {
    this.selectedElement = element;
  }
}
