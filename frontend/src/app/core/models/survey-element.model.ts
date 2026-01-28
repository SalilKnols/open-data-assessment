export type QuestionType = 'text' | 'rating' | 'radiogroup' | 'checkbox' | 'comment' | 'boolean';

export interface SurveyElement {
    id: string; // Unique ID on the canvas
    type: QuestionType;
    title: string;
    name: string; // Internal variable name
    isRequired?: boolean;
    choices?: string[]; // For radiogroup and checkbox
    properties?: any; // Additional props like 'rateMax', etc.
}
