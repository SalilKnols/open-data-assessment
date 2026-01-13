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
    ): Promise<{ general: string[], themes: { [id: string]: string[] } }> {
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

        return {
            general: [
                'Unable to generate personalized recommendations at this time.',
                'Please review your lowest scoring areas and focus on foundational improvements.',
                'Consult with a NashTech expert for a detailed analysis.'
            ],
            themes: {}
        };
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
      Based on the following assessment results, provide specific, actionable recommendations 
      to help the organization improve their Open Data maturity.

      Organization Maturity Level: ${maturityLevel}

      Theme Scores (1-5 scale):
      ${Object.entries(themeScores).map(([theme, score]) => `- ${theme}: ${score.toFixed(1)}`).join('\n')}

      All Answers provided (Grouped by Theme context):
    `;

        // Add all answers
        const answers = data.answers;
        answers.forEach(a => {
            prompt += `\n- Question ID ${a.questionId} (Score: ${a.score}): ${a.selectedOption}`;
        });

        prompt += `
      
      Please provide your response in the following strict JSON format:
      {
        "general": [
            "Recommendation 1 (General high-level advice)",
            "Recommendation 2 ...",
            "Recommendation 3 ..."
        ],
        "themes": {
            "data-publication": [
                "Bullet point 1 (Simple, actionable advice)",
                "Bullet point 2 (Avoid jargon)",
                "Bullet point 3"
            ],
            "data-literacy": ["..."],
            "customer-support": ["..."],
            "investment": ["..."],
            "strategic-oversight": ["..."]
        }
      }

      Requirements:
      1. 'general': 3-5 short, punchy recommendations.
      2. 'themes': For EACH of the 5 themes, provide 3-4 CONCISE bullet points.
      3. Language: Use SIMPLE, EASY TO UNDERSTAND language. Avoid complex technical jargon. Explain things clearly as if speaking to a non-technical manager.
      4. Do not include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON object.
    `;

        return prompt;
    }

    private parseRecommendations(text: string): { general: string[], themes: { [id: string]: string[] } } {
        try {
            // Clean up any potential markdown code blocks if the model ignores the instruction
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);

            return {
                general: Array.isArray(parsed.general) ? parsed.general : [],
                themes: typeof parsed.themes === 'object' ? parsed.themes : {}
            };
        } catch (e) {
            console.warn('Failed to parse AI response as JSON', e);
            // Fallback: try to just return lines as general recommendations
            return {
                general: text.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
                themes: {}
            };
        }
    }
}
