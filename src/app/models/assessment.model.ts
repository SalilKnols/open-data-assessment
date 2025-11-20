export interface UserDetails {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  organization: string;
}

export interface AssessmentTheme {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Question {
  id: number;
  theme: string;
  question: string;
  type: 'rating' | 'percentage' | 'frequency' | 'boolean' | 'multiple';
  options: string[];
}

export interface Answer {
  questionId: number;
  selectedOption: string;
  score: number;
}

export interface AssessmentResult {
  overallScore: number;
  themeScores: { [theme: string]: number };
  maturityLevel: 'Beginner' | 'Developing' | 'Advanced' | 'Leading' | 'Optimizing';
  recommendations: string[];
}

export interface AssessmentData {
  userDetails?: UserDetails;
  answers: Answer[];
  currentStep: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  results?: AssessmentResult;
}
