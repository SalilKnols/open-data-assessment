import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { environment } from '../environments/environment';
import { AssessmentData, AssessmentResult } from '../models/assessment.model';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private genAI: GoogleGenerativeAI;

    private readonly FALLBACK_MODELS = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-2.5-flash',
        'gemini-1.5-flash',
        'gemini-pro'
    ];

    constructor() {
        this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    }

    async generateRecommendations(
        data: AssessmentData,
        maturityLevel: string,
        themeScores: { [theme: string]: number }
    ): Promise<string[]> {
        const prompt = this.constructPrompt(data, maturityLevel, themeScores);

        for (const modelName of this.FALLBACK_MODELS) {
            try {
                console.log(`Attempting to generate recommendations using model: ${modelName}`);
                const model = this.genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // If we get here, it worked
                return this.parseRecommendations(text);
            } catch (error: any) {
                console.warn(`Failed with model ${modelName}:`, error.message || error);
                // Continue to next model
            }
        }

        console.error('All AI model attempts failed.');

        // Debug: Check what models are actually available
        await this.debugModelAccess();

        return [
            'Unable to generate personalized recommendations at this time.',
            'Please review your lowest scoring areas and focus on foundational improvements.',
            'Consult with a NashTech expert for a detailed analysis.'
        ];
    }

    private async debugModelAccess() {
        try {
            console.log('DEBUG: Checking available models for this API key...');
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${environment.geminiApiKey}`);
            const data = await response.json();

            if (data.error) {
                console.error('DEBUG: API Error listing models:', data.error);
            } else if (data.models) {
                console.log('DEBUG: Available models:', data.models.map((m: any) => m.name));
            } else {
                console.log('DEBUG: No models found or unexpected response:', data);
            }
        } catch (e) {
            console.error('DEBUG: Failed to list models:', e);
        }
    }

    private constructPrompt(
        data: AssessmentData,
        maturityLevel: string,
        themeScores: { [theme: string]: number }
    ): string {
        let prompt = `
      You are an expert consultant in Open Data Maturity. 
      Based on the following assessment results, provide 3-5 specific, actionable recommendations 
      to help the organization improve their Open Data maturity.
      
      Organization Maturity Level: ${maturityLevel}
      
      Theme Scores (1-5 scale):
      ${Object.entries(themeScores).map(([theme, score]) => `- ${theme}: ${score.toFixed(1)}`).join('\n')}
      
      Key Answers provided:
    `;

        // Add some context from answers (simplified for brevity, could be more detailed)
        // We'll take the lowest scoring answers to focus improvements
        const answers = data.answers;
        // Sort answers by score ascending to find weak points
        const weakPoints = [...answers].sort((a, b) => a.score - b.score).slice(0, 5);

        weakPoints.forEach(a => {
            prompt += `\n- Question ID ${a.questionId} (Score: ${a.score}): ${a.selectedOption}`;
        });

        prompt += `
      
      Please format the output as a simple JSON array of strings, e.g.:
      [
        "Recommendation 1...",
        "Recommendation 2...",
        "Recommendation 3..."
      ]
      Do not include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON array.
    `;

        return prompt;
    }

    private parseRecommendations(text: string): string[] {
        try {
            // Clean up any potential markdown code blocks if the model ignores the instruction
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.warn('Failed to parse AI response as JSON, returning raw text split by newlines', e);
            return text.split('\n').filter(line => line.trim().length > 0);
        }
    }
}
