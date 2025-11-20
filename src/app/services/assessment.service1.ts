import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssessmentData, AssessmentResult, UserDetails, Answer, Question, AssessmentTheme } from '../models/assessment.model';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private assessmentDataSubject = new BehaviorSubject<AssessmentData>(this.getInitialData());
  public assessmentData$ = this.assessmentDataSubject.asObservable();

  private firestore: Firestore = inject(Firestore);

  private themes: AssessmentTheme[] = [
    {
      id: 'data-publication',
      title: 'Data Publication Process',
      icon: 'ðŸ“Š',
      description: 'Standards, governance, and risk management for data publication'
    },
    {
      id: 'data-literacy',
      title: 'Data Literacy and Skills',
      icon: 'ðŸŽ“',
      description: 'Training, expertise, and strategic skill development'
    },
    {
      id: 'customer-support',
      title: 'Customer Support and Engagement',
      icon: 'ðŸ¤',
      description: 'Stakeholder engagement, documentation, and user support'
    },
    {
      id: 'investment',
      title: 'Investment and Financial Performance',
      icon: 'ðŸ’¼',
      description: 'Funding, sustainability, and value measurement'
    },
    {
      id: 'strategic-oversight',
      title: 'Strategic Oversight',
      icon: 'ðŸŽ¯',
      description: 'Strategy, governance, and data stewardship'
    }
  ];

  private questions: Question[] = [
    // Data Publication Process (8 questions)
    {
      id: 1,
      theme: 'data-publication',
      question: 'How are datasets published and made accessible to the public?',
      type: 'rating',
      options: [
        '1. Initial - Datasets are published on an ad-hoc basis with no systematic process',
        '2. Repeatable - There is some consistency in data publication but processes vary',
        '3. Defined - Standard processes exist for publishing datasets consistently',
        '4. Managed - Comprehensive processes with clear accountability and monitoring',
        '5. Optimising - Advanced automated processes with continuous improvement and external collaboration'
      ]
    },
    {
      id: 2,
      theme: 'data-publication',
      question: 'Is there a clear and repeatable process for releasing data?',
      type: 'rating',
      options: [
        '1. Initial - No formal process exists for data release',
        '2. Repeatable - Basic processes exist but are not always followed',
        '3. Defined - Clear documented processes that are regularly followed',
        '4. Managed - Well-established processes with governance and quality controls',
        '5. Optimising - Mature processes with continuous improvement and stakeholder feedback integration'
      ]
    },
    {
      id: 3,
      theme: 'data-publication',
      question: 'How is the licensing of datasets managed?',
      type: 'rating',
      options: [
        '1. Initial - No consistent approach to data licensing',
        '2. Repeatable - Some datasets have licenses but approach is inconsistent',
        '3. Defined - Standard licensing approach applied to most datasets',
        '4. Managed - Comprehensive licensing strategy with clear guidelines',
        '5. Optimising - Advanced licensing management with automated processes and legal compliance'
      ]
    },
    {
      id: 4,
      theme: 'data-publication',
      question: 'Are datasets published using common standards?',
      type: 'rating',
      options: [
        '1. Initial - No standard formats or schemas used',
        '2. Repeatable - Some use of standards but inconsistently applied',
        '3. Defined - Regular use of recognized standards and formats',
        '4. Managed - Comprehensive standards compliance with quality assurance',
        '5. Optimising - Leading practice in standards adoption with community contribution'
      ]
    },
    {
      id: 5,
      theme: 'data-publication',
      question: 'How consistently are datasets managed?',
      type: 'rating',
      options: [
        '1. Initial - Dataset management is ad-hoc and inconsistent',
        '2. Repeatable - Some consistency but varies between datasets',
        '3. Defined - Standardized approach to dataset management',
        '4. Managed - Comprehensive management with monitoring and maintenance',
        '5. Optimising - Advanced dataset lifecycle management with automation'
      ]
    },
    {
      id: 6,
      theme: 'data-publication',
      question: 'How does the organisation manage risks associated with data publication?',
      type: 'rating',
      options: [
        '1. Initial - No formal risk management for data publication',
        '2. Repeatable - Basic risk awareness but inconsistent management',
        '3. Defined - Documented risk management processes for data publication',
        '4. Managed - Comprehensive risk management with regular assessment',
        '5. Optimising - Advanced risk management with predictive analytics and continuous monitoring'
      ]
    },
    {
      id: 7,
      theme: 'data-publication',
      question: 'How does the organisation address ethical considerations in its data practices?',
      type: 'rating',
      options: [
        '1. Initial - No formal consideration of ethical data practices',
        '2. Repeatable - Some awareness of ethics but inconsistent application',
        '3. Defined - Clear ethical guidelines for data practices',
        '4. Managed - Comprehensive ethical framework with oversight',
        '5. Optimising - Leading practice in data ethics with external recognition'
      ]
    },
    {
      id: 8,
      theme: 'data-publication',
      question: 'How does the organisation ensure compliance with international data standards and legal frameworks?',
      type: 'rating',
      options: [
        '1. Initial - Limited awareness of compliance requirements',
        '2. Repeatable - Basic compliance but not systematically managed',
        '3. Defined - Clear compliance processes for key requirements',
        '4. Managed - Comprehensive compliance management with regular audit',
        '5. Optimising - Leading compliance practices with proactive monitoring'
      ]
    },

    // Data Literacy and Skills (6 questions)
    {
      id: 9,
      theme: 'data-literacy',
      question: 'How does the organisation assess and support open data expertise?',
      type: 'rating',
      options: [
        '1. Initial - No systematic assessment of data expertise',
        '2. Repeatable - Basic skills assessment but limited support',
        '3. Defined - Regular assessment with structured support programs',
        '4. Managed - Comprehensive expertise development with clear pathways',
        '5. Optimising - Advanced capability management with external partnerships'
      ]
    },
    {
      id: 10,
      theme: 'data-literacy',
      question: 'How does the organisation encourage the growth of open data skills?',
      type: 'rating',
      options: [
        '1. Initial - No formal encouragement of data skills development',
        '2. Repeatable - Some support for skills development',
        '3. Defined - Regular programs to encourage skills growth',
        '4. Managed - Comprehensive skills development strategy',
        '5. Optimising - Leading practice in skills development with innovation programs'
      ]
    },
    {
      id: 11,
      theme: 'data-literacy',
      question: 'How does the organisation identify its data literacy and skills needs?',
      type: 'rating',
      options: [
        '1. Initial - No systematic identification of skills needs',
        '2. Repeatable - Basic needs assessment occasionally',
        '3. Defined - Regular assessment of skills gaps and needs',
        '4. Managed - Comprehensive skills needs analysis with strategic planning',
        '5. Optimising - Advanced skills forecasting with predictive capability'
      ]
    },
    {
      id: 12,
      theme: 'data-literacy',
      question: 'How are data literacy and skills driven strategically across the organisation?',
      type: 'rating',
      options: [
        '1. Initial - No strategic approach to data literacy',
        '2. Repeatable - Some strategic consideration but inconsistent',
        '3. Defined - Clear strategic approach to data literacy development',
        '4. Managed - Comprehensive strategic integration with business objectives',
        '5. Optimising - Leading strategic practice with measurable outcomes'
      ]
    },
    {
      id: 13,
      theme: 'data-literacy',
      question: 'How are opportunities for learning and development provided?',
      type: 'rating',
      options: [
        '1. Initial - Limited learning opportunities available',
        '2. Repeatable - Some learning opportunities but not systematic',
        '3. Defined - Regular learning and development programs',
        '4. Managed - Comprehensive learning strategy with multiple pathways',
        '5. Optimising - Advanced learning ecosystem with innovation and research'
      ]
    },
    {
      id: 14,
      theme: 'data-literacy',
      question: 'How does the organisation support teams with limited data expertise?',
      type: 'rating',
      options: [
        '1. Initial - No specific support for teams with limited expertise',
        '2. Repeatable - Basic support provided when requested',
        '3. Defined - Structured support programs for developing teams',
        '4. Managed - Comprehensive support with mentoring and resources',
        '5. Optimising - Advanced support with specialized programs and external partnerships'
      ]
    },

    // Customer Support and Engagement (9 questions)
    {
      id: 15,
      theme: 'customer-support',
      question: 'How does the organisation engage with stakeholders and build a community around open data?',
      type: 'rating',
      options: [
        '1. Initial - Limited stakeholder engagement',
        '2. Repeatable - Some engagement activities but inconsistent',
        '3. Defined - Regular stakeholder engagement with clear processes',
        '4. Managed - Comprehensive community building with active participation',
        '5. Optimising - Leading practice in community engagement with measurable impact'
      ]
    },
    {
      id: 16,
      theme: 'customer-support',
      question: 'How does the organisation prioritise and communicate its data releases?',
      type: 'rating',
      options: [
        '1. Initial - No systematic prioritization or communication',
        '2. Repeatable - Basic prioritization with limited communication',
        '3. Defined - Clear prioritization process with regular communication',
        '4. Managed - Comprehensive prioritization with strategic communication',
        '5. Optimising - Advanced prioritization with stakeholder-driven communication'
      ]
    },
    {
      id: 17,
      theme: 'customer-support',
      question: 'How does the organisation collaborate with others to improve open data practices?',
      type: 'rating',
      options: [
        '1. Initial - Limited collaboration with external parties',
        '2. Repeatable - Some collaboration but not systematic',
        '3. Defined - Regular collaboration with key partners',
        '4. Managed - Comprehensive collaboration strategy with multiple stakeholders',
        '5. Optimising - Leading collaboration with industry-wide impact'
      ]
    },
    {
      id: 18,
      theme: 'customer-support',
      question: 'How does the organisation support reusers of its data?',
      type: 'rating',
      options: [
        '1. Initial - No specific support for data reusers',
        '2. Repeatable - Basic support when requested',
        '3. Defined - Regular support services for data reusers',
        '4. Managed - Comprehensive support with multiple channels',
        '5. Optimising - Advanced support with proactive assistance and community building'
      ]
    },
    {
      id: 19,
      theme: 'customer-support',
      question: 'How does the organisation obtain feedback from reusers?',
      type: 'rating',
      options: [
        '1. Initial - No systematic feedback collection',
        '2. Repeatable - Basic feedback collection occasionally',
        '3. Defined - Regular feedback collection processes',
        '4. Managed - Comprehensive feedback system with analysis',
        '5. Optimising - Advanced feedback system with continuous improvement'
      ]
    },
    {
      id: 20,
      theme: 'customer-support',
      question: 'How are reuser metrics monitored and used to improve data and support?',
      type: 'rating',
      options: [
        '1. Initial - No monitoring of reuser metrics',
        '2. Repeatable - Basic metrics collected but not systematically used',
        '3. Defined - Regular metrics monitoring with some improvement actions',
        '4. Managed - Comprehensive metrics analysis with systematic improvement',
        '5. Optimising - Advanced analytics with predictive insights and optimization'
      ]
    },
    {
      id: 21,
      theme: 'customer-support',
      question: 'What level of documentation is provided with published datasets?',
      type: 'rating',
      options: [
        '1. Initial - Minimal or no documentation provided',
        '2. Repeatable - Basic documentation but inconsistent quality',
        '3. Defined - Standard documentation for all datasets',
        '4. Managed - Comprehensive documentation with quality assurance',
        '5. Optimising - Exceptional documentation with interactive elements and user guides'
      ]
    },
    {
      id: 22,
      theme: 'customer-support',
      question: 'How does the organisation ensure the quality and consistency of documentation?',
      type: 'rating',
      options: [
        '1. Initial - No quality control for documentation',
        '2. Repeatable - Basic quality checks occasionally',
        '3. Defined - Regular quality assurance for documentation',
        '4. Managed - Comprehensive quality management with standards',
        '5. Optimising - Advanced quality systems with continuous improvement'
      ]
    },
    {
      id: 23,
      theme: 'customer-support',
      question: 'How does the organisation gather feedback on documentation from reusers?',
      type: 'rating',
      options: [
        '1. Initial - No feedback collection on documentation',
        '2. Repeatable - Occasional feedback collection',
        '3. Defined - Regular feedback processes for documentation',
        '4. Managed - Comprehensive feedback system with improvement actions',
        '5. Optimising - Advanced feedback system with user experience optimization'
      ]
    },

    // Investment and Financial Performance (6 questions)
    {
      id: 24,
      theme: 'investment',
      question: 'How is funding managed for open data publication and its lifecycle?',
      type: 'rating',
      options: [
        '1. Initial - No dedicated funding for open data activities',
        '2. Repeatable - Basic funding allocated but not systematically managed',
        '3. Defined - Clear funding processes for open data lifecycle',
        '4. Managed - Comprehensive funding management with oversight',
        '5. Optimising - Advanced funding optimization with ROI measurement'
      ]
    },
    {
      id: 25,
      theme: 'investment',
      question: 'How does the organisation ensure long-term sustainability in open data publication and management?',
      type: 'rating',
      options: [
        '1. Initial - No consideration of long-term sustainability',
        '2. Repeatable - Basic sustainability planning',
        '3. Defined - Clear sustainability strategy for open data',
        '4. Managed - Comprehensive sustainability framework with monitoring',
        '5. Optimising - Leading sustainability practices with innovation funding'
      ]
    },
    {
      id: 26,
      theme: 'investment',
      question: 'How does the organisation address open data in procurement processes and contracts?',
      type: 'rating',
      options: [
        '1. Initial - Open data not considered in procurement',
        '2. Repeatable - Occasional consideration in procurement',
        '3. Defined - Regular inclusion of open data requirements',
        '4. Managed - Comprehensive procurement strategy including open data',
        '5. Optimising - Leading procurement practices with open data innovation'
      ]
    },
    {
      id: 27,
      theme: 'investment',
      question: 'How does the organisation quantify the value of its open data?',
      type: 'rating',
      options: [
        '1. Initial - No measurement of open data value',
        '2. Repeatable - Basic value measurement occasionally',
        '3. Defined - Regular value assessment with clear metrics',
        '4. Managed - Comprehensive value measurement with ROI analysis',
        '5. Optimising - Advanced value analytics with economic impact modeling'
      ]
    },
    {
      id: 28,
      theme: 'investment',
      question: 'How is the value of open data communicated to stakeholders and reusers?',
      type: 'rating',
      options: [
        '1. Initial - No communication of open data value',
        '2. Repeatable - Basic communication of value occasionally',
        '3. Defined - Regular communication of value to stakeholders',
        '4. Managed - Comprehensive value communication strategy',
        '5. Optimising - Advanced value storytelling with impact demonstration'
      ]
    },
    {
      id: 29,
      theme: 'investment',
      question: 'How does the organisation manage its rights to release and reuse data from contracts or partnerships?',
      type: 'rating',
      options: [
        '1. Initial - No systematic management of data rights',
        '2. Repeatable - Basic awareness of rights issues',
        '3. Defined - Clear processes for managing data rights',
        '4. Managed - Comprehensive rights management with legal oversight',
        '5. Optimising - Advanced rights management with proactive negotiation'
      ]
    },

    // Strategic Oversight (8 questions)
    {
      id: 30,
      theme: 'strategic-oversight',
      question: 'Does the organisation have a defined open data strategy?',
      type: 'rating',
      options: [
        '1. Initial - No formal open data strategy exists',
        '2. Repeatable - Basic strategic thinking but not documented',
        '3. Defined - Clear documented open data strategy',
        '4. Managed - Comprehensive strategy with implementation plans',
        '5. Optimising - Leading strategic approach with continuous evolution'
      ]
    },
    {
      id: 31,
      theme: 'strategic-oversight',
      question: 'Who is responsible for delivering the open data strategy?',
      type: 'rating',
      options: [
        '1. Initial - No clear responsibility for open data strategy',
        '2. Repeatable - Informal responsibility assignment',
        '3. Defined - Clear roles and responsibilities defined',
        '4. Managed - Comprehensive governance with accountability',
        '5. Optimising - Advanced governance with strategic leadership'
      ]
    },
    {
      id: 32,
      theme: 'strategic-oversight',
      question: 'How does the organisation measure the impact and alignment of the open data strategy?',
      type: 'rating',
      options: [
        '1. Initial - No measurement of strategy impact',
        '2. Repeatable - Basic measurement occasionally',
        '3. Defined - Regular measurement with clear metrics',
        '4. Managed - Comprehensive impact measurement and alignment assessment',
        '5. Optimising - Advanced analytics with strategic optimization'
      ]
    },
    {
      id: 33,
      theme: 'strategic-oversight',
      question: "How is the organisation's asset catalogue created and maintained?",
      type: 'rating',
      options: [
        '1. Initial - No systematic asset cataloguing',
        '2. Repeatable - Basic cataloguing with limited maintenance',
        '3. Defined - Regular cataloguing and maintenance processes',
        '4. Managed - Comprehensive asset management with automated processes',
        '5. Optimising - Advanced cataloguing with AI/ML and continuous discovery'
      ]
    },
    {
      id: 34,
      theme: 'strategic-oversight',
      question: 'How comprehensive is the asset catalogue and how is it managed?',
      type: 'rating',
      options: [
        '1. Initial - Limited or no asset catalogue',
        '2. Repeatable - Basic catalogue with some assets',
        '3. Defined - Comprehensive catalogue with regular updates',
        '4. Managed - Complete catalogue with governance and quality control',
        '5. Optimising - Leading catalogue practices with automated management'
      ]
    },
    {
      id: 35,
      theme: 'strategic-oversight',
      question: 'How is the asset catalogue used and applied within the organisation?',
      type: 'rating',
      options: [
        '1. Initial - Catalogue not actively used',
        '2. Repeatable - Basic use of catalogue for some decisions',
        '3. Defined - Regular use of catalogue in planning and operations',
        '4. Managed - Comprehensive integration with business processes',
        '5. Optimising - Advanced catalogue utilization with AI-driven insights'
      ]
    },
    {
      id: 36,
      theme: 'strategic-oversight',
      question: 'How well does the organisation understand and assign responsibilities for data stewardship?',
      type: 'rating',
      options: [
        '1. Initial - No clear understanding of data stewardship responsibilities',
        '2. Repeatable - Basic understanding with informal assignment',
        '3. Defined - Clear stewardship roles and responsibilities',
        '4. Managed - Comprehensive stewardship framework with accountability',
        '5. Optimising - Advanced stewardship with capability development'
      ]
    },
    {
      id: 37,
      theme: 'strategic-oversight',
      question: 'How does the organisation demonstrate and improve its commitment to responsible data stewardship?',
      type: 'rating',
      options: [
        '1. Initial - No demonstration of stewardship commitment',
        '2. Repeatable - Basic commitment with limited demonstration',
        '3. Defined - Clear commitment with regular demonstration',
        '4. Managed - Strong commitment with comprehensive improvement programs',
        '5. Optimising - Leading stewardship practices with external recognition'
      ]
    }
  ];

  constructor() {}

  private getInitialData(): AssessmentData {
    return {
      answers: [],
      currentStep: 0,
      completed: false,
      startTime: new Date()
    };
  }

  setUserDetails(userDetails: UserDetails): void {
    const currentData = this.assessmentDataSubject.value;
    const updatedData = {
      ...currentData,
      userDetails,
      startTime: currentData.startTime || new Date()
    };
    this.assessmentDataSubject.next(updatedData);
  }

  hasUserDetails(): boolean {
    return !!this.assessmentDataSubject.value.userDetails;
  }

  setCurrentStep(step: number): void {
    const currentData = this.assessmentDataSubject.value;
    const updatedData = { ...currentData, currentStep: step };
    this.assessmentDataSubject.next(updatedData);
  }

  getCurrentStep(): number {
    return this.assessmentDataSubject.value.currentStep;
  }

  getQuestions(): Question[] {
    return this.questions;
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  getThemes(): AssessmentTheme[] {
    return this.themes;
  }

  saveAnswer(questionId: number, selectedOption: string): void {
    const currentData = this.assessmentDataSubject.value;

    // Calculate score based on selected option (1-5)
    const score = this.calculateScore(selectedOption);

    // Remove existing answer for this question
    const filteredAnswers = currentData.answers.filter(a => a.questionId !== questionId);

    // Add new answer
    const newAnswer: Answer = {
      questionId,
      selectedOption,
      score
    };

    const updatedAnswers = [...filteredAnswers, newAnswer].sort((a, b) => a.questionId - b.questionId);

    const updatedData = {
      ...currentData,
      answers: updatedAnswers
    };

    this.assessmentDataSubject.next(updatedData);
  }

  private calculateScore(selectedOption: string): number {
    // Extract score from option string (e.g., "1. Initial - ..." => 1)
    const match = selectedOption.match(/^(\d+)\./);
    return match ? parseInt(match[1], 10) : 1;
  }

  getAnswer(questionId: number): Answer | undefined {
    return this.assessmentDataSubject.value.answers.find(a => a.questionId === questionId);
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
    const results = this.calculateResults(completedData);

    // Save to Firestore
    await this.saveAssessmentToFirestore(completedData, results);

    return results;
  }

  private async saveAssessmentToFirestore(data: AssessmentData, results: AssessmentResult): Promise<void> {
    try {
      const assessmentCollection = collection(this.firestore, 'assessments');
      await addDoc(assessmentCollection, {
        ...data,
        results,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Failed to save assessment to Firestore:', error);
    }
  }

  private calculateResults(data: AssessmentData): AssessmentResult {
    const themeScores: { [theme: string]: number } = {};

    // Calculate average score for each theme
    this.themes.forEach(theme => {
      const themeQuestions = this.questions.filter(q => q.theme === theme.id);
      const themeAnswers = data.answers.filter(a => 
        themeQuestions.some(q => q.id === a.questionId)
      );

      if (themeAnswers.length > 0) {
        const averageScore = themeAnswers.reduce((sum, answer) => sum + answer.score, 0) / themeAnswers.length;
        themeScores[theme.id] = averageScore;
      } else {
        themeScores[theme.id] = 1;
      }
    });

    // Calculate overall score
    const overallScore = Object.values(themeScores).reduce((sum, score) => sum + score, 0) / this.themes.length;

    // Determine maturity level
    const maturityLevel = this.getMaturityLevel(overallScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(themeScores, maturityLevel);

    return {
      overallScore,
      themeScores,
      maturityLevel,
      recommendations
    };
  }

  private getMaturityLevel(score: number): 'Beginner' | 'Developing' | 'Advanced' | 'Leading' | 'Optimizing' {
    if (score >= 4.5) return 'Optimizing';
    if (score >= 3.5) return 'Leading';
    if (score >= 2.5) return 'Advanced';
    if (score >= 1.5) return 'Developing';
    return 'Beginner';
  }

  private generateRecommendations(themeScores: { [theme: string]: number }, maturityLevel: string): string[] {
    const recommendations: string[] = [];

    // Find the lowest scoring themes for targeted recommendations
    const sortedThemes = Object.entries(themeScores).sort(([,a], [,b]) => a - b);

    // Add theme-specific recommendations for lowest scoring areas
    const lowestTheme = sortedThemes[0];
    if (lowestTheme) {
      const theme = this.themes.find(t => t.id === lowestTheme[0]);
      if (theme) {
        recommendations.push(`Focus on improving ${theme.title} - this is your lowest scoring area with significant potential for quick wins using NashTech templates.`);
      }
    }

    // Add maturity-level specific recommendations
    switch (maturityLevel) {
      case 'Beginner':
        recommendations.push('Establish foundational open data governance processes using NashTech accelerator templates for rapid implementation.');
        recommendations.push('Implement basic data publication workflows with NashTech proven patterns and automated quality checks.');
        recommendations.push('Build core team capabilities through NashTech mentorship programs and structured learning paths.');
        break;
      case 'Developing':
        recommendations.push('Standardize your data publication processes across the organization using NashTech accelerator frameworks.');
        recommendations.push('Implement comprehensive stakeholder engagement strategies with NashTech community building templates.');
        recommendations.push('Deploy automated data quality and compliance monitoring using NashTech observability tools.');
        break;
      case 'Advanced':
        recommendations.push('Scale your successful practices organization-wide using NashTech platform engineering approaches.');
        recommendations.push('Implement advanced analytics and user feedback systems with NashTech AI/ML accelerators.');
        recommendations.push('Develop innovation programs and external partnerships using NashTech collaboration frameworks.');
        break;
      case 'Leading':
        recommendations.push('Drive industry leadership through NashTech accelerated innovation and research programs.');
        recommendations.push('Implement advanced automation and AI-driven optimization using cutting-edge NashTech accelerators.');
        recommendations.push('Establish centers of excellence and knowledge sharing platforms with NashTech expertise.');
        break;
      case 'Optimizing':
        recommendations.push('Partner with NashTech to pioneer next-generation open data practices and industry standards.');
        recommendations.push('Lead market transformation through NashTech accelerated innovation and thought leadership.');
        recommendations.push('Develop breakthrough solutions and contribute to the open data ecosystem with NashTech R&D support.');
        break;
    }

    return recommendations;
  }

  resetAssessment(): void {
    this.assessmentDataSubject.next(this.getInitialData());
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