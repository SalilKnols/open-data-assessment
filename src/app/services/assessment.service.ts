import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssessmentData, AssessmentResult, UserDetails, Answer, Question, AssessmentTheme } from '../models/assessment.model';
import { Firestore, addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, setDoc, orderBy } from '@angular/fire/firestore';

import { AiService } from './ai.service';
// import { QUESTIONS } from './assessment-questions.data'; // Removed hardcoded import

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private assessmentDataSubject = new BehaviorSubject<AssessmentData>(this.getInitialData());
  public assessmentData$ = this.assessmentDataSubject.asObservable();

  // Start as false to block routing until we've checked for a session
  private initialized = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initialized.asObservable();

  // Saving state
  private _isSaving = new BehaviorSubject<boolean>(false);
  public isSaving$ = this._isSaving.asObservable();

  private _questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this._questionsSubject.asObservable();

  private firestore: Firestore = inject(Firestore);
  private currentDocId: string | null = null;
  private readonly STORAGE_KEY = 'currentAssessmentId';

  private themes: AssessmentTheme[] = [
    { id: 'data-publication', title: 'Data Publication Process', icon: '📊', description: 'Standards, governance, and risk management for data publication' },
    { id: 'data-literacy', title: 'Data Literacy and Skills', icon: '🎓', description: 'Training, expertise, and strategic skill development' },
    { id: 'customer-support', title: 'Customer Support and Engagement', icon: '🤝', description: 'Stakeholder engagement, documentation, and user support' },
    { id: 'investment', title: 'Investment and Financial Performance', icon: '💼', description: 'Funding, sustainability, and value measurement' },
    { id: 'strategic-oversight', title: 'Strategic Oversight', icon: '🎯', description: 'Strategy, governance, and data stewardship' }
  ];

  private questions: Question[] = [];

  constructor(
    private aiService: AiService
  ) {
    // Load questions dynamically
    this.loadQuestions();
  }

  private async loadQuestions() {
    try {
      console.log('Fetching questions from Firestore...');
      const q = query(collection(this.firestore, 'questions'), orderBy('id'));
      const querySnapshot = await getDocs(q);

      const loadedQuestions: Question[] = [];
      querySnapshot.forEach((doc) => {
        loadedQuestions.push(doc.data() as Question);
      });

      this.questions = loadedQuestions;
      this._questionsSubject.next(this.questions);
      console.log(`Loaded ${this.questions.length} questions from Firestore`);

      // Restore session if available
      this.checkPreviousSession();
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback or error handling could go here
      this.initialized.next(true); // Allow app to continue even if questions fail? likely not ideal but unblocks
    }
  }

  private async checkPreviousSession() {
    const savedId = localStorage.getItem(this.STORAGE_KEY);
    if (savedId) {
      console.log('Found previous session ID:', savedId);
      try {
        const docRef = doc(this.firestore, 'assessments', savedId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as AssessmentData;
          if (!data.completed) {
            this.currentDocId = savedId;
            this.assessmentDataSubject.next(data);
            console.log('Restored previous session');
          } else {
            // Cleanup completed session
            localStorage.removeItem(this.STORAGE_KEY);
          }
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
    // Signal that initialization is complete
    this.initialized.next(true);
  }

  /**
   * Seed questions to Firestore
   * Call this manually or from a component to populate the DB with the updated questions.
   */
  async seedFirestore() {
    console.log('Seeding questions to Firestore...');
    const questionsCollection = collection(this.firestore, 'questions');

    for (const q of this.questions) {
      try {
        await setDoc(doc(this.firestore, 'questions', q.id.toString()), q, { merge: true });
        console.log(`Seeded question ${q.id}`);
      } catch (error) {
        console.error(`Error seeding question ${q.id}:`, error);
      }
    }
    console.log('Seeding complete.');
  }

  private getInitialData(): AssessmentData {
    return {
      answers: [],
      currentStep: 0,
      completed: false,
      startTime: new Date()
    };
  }

  /**
   * Attempt to find an incomplete assessment for this email.
   * If found, load it and return true.
   */
  async resumeExistingAssessment(email: string): Promise<boolean> {
    try {
      const assessmentsRef = collection(this.firestore, 'assessments');
      const q = query(
        assessmentsRef,
        where('userDetails.emailAddress', '==', email.trim().toLowerCase()),
        where('completed', '==', false)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Take the most recent one if multiple exist (though ideally should be one)
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data() as AssessmentData;

        this.currentDocId = docSnap.id;
        this.assessmentDataSubject.next(data);

        // Also save to local storage for persistence
        localStorage.setItem(this.STORAGE_KEY, this.currentDocId);

        console.log('Resumed existing assessment:', this.currentDocId);
        return true;
      }
    } catch (error) {
      console.error('Error resuming assessment:', error);
    }
    return false;
  }

  async setUserDetails(userDetails: UserDetails): Promise<void> {
    const currentData = this.assessmentDataSubject.value;

    // Normalize email
    const normalizedUserDetails = {
      ...userDetails,
      emailAddress: userDetails.emailAddress.toLowerCase().trim()
    };

    const updatedData = {
      ...currentData,
      userDetails: normalizedUserDetails,
      startTime: currentData.startTime || new Date()
    };
    this.assessmentDataSubject.next(updatedData);
    await this.saveProgress(); // Async firestore, now awaited
  }

  hasUserDetails(): boolean {
    return !!this.assessmentDataSubject.value.userDetails;
  }

  setCurrentStep(step: number): void {
    const currentData = this.assessmentDataSubject.value;
    const updatedData = { ...currentData, currentStep: step };
    this.assessmentDataSubject.next(updatedData);
    this.saveProgress();
  }

  getCurrentStep(): number {
    return this.assessmentDataSubject.value.currentStep;
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  getThemes(): AssessmentTheme[] {
    return this.themes;
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  saveAnswer(questionId: number, selectedOption: string): void {
    const currentData = this.assessmentDataSubject.value;
    const currentAnswers = currentData.answers || [];

    // Check if answer exists
    const existingIndex = currentAnswers.findIndex(a => a.questionId === questionId);
    let updatedAnswers;

    const answer: Answer = {
      questionId,
      selectedOption,
      score: this.calculateScore(selectedOption)
    };

    if (existingIndex >= 0) {
      updatedAnswers = [...currentAnswers];
      updatedAnswers[existingIndex] = answer;
    } else {
      updatedAnswers = [...currentAnswers, answer];
    }

    const updatedData = {
      ...currentData,
      answers: updatedAnswers
    };

    this.assessmentDataSubject.next(updatedData);
    this.saveProgress();
  }

  private calculateScore(selectedOption: string): number {
    // Extract score from option string (e.g., "1. Initial - ..." => 1)
    const match = selectedOption.match(/^(\d+)\./);
    return match ? parseInt(match[1], 10) : 1;
  }

  getAnswer(questionId: number): Answer | undefined {
    const currentData = this.assessmentDataSubject.value;
    return currentData.answers?.find(a => a.questionId === questionId);
  }

  getProgressPercentage(): number {
    const totalQuestions = this.getTotalQuestions();
    const completedAnswers = this.assessmentDataSubject.value.answers.length;
    return Math.round((completedAnswers / totalQuestions) * 100);
  }

  getProgressText(): string {
    const totalQuestions = this.getTotalQuestions();
    const completedAnswers = this.assessmentDataSubject.value.answers.length;

    if (completedAnswers === 0) return 'Getting Started';
    if (completedAnswers < totalQuestions * 0.25) return 'Just Started';
    if (completedAnswers < totalQuestions * 0.5) return 'Making Progress';
    if (completedAnswers < totalQuestions * 0.75) return 'Halfway There';
    if (completedAnswers < totalQuestions) return 'Almost Complete';
    return 'Assessment Complete';
  }

  async completeAssessment(): Promise<AssessmentResult> {
    const currentData = this.assessmentDataSubject.value;

    // Mark as completed
    const completedData = {
      ...currentData,
      completed: true,
      endTime: new Date()
    };
    this.assessmentDataSubject.next(completedData);

    // Calculate results
    const results = await this.calculateResults(completedData);

    // Update state with results
    const finalData = {
      ...completedData,
      results
    };
    this.assessmentDataSubject.next(finalData);

    // Save to Firestore (final update)
    await this.saveProgress();

    // Clear local storage as we are done
    localStorage.removeItem(this.STORAGE_KEY);

    return results;
  }

  private async saveProgress(): Promise<void> {
    const currentData = this.assessmentDataSubject.value;
    // Don't save if we don't have user details yet
    if (!currentData.userDetails) return;

    this._isSaving.next(true);

    try {
      if (this.currentDocId) {
        console.log('Updating existing assessment:', this.currentDocId);
        const docRef = doc(this.firestore, 'assessments', this.currentDocId);
        // We only save the necessary fields to update state
        await updateDoc(docRef, { ...currentData });
      } else {
        console.log('Creating new assessment document');
        const assessmentCollection = collection(this.firestore, 'assessments');
        const docRef = await addDoc(assessmentCollection, {
          ...currentData,
          createdAt: new Date()
        });
        this.currentDocId = docRef.id;
        console.log('Created new assessment with ID:', this.currentDocId);
      }

      // Persist ID to local storage for refresh survival
      if (this.currentDocId) {
        localStorage.setItem(this.STORAGE_KEY, this.currentDocId);
        console.log('Saved to LocalStorage:', this.STORAGE_KEY, this.currentDocId);
      }

    } catch (error) {
      console.error('Failed to save assessment progress:', error);
      throw error; // Re-throw to alert caller
    } finally {
      this._isSaving.next(false);
    }
  }

  public calculateThemeScores(answers: Answer[]): { [theme: string]: number } {
    const themeScores: { [theme: string]: number } = {};

    this.themes.forEach(theme => {
      const themeQuestions = this.questions.filter(q => q.theme === theme.id);
      const themeAnswers = answers.filter(a =>
        themeQuestions.some(q => q.id === a.questionId)
      );

      if (themeAnswers.length > 0) {
        const averageScore = themeAnswers.reduce((sum, answer) => sum + answer.score, 0) / themeAnswers.length;
        themeScores[theme.id] = averageScore;
      } else {
        themeScores[theme.id] = 1;
      }
    });

    return themeScores;
  }

  private async calculateResults(data: AssessmentData): Promise<AssessmentResult> {
    const themeScores = this.calculateThemeScores(data.answers);

    // Calculate overall score
    const overallScore = Object.values(themeScores).reduce((sum, score) => sum + score, 0) / this.themes.length;

    // Determine maturity level
    const maturityLevel = this.getMaturityLevel(overallScore);

    // Generate recommendations using AI
    const aiResponse = await this.aiService.generateRecommendations(data, maturityLevel, themeScores);

    return {
      overallScore,
      themeScores,
      maturityLevel,
      recommendations: aiResponse.general,
      themeRecommendations: aiResponse.themes
    };
  }

  private getMaturityLevel(score: number): 'Beginner' | 'Developing' | 'Advanced' | 'Leading' | 'Optimizing' {
    if (score >= 4.5) return 'Optimizing';
    if (score >= 3.5) return 'Leading';
    if (score >= 2.5) return 'Advanced';
    if (score >= 1.5) return 'Developing';
    return 'Beginner';
  }

  resetAssessment(): void {
    this.assessmentDataSubject.next(this.getInitialData());
    this.currentDocId = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Clear only the stored user details (leave answers and progress intact)
   * Useful when you want the form to be empty on a fresh page load but keep answers.
   */
  clearUserDetails(): void {
    const currentData = this.assessmentDataSubject.value;
    const updatedData = { ...currentData };
    if (updatedData.userDetails) {
      delete (updatedData as any).userDetails;
    }
    this.assessmentDataSubject.next(updatedData);
  }
}