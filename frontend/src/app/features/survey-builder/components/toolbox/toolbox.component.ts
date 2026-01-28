import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-toolbox',
    standalone: true,
    imports: [CommonModule, DragDropModule],
    template: `
    <div class="toolbox-pill group hover:w-64 transition-all duration-300 ease-in-out" cdkDropList>
        
        <!-- Draggable Tools -->
        <div class="flex flex-col gap-4 w-full mt-6">
            
            <!-- Text Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'text'" title="Text">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-blue-600 transition">text_fields</span>
                </div>
                <span class="text-label">Text Input</span>
                
                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">text_fields</span> Text Question
                </div>
            </div>

            <!-- Rating Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'rating'" title="Rating">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-yellow-500 transition">star_rate</span>
                </div>
                <span class="text-label">Rating</span>

                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">star_rate</span> Rating
                </div>
            </div>

            <!-- Choice Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'radiogroup'" title="Choice">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-purple-500 transition">radio_button_checked</span>
                </div>
                <span class="text-label">Choice</span>

                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">radio_button_checked</span> Choice
                </div>
            </div>

            <!-- Checkbox Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'checkbox'" title="Check">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-green-500 transition">check_box</span>
                </div>
                <span class="text-label">Checkbox</span>

                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">check_box</span> Checkbox
                </div>
            </div>

            <!-- Dropdown Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'dropdown'" title="Dropdown">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-teal-500 transition">arrow_drop_down_circle</span>
                </div>
                <span class="text-label">Dropdown</span>

                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">arrow_drop_down_circle</span> Dropdown
                </div>
            </div>

            <!-- Date Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'date'" title="Date">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-orange-500 transition">calendar_today</span>
                </div>
                <span class="text-label">Datepicker</span>

                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">calendar_today</span> Date
                </div>
            </div>

            <!-- File Upload Tool -->
            <div class="tool-item group/item" cdkDrag [cdkDragData]="'file'" title="File Upload">
                <div class="icon-container">
                    <span class="material-icons text-gray-500 group-hover/item:text-indigo-500 transition">cloud_upload</span>
                </div>
                <span class="text-label">File Upload</span>

                <div *cdkDragPreview class="tool-preview">
                    <span class="material-icons mr-2">cloud_upload</span> File Upload
                </div>
            </div>

        </div>

        <!-- Bottom Actions (Restored Position) -->
        <div class="mt-auto mb-6 w-full flex flex-col gap-2">
            <div class="w-full h-px bg-gray-100 mb-2 group-hover:block hidden"></div>
            
            <button class="tool-item group/item">
                <div class="icon-container">
                    <span class="material-icons text-gray-400 group-hover/item:text-gray-600 transition">settings</span>
                </div>
                <span class="text-label">Settings</span>
            </button>

            <button class="tool-item group/item">
                <div class="icon-container">
                    <span class="material-icons text-gray-400 group-hover/item:text-blue-500 transition">visibility</span>
                </div>
                <span class="text-label">Preview</span>
            </button>
        </div>
    </div>
  `,
    styles: [`
    .toolbox-pill {
        @apply bg-white rounded-full flex flex-col items-center py-2 shadow-2xl border border-gray-100 overflow-hidden;
        width: 80px; // Collapsed width
        height: min(90vh, 800px);
        position: fixed;
        left: 2rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 50;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        // When expanded
        &:hover {
            width: 280px; // Expanded width
            border-radius: 24px; // Slightly less rounded when boxy
        }
    }

    .tool-item {
        @apply flex items-center p-0 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-full h-12 relative;
        /* Removed padding, layout is handled by children */
    }

    .icon-container {
        @apply w-[80px] h-12 flex items-center justify-center shrink-0; 
        /* Strictly 80px width (matching sidebar) to center icon perfectly */
    }

    .text-label {
        @apply text-gray-700 font-medium whitespace-nowrap opacity-0 transition-opacity duration-200;
        /* Removed ml-4 as spacing is handled by icon-container width */
        
        // Show text on parent (pill) hover
        .toolbox-pill:hover & {
            opacity: 1;
            transition-delay: 0.1s;
        }
    }

    .tool-preview {
        @apply bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border border-blue-100 font-semibold text-gray-700;
        width: 200px;
        z-index: 1000;
    }

    .material-icons {
        font-size: 24px;
        user-select: none;
    }
  `]
})
export class ToolboxComponent {
    // No complex logic needed, CSS handles the view
}
