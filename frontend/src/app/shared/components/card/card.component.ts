import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
  @Input() hoverEffects: boolean = false;

  get classes(): string {
    let classes = `card-padding-${this.padding} `;
    if (this.hoverEffects) classes += 'card-hoverable ';
    return classes;
  }
}
