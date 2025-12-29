import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AssessmentData, AssessmentResult, UserDetails, Answer, Question, AssessmentTheme } from '../models/assessment.model';
import { Firestore, addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc } from '@angular/fire/firestore';

import { AiService } from './ai.service';

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

  private questions: Question[] = [
    // ========================================
    // THEME 1: DATA PUBLICATION PROCESS (17 questions)
    // ========================================

    // Sub-theme: Data release process (4 questions)
    {
      id: 1,
      theme: 'data-publication',
      question: 'How are datasets published and made accessible to the public?',
      type: 'rating',
      options: [
        '1. Initial - There is little or no open data available for public access.',
        '2. Repeatable - Data is published on an ad-hoc basis across multiple platforms or websites.',
        '3. Defined - A set of defined datasets is published on a regular schedule.',
        '4. Managed - Datasets are hosted on a managed platform with robust data management capabilities.',
        '5. Optimising - Datasets are automatically indexed in external data aggregation portals, ensuring seamless updates.'
      ],
      tip: "Focus on discoverability. **Initial/Repeatable:** Scattered files. **Defined:** Regular schedule. **Managed/Optimising:** Central portal with automation. Choose based on your *current* capability."
    },
    {
      id: 2,
      theme: 'data-publication',
      question: 'Is there a clear and repeatable process for releasing data?',
      type: 'rating',
      options: [
        '1. Initial - Data is published using ad-hoc, often manual processes.',
        '2. Repeatable - Certain teams or projects follow a defined, repeatable process for publishing data.',
        '3. Defined - There is a consistent, organisation-wide data release process, with a regular release cadence.',
        '4. Managed - All published datasets follow a standard organisational process for release.',
        '5. Optimising - The organisation tracks and measures metrics related to the release process, such as the time between updates.'
      ],
      tip: "Is there a 'playbook' for releasing data? **Initial/Repeatable:** Manual/Ad-hoc. **Defined:** Consistent organisation-wide process. **Managed/Optimising:** Measurable, standard metrics."
    },
    {
      id: 3,
      theme: 'data-publication',
      question: 'How is the licensing of datasets managed?',
      type: 'rating',
      options: [
        '1. Initial - Licensing is not addressed, leaving data open to viewing but not necessarily for reuse.',
        '2. Repeatable - Datasets are published under an open data licence, enabling both access and reuse.',
        '3. Defined - Licences include clear attribution statements, making it easy for others to reuse the data.',
        '4. Managed - Licences are accompanied by detailed documentation explaining what aspects of the dataset are covered, such as structure, format, or third-party content.',
        '5. Optimising - New technologies, such as AI, are assessed for their impact on licensing, ensuring compatibility and evaluating emerging risks.'
      ],
      tip: "Licensing determines reuse. **Initial:** No license (risky). **Repeatable:** Open license used sometimes. **Defined:** Clear attribution. **Managed:** Detailed documentation. **Optimising:** AI-ready licensing."
    },
    {
      id: 4,
      theme: 'data-publication',
      question: 'How are dataset updates managed?',
      type: 'rating',
      options: [
        '1. Initial - Datasets are rarely, if ever, updated once published.',
        '2. Repeatable - Some datasets are updated according to a predefined schedule.',
        '3. Defined - Datasets are updated regularly, with updates following a published timetable.',
        '4. Managed - Archived versions of key datasets are maintained to support historical analysis and comparisons.',
        '5. Optimising - Reports provide insights into dataset sustainability, highlighting stale datasets and emerging risks.'
      ],
      tip: "Stale data loses value. **Initial:** Rare updates. **Defined:** Reguar published timetable. **Managed:** Historical archives maintained. **Optimising:** Automated sustainability reports."
    },

    // Sub-theme: Standards development and adoption (4 questions)
    {
      id: 5,
      theme: 'data-publication',
      question: 'Are datasets published using common standards?',
      type: 'rating',
      options: [
        '1. Initial - Datasets are not released using common standards.',
        '2. Repeatable - Some teams or projects have agreed on specific technical standards for formatting certain types of data.',
        '3. Defined - The organisation has defined a set of key technical data publishing standards, which include data formats and metadata schemas.',
        '4. Managed - All datasets are released in full conformance with the organisation\'s technical standards.',
        '5. Optimising - The organisation monitors technology trends to ensure datasets are released according to evolving standards and best practices.'
      ],
      tip: "Standards ensure interoperability. **Initial:** No standards. **Defined:** Key technical standards defined. **Managed:** Full conformance for all datasets. **Optimising:** Evolving with tech trends."
    },
    {
      id: 6,
      theme: 'data-publication',
      question: 'How are data formats and accessibility managed?',
      type: 'rating',
      options: [
        '1. Initial - Data is available in various formats with no standardisation or quality control.',
        '2. Repeatable - Data is made available in structured formats that are easy for humans to reuse (eg XLS, CSV).',
        '3. Defined - Most datasets are machine-readable and use standardised column headings and lookup tables for clarity.',
        '4. Managed - Datasets are released in open, non-proprietary formats (eg CSV, JSON) and include well-structured metadata.',
        '5. Optimising - Datasets are formatted to be AI/ML-ready, following advanced standards for machine readability.'
      ],
      tip: "Format matters. **Initial:** PDFs/Images. **Repeatable:** Excel/CSV. **Defined:** Standardized headers. **Managed:** Open formats (JSON/CSV) with metadata. **Optimising:** Machine-readable & AI-ready."
    },
    {
      id: 7,
      theme: 'data-publication',
      question: 'Is metadata consistently applied to datasets?',
      type: 'rating',
      options: [
        '1. Initial - Metadata is not gathered or published alongside datasets.',
        '2. Repeatable - Some metadata is gathered and published, but the quality and completeness are inconsistent.',
        '3. Defined - Metadata is well-structured and adheres to the same quality standards as the data itself.',
        '4. Managed - Metadata follows open standards such as DCAT, ensuring consistency with other datasets.',
        '5. Optimising - The organisation uses open standards for both data and metadata, ensuring alignment with other sources.'
      ],
      tip: "Metadata helps people find data. **Initial:** None. **Repeatable:** Inconsistent. **Defined:** Key datasets have quality metadata. **Managed:** Uses standards like DCAT. **Optimising:** Linked open data."
    },
    {
      id: 8,
      theme: 'data-publication',
      question: 'How is the process of standards management handled within the organisation?',
      type: 'rating',
      options: [
        '1. Initial - There is no defined process for managing data standards.',
        '2. Repeatable - Standards are driven by internal priorities with limited consideration for external data reusers.',
        '3. Defined - A formal process for data standards management has been defined and is consistently followed across the organisation.',
        '4. Managed - The organisation has a strategic approach for managing data standards and is beginning to adopt open standards.',
        '5. Optimising - The organisation optimises its data standards management process by monitoring new technologies and ensuring compatibility with emerging use cases such as AI/ML.'
      ],
      tip: "How do you pick standards? **Initial:** No process. **Defined:** Formal process followed consistently. **Managed:** Strategic approach. **Optimising:** Proactive scan for new tech/AI needs."
    },

    // Sub-theme: Data management and governance (4 questions)
    {
      id: 9,
      theme: 'data-publication',
      question: 'How consistently are datasets managed?',
      type: 'rating',
      options: [
        '1. Initial - Datasets are not managed in any consistent way.',
        '2. Repeatable - Specific teams or projects have begun defining their own lightweight data management processes that are used in an ad hoc manner.',
        '3. Defined - The organisation has defined standard data management processes, applied to high-value datasets.',
        '4. Managed - Standard data management processes are applied to all datasets, with the flexibility to tailor processes for specific projects.',
        '5. Optimising - The organisation continually monitors and improves its data management processes, ensuring they are optimised for changing needs.'
      ],
      tip: "Consistency is key. **Initial:** None. **Repeatable:** Ad hoc by team. **Defined:** Standard process for high-value data. **Managed:** Standard process for *all* data. **Optimising:** Continuous improvement."
    },
    {
      id: 10,
      theme: 'data-publication',
      question: 'Is ownership of datasets clearly defined?',
      type: 'rating',
      options: [
        '1. Initial - There is no clear ownership around internal datasets.',
        '2. Repeatable - Specific individuals or teams are informally responsible for certain datasets, but this is not clearly documented.',
        '3. Defined - Each dataset has a well-defined owner, responsible for managing the data throughout its lifecycle.',
        '4. Managed - Ownership is clearly documented for all datasets and regularly reviewed to ensure accountability throughout the data lifecycle.',
        '5. Optimising - Ownership structures are fully integrated into the organisation\'s data governance framework, ensuring that changes in ownership or responsibility are automatically tracked and updated.'
      ],
      tip: "Clear responsibility prevents decay. **Initial:** Unknown. **Defined:** Each dataset has an owner. **Managed:** Documented & reviewed. **Optimising:** Integrated into governance & automated tracking."
    },
    {
      id: 11,
      theme: 'data-publication',
      question: 'How is data quality monitored and maintained?',
      type: 'rating',
      options: [
        '1. Initial - Data quality is not actively monitored, and no formal process exists for ensuring data accuracy or completeness.',
        '2. Repeatable - Some datasets are reviewed for quality, but processes are inconsistent and reactive.',
        '3. Defined - High-value datasets are regularly monitored for quality, and issues are addressed as they arise.',
        '4. Managed - Data quality for all datasets is actively monitored with clear guidelines for addressing quality issues, based on feedback from both internal and external users.',
        '5. Optimising - Data quality is proactively improved, with regular assessments and collaboration with external reusers to ensure datasets meet evolving needs and standards.'
      ],
      tip: "Quality isn't accidental. **Initial:** No checks. **Repeatable:** Reactive fixes. **Defined:** Regular checks on high-value data. **Managed:** Active monitoring & clear guidelines. **Optimising:** Collaborative improvement."
    },
    {
      id: 12,
      theme: 'data-publication',
      question: 'How is open data governance integrated into the organisation\'s processes?',
      type: 'rating',
      options: [
        '1. Initial - There is no formal governance process for managing open data.',
        '2. Repeatable - Specific teams have informal governance processes for releasing open data, but these are inconsistent across the organisation.',
        '3. Defined - The organisation has established a governance framework for managing open data releases, applied to key datasets.',
        '4. Managed - The open data governance framework is applied to all datasets, ensuring consistent practices and monitoring.',
        '5. Optimising - The organisation continuously improves its open data governance, incorporating feedback from reusers and monitoring the impact of its data releases.'
      ],
      tip: "Governance sets the rules. **Initial:** None. **Defined:** Framework for key datasets. **Managed:** Framework for *all* datasets. **Optimising:** Feedback-driven evolution."
    },

    // Sub-theme: Compliance and risk (5 questions)
    {
      id: 13,
      theme: 'data-publication',
      question: 'How does the organisation manage risks associated with data publication?',
      type: 'rating',
      options: [
        '1. Initial - The organisation recognises that there may be risks associated with data, but has not yet defined any processes for assessing and mitigating them.',
        '2. Repeatable - The organisation has begun assessing risks associated with some datasets, but the process is informal and not yet documented across the board.',
        '3. Defined - Processes for assessing and mitigating risks are defined and documented. These processes are applied routinely to high-value datasets.',
        '4. Managed - Risk management is fully integrated into the data governance process. All datasets undergo a risk assessment before publication, and mitigation strategies such as anonymisation and aggregation are employed where needed.',
        '5. Optimising - The organisation has a comprehensive risk management framework in place, including advanced Privacy Enhancing Technologies (PETs) and external validation for high-risk datasets. The process is transparent and linked to published risk registers.'
      ],
      tip: "Risk management is vital. **Initial:** Ad hoc. **Defined:** Mitigation processes defined. **Managed:** Integrated into governance; all datasets assessed. **Optimising:** Advanced PETs & external validation."
    },
    {
      id: 14,
      theme: 'data-publication',
      question: 'How are datasets containing personal or sensitive information handled?',
      type: 'rating',
      options: [
        '1. Initial - There is no formal process in place for handling datasets containing personal or sensitive information, and no risk assessment is conducted before data release.',
        '2. Repeatable - The organisation regularly evaluates the risks and benefits of releasing datasets containing personal or sensitive information, with informal methods for anonymisation or aggregation.',
        '3. Defined - Standard processes for anonymising or aggregating personal or sensitive information are defined and applied to most datasets. Consent or lawful basis for releasing personal data is obtained where necessary.',
        '4. Managed - All datasets containing personal or sensitive information are subject to strict anonymisation or aggregation processes, with advanced techniques used for de-identification. Personal data is released only when fully compliant with legal frameworks.',
        '5. Optimising - The organisation employs cutting-edge techniques for safeguarding personal data, including the use of Privacy Enhancing Technologies (PETs) and routinely monitors new privacy risks. A published open data triage process is in place and includes full transparency on how personal data is handled.'
      ],
      tip: "Protecting privacy is non-negotiable. **Initial:** Ad hoc removal. **Defined:** Standard anonymisation processes. **Managed:** Strict aggregation & de-identification. **Optimising:** Cutting-edge privacy tech (PETs) & transparent triage."
    },
    {
      id: 15,
      theme: 'data-publication',
      question: 'How does the organisation address ethical considerations in its data practices?',
      type: 'rating',
      options: [
        '1. Initial - Ethics is not formally considered in the organisation\'s data practices or publication processes.',
        '2. Repeatable - Specific teams or individuals within the organisation are aware of ethical concerns but there is no standardised process for addressing them.',
        '3. Defined - The organisation has developed a standard process for addressing ethical considerations in its data practices, which includes evaluating the potential consequences of data publication.',
        '4. Managed - Ethics is embedded into the data governance process, with routine evaluations of the ethical implications of data releases. Feedback loops are established to address any ethical concerns raised by stakeholders or reusers.',
        '5. Optimising - The organisation takes a proactive approach to ethics, regularly reviewing and updating its ethical guidelines. Ethics is treated on par with legal compliance, and the organisation considers the long-term societal impact of its data releases, including the ethical implications of AI/ML use cases.'
      ],
      tip: "Ethics goes beyond law. **Initial:** Ad hoc. **Defined:** Standard process for consequences. **Managed:** Ethics embedded in governance. **Optimising:** Proactive reviews, including AI implications."
    },
    {
      id: 16,
      theme: 'data-publication',
      question: 'How does the organisation ensure compliance with international data standards and legal frameworks?',
      type: 'rating',
      options: [
        '1. Initial - The organisation has little awareness or knowledge of relevant international standards or legal frameworks relating to data publication.',
        '2. Repeatable - The organisation has begun assessing its compliance with some international standards and legal frameworks, but the process is informal.',
        '3. Defined - The organisation has developed processes to ensure compliance with key international standards and legal frameworks. These processes are applied to high-value datasets.',
        '4. Managed - The organisation routinely monitors compliance with international standards and legal frameworks, and has processes in place to ensure compliance across all datasets.',
        '5. Optimising - The organisation actively monitors the changing regulatory landscape and ensures that all datasets comply with the most up-to-date standards and legal requirements. Compliance is externally validated where necessary.'
      ],
      tip: "Laws change. **Initial:** Ad hoc compliance. **Defined:** Processes for high-value data. **Managed:** Routine monitoring & compliance for *all* data. **Optimising:** Active regulatory monitoring & external validation."
    },
    {
      id: 17,
      theme: 'data-publication',
      question: 'How transparent is the organisation\'s risk management process?',
      type: 'rating',
      options: [
        '1. Initial - There is no transparency around the organisation\'s risk management process, and the public has no insight into the risks associated with published datasets.',
        '2. Repeatable - Some information about the risks associated with data publication is available internally, but this information is not made public.',
        '3. Defined - The organisation publishes a risk register for key datasets, outlining potential risks and mitigation strategies. However, this register is incomplete.',
        '4. Managed - A comprehensive risk register is published and regularly updated, with detailed mitigation strategies for each dataset. The organisation is transparent about how risks are assessed and managed.',
        '5. Optimising - The organisation\'s risk management process is fully transparent, with regular updates to the risk register and the inclusion of feedback from external stakeholders. The risk register is linked to the organisation\'s open data triage process and is accessible to the public.'
      ],
      tip: "Transparency builds trust. **Initial:** No register. **Defined:** Published register for key data. **Managed:** Comprehensive, updated register. **Optimising:** Fully transparent & public process."
    },

    // ========================================
    // THEME 2: DATA LITERACY AND SKILLS (6 questions)
    // ========================================

    // Sub-theme: Open data expertise (2 questions)
    {
      id: 18,
      theme: 'data-literacy',
      question: 'How does the organisation assess and support open data expertise?',
      type: 'rating',
      options: [
        '1. Initial - Current open data activities rely on the knowledge of a small number of stakeholders, with no formal strategy for expanding this expertise.',
        '2. Repeatable - Data professionals are embedded in teams, but there is no centralised strategy to develop open data expertise across the organisation.',
        '3. Defined - Open data expertise is centralised in a few key individuals or teams, and the organisation partners with external specialists when required.',
        '4. Managed - There is a centralised open data team or network of experts, with clear roles and responsibilities defined across teams to support open data initiatives.',
        '5. Optimising - The organisation fosters open data expertise across all levels, including external networks and partnerships that advance open data practices globally.'
      ],
      tip: "Don't rely on one hero. **Initial:** Ad hoc. **Defined:** Centralised experts. **Managed:** Official central team/network. **Optimising:** Expertise fostered at *all* levels & externally."
    },
    {
      id: 19,
      theme: 'data-literacy',
      question: 'How does the organisation encourage the growth of open data skills?',
      type: 'rating',
      options: [
        '1. Initial - There are no formal training or mentoring programmes related to open data.',
        '2. Repeatable - Training around open data is provided on an ad-hoc basis, driven by the needs of specific projects.',
        '3. Defined - Internal open data experts mentor and support others, and there are growing training opportunities for staff.',
        '4. Managed - Open data awareness and training are a standard part of staff development, and mentorship programmes are well established.',
        '5. Optimising - Open data training is embedded across all roles and is tailored to individual needs, with an active internal and external mentoring network.'
      ],
      tip: "Train your people. **Initial:** None. **Repeatable:** Ad hoc. **Defined:** Growing opportunities. **Managed:** Standard training for staff. **Optimising:** Tailored training & active mentoring."
    },

    // Sub-theme: Understanding learning needs (2 questions)
    {
      id: 20,
      theme: 'data-literacy',
      question: 'How does the organisation identify its data literacy and skills needs?',
      type: 'rating',
      options: [
        '1. Initial - There is no formal process for identifying data literacy and skills needs within the organisation.',
        '2. Repeatable - Some teams and individuals have identified their learning needs, but there is no organisation-wide analysis or process.',
        '3. Defined - The organisation has undertaken a learning needs analysis and has identified key areas where data literacy and skills need improvement.',
        '4. Managed - The organisation conducts a structured learning needs analysis on a regular basis, identifying gaps in data literacy and aligning them with strategic objectives.',
        '5. Optimising - The organisation continuously evaluates data literacy needs, aligning them with future business needs, and tracks how learning impacts organisational performance.'
      ],
      tip: "Know what you need. **Initial:** Unknown. **Defined:** Analysis done once. **Managed:** Regular structured analysis. **Optimising:** Continuous evaluation aligned with strategy."
    },
    {
      id: 21,
      theme: 'data-literacy',
      question: 'How are opportunities for learning and development provided?',
      type: 'rating',
      options: [
        '1. Initial - There are limited or no opportunities for learning about data skills and literacy within the organisation.',
        '2. Repeatable - Learning resources are available, but they are often ad-hoc and focus on specific projects rather than broader organisational needs.',
        '3. Defined - The organisation provides some structured learning opportunities, focusing on developing core data skills across teams.',
        '4. Managed - The organisation has well-defined learning programmes, and staff are actively encouraged to take part in data literacy training aligned with strategic goals.',
        '5. Optimising - Learning and development programmes are fully embedded, with tailored opportunities available for all staff to continuously improve their data literacy and skills.'
      ],
      tip: "Learning culture. **Initial:** None. **Repeatable:** Employee-driven. **Defined:** Some structured opportunities. **Managed:** Well-defined programmes. **Optimising:** Fully embedded for all staff."
    },

    // Sub-theme: Strategic data skills and literacy (2 questions)
    {
      id: 22,
      theme: 'data-literacy',
      question: 'How are data literacy and skills driven strategically across the organisation?',
      type: 'rating',
      options: [
        '1. Initial - There is no strategic ownership of data literacy and skills development within the organisation.',
        '2. Repeatable - The organisation has appointed a strategic owner for data literacy, but efforts are limited to tool-specific training (eg Excel).',
        '3. Defined - The organisation provides internal training for data literacy, though it is still generic and not linked to specific job roles or strategic goals.',
        '4. Managed - Data literacy and skills are embedded into performance reviews, and the organisation actively drives data literacy as a key strategic focus.',
        '5. Optimising - The organisation continuously aligns its data literacy and skills development with broader strategic objectives, tracking KPIs and regularly adjusting its approach to meet future business needs.'
      ],
      tip: "Align skills with strategy. **Initial:** No. **Defined:** Generic training. **Managed:** Embedded in reviews & strategy. **Optimising:** KPIs tracked & adjusted for future needs."
    },
    {
      id: 23,
      theme: 'data-literacy',
      question: 'How does the organisation support teams with limited data expertise?',
      type: 'rating',
      options: [
        '1. Initial - Teams with limited data expertise have no formal support for building skills or accessing data literacy resources.',
        '2. Repeatable - Some teams with limited data expertise are supported by ad-hoc resources, such as project-based training or external consultants.',
        '3. Defined - Teams with limited data expertise are supported by centrally managed resources, such as data champions or dedicated data professionals.',
        '4. Managed - There is a clear support structure in place for teams with limited data expertise, including access to mentors, training programmes, and centrally managed data teams.',
        '5. Optimising - The organisation provides tailored, continuous support to teams with limited data expertise, ensuring they are fully integrated into data-driven projects and have access to the necessary skills and resources.'
      ],
      tip: "Support the non-experts. **Initial:** None. **Defined:** Central resources. **Managed:** Mentors & clear structure. **Optimising:** Tailored, continuous support integrated into projects."
    },

    // ========================================
    // THEME 3: CUSTOMER SUPPORT AND ENGAGEMENT (9 questions)
    // ========================================

    // Sub-theme: Engagement and community building (3 questions)
    {
      id: 24,
      theme: 'customer-support',
      question: 'How does the organisation engage with stakeholders and build a community around open data?',
      type: 'rating',
      options: [
        '1. Initial - There is no systematic attempt to identify potential reusers, and communication with stakeholders is informal or absent.',
        '2. Repeatable - Some teams engage with stakeholders on an ad-hoc basis, but information about reusers and stakeholders is siloed.',
        '3. Defined - Stakeholders are regularly identified and mapped, and there is a process for engaging them across different data releases.',
        '4. Managed - The organisation proactively seeks to engage stakeholders before and after data releases, using feedback to improve future publications.',
        '5. Optimising - There is a comprehensive stakeholder engagement strategy linked to organisational goals, and the organisation actively builds and nurtures an external community of reusers.'
      ],
      tip: "Engage your users. **Initial:** No engagement. **Repeatable:** Ad hoc. **Defined:** Stakeholders identified. **Managed:** Proactive engagement. **Optimising:** Community building linked to goals."
    },
    {
      id: 25,
      theme: 'customer-support',
      question: 'How does the organisation prioritise and communicate its data releases?',
      type: 'rating',
      options: [
        '1. Initial - Data releases are driven by short-term internal priorities with little communication to external stakeholders.',
        '2. Repeatable - Some data releases are based on external demands, but there is no clear, coordinated process for prioritising publications.',
        '3. Defined - Data releases are driven by reuser demand, with a process in place for stakeholders to request datasets.',
        '4. Managed - The organisation\'s data release strategy is communicated clearly to stakeholders, with a repeatable process to guide engagement and publication.',
        '5. Optimising - Data release priorities are informed by continuous dialogue with the community, and the organisation monitors and adjusts its strategy based on feedback and impact assessments.'
      ],
      tip: "Publish what users want. **Initial:** Internal drivers only. **Defined:** Response to demand. **Managed:** Clear strategy communicated. **Optimising:** Continuous dialogue & impact-based adjustments."
    },
    {
      id: 26,
      theme: 'customer-support',
      question: 'How does the organisation collaborate with others to improve open data practices?',
      type: 'rating',
      options: [
        '1. Initial - The organisation has little or no collaboration with other organisations regarding open data.',
        '2. Repeatable - There is some ad-hoc collaboration with peer organisations within the same sector to share knowledge about open data.',
        '3. Defined - The organisation is engaged in sector-wide efforts to improve open data practices and supports external initiatives reactively.',
        '4. Managed - The organisation plays an active role in sector-level collaborations to advance open data practices, contributing proactively to cross-organisational efforts.',
        '5. Optimising - The organisation leads sector-level initiatives to advance open data, establishing best practices and fostering innovation through challenges, partnerships, and dedicated engagement groups.'
      ],
      tip: "Go beyond your walls. **Initial:** Isolated. **Defined:** Engaged in efforts. **Managed:** Active contributor. **Optimising:** Leader in sector initiatives & innovation."
    },

    // Sub-theme: Reuser support processes (3 questions)
    {
      id: 27,
      theme: 'customer-support',
      question: 'How does the organisation support reusers of its data?',
      type: 'rating',
      options: [
        '1. Initial - There is no formal support for reusers, and individuals must find their own ways to access help.',
        '2. Repeatable - Some reusers can access ad-hoc support, but there are no centralised processes for providing help.',
        '3. Defined - A central support team exists, and reusers are provided with clear contact points to seek help regarding datasets.',
        '4. Managed - The organisation actively promotes its support offerings, providing clear expectations (eg response times) and fostering open communication through multiple channels (eg forums, social media).',
        '5. Optimising - The organisation measures the effectiveness of its support operations, ensuring reusers receive prompt responses and issues are addressed swiftly, using feedback to improve support processes.'
      ],
      tip: "Be responsive. **Initial:** Ad hoc. **Defined:** Central contact point. **Managed:** Active promotion & clear SLAs. **Optimising:** Measured effectiveness & swift resolution."
    },
    {
      id: 28,
      theme: 'customer-support',
      question: 'How does the organisation obtain feedback from reusers?',
      type: 'rating',
      options: [
        '1. Initial - There is no systematic way to collect feedback from reusers, and issues are not actively monitored or addressed.',
        '2. Repeatable - Individual teams collect feedback on an ad-hoc basis, but this is not shared or coordinated across the organisation.',
        '3. Defined - Feedback is collected through formal channels, such as user forums, and there is a process for addressing issues that arise.',
        '4. Managed - Reusers\' feedback is routinely captured, analysed, and used to drive improvements in datasets and support processes.',
        '5. Optimising - Feedback collection is embedded into the organisation\'s processes, and the organisation routinely collaborates with reusers to enhance the quality and usefulness of its datasets and support services.'
      ],
      tip: "Listen to users. **Initial:** No channel. **Defined:** Formal channels exits. **Managed:** Routine analysis. **Optimising:** Embedded collaboration for improvement."
    },
    {
      id: 29,
      theme: 'customer-support',
      question: 'How are reuser metrics monitored and used to improve data and support?',
      type: 'rating',
      options: [
        '1. Initial - There is no monitoring of how reusers interact with datasets or the support process.',
        '2. Repeatable - Some metrics are collected, but these are sporadic and focus on a limited number of datasets.',
        '3. Defined - Metrics on reuser interactions are collected routinely, and they are analysed to inform improvements in data publication and user support.',
        '4. Managed - Metrics are captured in an automated and structured way, providing insights into the impact of datasets and the efficiency of support operations.',
        '5. Optimising - Reuser metrics are continuously monitored, with insights driving strategic improvements in both data quality and user support services. Feedback loops ensure ongoing optimisation of the process.'
      ],
      tip: "Measure success. **Initial:** None. **Repeatable:** Ad hoc. **Defined:** Routine collection. **Managed:** Automated & structured. **Optimising:** Continuous monitoring driving strategy."
    },

    // Sub-theme: Open data documentation (3 questions)
    {
      id: 30,
      theme: 'customer-support',
      question: 'What level of documentation is provided with published datasets?',
      type: 'rating',
      options: [
        '1. Initial - Datasets are released with little or no supporting documentation.',
        '2. Repeatable - The level of documentation provided is inconsistent and depends on individual efforts.',
        '3. Defined - A standard set of documentation and metadata is defined, but it is only applied to some datasets, typically high-value ones.',
        '4. Managed - All datasets are released with a standard set of supporting documentation and metadata using established templates.',
        '5. Optimising - The organisation routinely provides comprehensive documentation and high-quality metadata for all datasets.'
      ],
      tip: "Documentation is key. **Initial:** Little/none. **Defined:** Standard templates for some data. **Managed:** Standard for *all* data. **Optimising:** Comprehensive & high-quality for all."
    },
    {
      id: 31,
      theme: 'customer-support',
      question: 'How does the organisation ensure the quality and consistency of documentation?',
      type: 'rating',
      options: [
        '1. Initial - There are no established processes to ensure the quality or consistency of documentation across datasets.',
        '2. Repeatable - Some teams have started using templates or guidelines to create documentation, but these are applied inconsistently.',
        '3. Defined - The organisation has developed a standard approach for documentation, but not all datasets conform to these standards.',
        '4. Managed - All datasets conform to an established documentation process, and this process is integrated into the data publishing workflow.',
        '5. Optimising - Supporting documentation and metadata creation are fully integrated into the publishing process and regularly reviewed for consistency.'
      ],
      tip: "Apply standards. **Initial:** Inconsistent. **Defined:** Standard approach exists. **Managed:** Integrated process. **Optimising:** Fully integrated & reviewed for consistency."
    },
    {
      id: 32,
      theme: 'customer-support',
      question: 'How does the organisation gather feedback on documentation from reusers?',
      type: 'rating',
      options: [
        '1. Initial - There is no formal process for gathering feedback on documentation from reusers.',
        '2. Repeatable - Some reusers provide feedback informally, but there is no systematic approach to gathering or addressing their input.',
        '3. Defined - A formal process is in place for reusers to provide feedback on documentation, and this is occasionally used to make improvements.',
        '4. Managed - The organisation actively seeks feedback from reusers on documentation, and improvements are regularly made based on their input.',
        '5. Optimising - Reusers are encouraged to contribute to the improvement of documentation, and the organisation promotes the use of third-party resources and tools to supplement its documentation.'
      ],
      tip: "Improve with help. **Initial:** Ad hoc. **Defined:** Formal process. **Managed:** Active solicitation. **Optimising:** Community contributions encouraged."
    },

    // ========================================
    // THEME 4: INVESTMENT AND FINANCIAL PERFORMANCE (6 questions)
    // ========================================

    // Sub-theme: Financial oversight and procurement (4 questions)
    {
      id: 33,
      theme: 'investment',
      question: 'How is funding managed for open data publication and its lifecycle?',
      type: 'rating',
      options: [
        '1. Initial - Data releases are unfunded and handled as exceptional, unplanned expenditure.',
        '2. Repeatable - Individual projects include open data publication costs as part of their specific project budget, without considering longer-term costs.',
        '3. Defined - Project funding includes long-term costs for open data publication, and responsibility for these costs is explicitly assigned to roles within the organisation.',
        '4. Managed - The organisation actively monitors the financial costs and benefits of open data publication as part of ongoing data governance processes.',
        '5. Optimising - The organisation seeks efficiency savings and sustainability strategies in open data publication, optimising data management and reducing licensing overheads where possible.'
      ],
      tip: "Plan the costs. **Initial:** Ad hoc. **Defined:** Long-term costs in funding. **Managed:** Active cost/benefit monitoring. **Optimising:** Efficiency savings & sustainability strategies."
    },
    {
      id: 34,
      theme: 'investment',
      question: 'How does the organisation ensure long-term sustainability in open data publication and management?',
      type: 'rating',
      options: [
        '1. Initial - There is no long-term sustainability plan for the ongoing management of published open data.',
        '2. Repeatable - Open data is managed through short-term project funding without considering its long-term lifecycle.',
        '3. Defined - The organisation has a sustainability plan that includes budgeting for ongoing updates and management of key datasets.',
        '4. Managed - Sustainability planning is integrated into the organisation\'s data governance, ensuring consistent funding and updates for high-value datasets.',
        '5. Optimising - The organisation actively seeks external partnerships or additional funding streams to ensure the long-term sustainability of open data.'
      ],
      tip: "Secure the future. **Initial:** Short-term. **Defined:** Budgeting for updates. **Managed:** Integrated into governance. **Optimising:** External partnerships & funding streams."
    },
    {
      id: 35,
      theme: 'investment',
      question: 'How does the organisation address open data in procurement processes and contracts?',
      type: 'rating',
      options: [
        '1. Initial - Procurement processes and contracts do not address data supply, licensing, or reuse.',
        '2. Repeatable - The organisation seeks clarity around data rights retrospectively when it comes to procurement, in order to drive more open data adoption.',
        '3. Defined - Some procurement activities and contracts are tailored to address open data licensing and reuse, depending on project needs.',
        '4. Managed - The organisation includes standard clauses in contracts and procurement activities to ensure clarity around data rights and reuse.',
        '5. Optimising - All procurement processes and contracts include explicit reference to open data rights and reuse where applicable, and these are standard across all projects.'
      ],
      tip: "Buy wisely. **Initial:** Not considered. **Defined:** Used in some contracts. **Managed:** Standard clauses. **Optimising:** Explicit reference to open data rights in *all* contracts."
    },
    {
      id: 36,
      theme: 'investment',
      question: 'How does the organisation manage its rights to release and reuse data from contracts or partnerships?',
      type: 'rating',
      options: [
        '1. Initial - The organisation is unaware of its rights to release or reuse data resulting from contracts or partnerships.',
        '2. Repeatable - The organisation is beginning to clarify its rights to release data retrospectively, but this is done on a project-by-project basis.',
        '3. Defined - Clear processes are in place to ensure the organisation understands its rights to release and reuse data from contracts and partnerships.',
        '4. Managed - The organisation has an established process for ensuring that rights to release and reuse data are clear in all contracts and partnerships.',
        '5. Optimising - Rights management for open data is fully integrated into all procurement and partnership processes, ensuring clarity from the outset for all contracts.'
      ],
      tip: "Define your rights. **Initial:** Unclear. **Defined:** Clear processes. **Managed:** Established process for clarity. **Optimising:** Fully integrated into procurement."
    },

    // Sub-theme: Understanding the value of open data (2 questions)
    {
      id: 37,
      theme: 'investment',
      question: 'How does the organisation quantify the value of its open data?',
      type: 'rating',
      options: [
        '1. Initial - No attempt is made to quantify the value of published or reused datasets.',
        '2. Repeatable - The organisation carries out some qualitative reporting on the value of datasets, but it is largely described in general terms without standardisation.',
        '3. Defined - Valuation of datasets is done retrospectively, and the organisation uses qualitative methods across themes such as economic, social, and environmental benefits.',
        '4. Managed - The organisation has adopted a standardised approach for describing the value of its datasets, including quantitative methods for measuring ROI.',
        '5. Optimising - All datasets are consistently valued using standard methods, with the valuation used to guide strategic investment decisions.'
      ],
      tip: "Value the asset. **Initial:** Not valued. **Defined:** Retrospective/qualitative. **Managed:** Standardised/quantitative (ROI). **Optimising:** Standard methods guiding investment."
    },
    {
      id: 38,
      theme: 'investment',
      question: 'How is the value of open data communicated to stakeholders and reusers?',
      type: 'rating',
      options: [
        '1. Initial - There is no communication or reporting on the value of open data to internal or external stakeholders.',
        '2. Repeatable - Some general benefits of open data are communicated through qualitative reports, but there are no clear actionable insights.',
        '3. Defined - Periodic reports are shared on the value of open data, often with specific use cases or examples of reuse, demonstrating the value retrospectively.',
        '4. Managed - The organisation regularly publishes detailed reports on the value of its open data, including case studies, known reuses, and stakeholder feedback.',
        '5. Optimising - Reports are strategic and transparent, guiding future data releases and aligning with stakeholder needs. Feedback loops are established for ongoing improvement.'
      ],
      tip: "Show the value. **Initial:** Ad hoc. **Undefined:** Periodic reports. **Managed:** Detailed published reports. **Optimising:** Strategic, transparent & guiding future releases."
    },

    // ========================================
    // THEME 5: STRATEGIC OVERSIGHT (9 questions)
    // ========================================

    // Sub-theme: Open data strategy (3 questions)
    {
      id: 39,
      theme: 'strategic-oversight',
      question: 'Does the organisation have a defined open data strategy?',
      type: 'rating',
      options: [
        '1. Initial - The organisation has no strategy or policy with regards to open data.',
        '2. Repeatable - Open data initiatives are viewed as experimental or driven by external factors, without a formal strategy.',
        '3. Defined - The organisation has a documented open data strategy that addresses key areas such as governance, data management, and open data publishing.',
        '4. Managed - The organisation has an open data strategy that is aligned with wider organisational goals and is supported by measurable targets for implementation.',
        '5. Optimising - Open data is a critical component of the organisation\'s overall strategy, and it is continuously reviewed to ensure alignment with evolving goals.'
      ],
      tip: "Have a plan. **Initial:** None. **Repeatable:** Departmental. **Defined:** Documented strategy. **Managed:** Aligned with org goals. **Optimising:** Critical component of overall strategy."
    },
    {
      id: 40,
      theme: 'strategic-oversight',
      question: 'Who is responsible for delivering the open data strategy?',
      type: 'rating',
      options: [
        '1. Initial - There is no clear ownership or accountability for open data within the organisation.',
        '2. Repeatable - Some parts of the organisation, such as project teams or departments, have developed their own strategies for open data.',
        '3. Defined - Responsibility for the open data strategy is assigned at the senior management level, and ownership for data processes is well-defined.',
        '4. Managed - Senior management is fully engaged, and performance assessment of key executives is tied to the delivery of the open data strategy.',
        '5. Optimising - There is broad organisational ownership of the open data strategy, with clear roles and responsibilities for its ongoing evolution and delivery.'
      ],
      tip: "Lead from the top. **Initial:** None. **Defined:** Senior management assigned. **Managed:** Performance tied to delivery. **Optimising:** Broad ownership & clear roles."
    },
    {
      id: 41,
      theme: 'strategic-oversight',
      question: 'How does the organisation measure the impact and alignment of the open data strategy?',
      type: 'rating',
      options: [
        '1. Initial - There are no formal metrics or goals associated with the open data strategy.',
        '2. Repeatable - Some benefits of open data are identified, but there are no clear metrics for measuring its impact.',
        '3. Defined - Measurable targets are set for the implementation of the open data strategy, with regular reviews of progress.',
        '4. Managed - The organisation tracks the performance of the open data strategy through defined metrics that are aligned with organisational objectives.',
        '5. Optimising - Metrics and goals are regularly reviewed and updated, ensuring alignment with organisational priorities and driving continuous improvement.'
      ],
      tip: "Set targets. **Initial:** None. **Defined:** Measurable targets. **Managed:** Performance tracked against strategy. **Optimising:** Metrics reviewed & updated driving improvement."
    },

    // Sub-theme: Asset catalogue (4 questions)
    {
      id: 42,
      theme: 'strategic-oversight',
      question: 'How is the organisation\'s asset catalogue created and maintained?',
      type: 'rating',
      options: [
        '1. Initial - There is no systematic approach to managing data sources as assets, and no asset catalogue exists.',
        '2. Repeatable - Individual teams or projects maintain separate directories of the data assets they use, but there is no central coordination.',
        '3. Defined - An organisation-wide data asset catalogue has been developed to identify key datasets being published and used.',
        '4. Managed - The catalogue is kept up to date and includes all high-value datasets across the organisation.',
        '5. Optimising - The organisation has an exhaustive asset catalogue that includes all datasets, not just high-value ones, and it is routinely maintained.'
      ],
      tip: "List your assets. **Initial:** None. **Repeatable:** Departmental lists. **Defined:** Org-wide key datasets. **Managed:** Up-to-date high-value. **Optimising:** Exhaustive & maintained."
    },
    {
      id: 43,
      theme: 'strategic-oversight',
      question: 'How comprehensive is the asset catalogue and how is it managed?',
      type: 'rating',
      options: [
        '1. Initial - There is no formal method for managing or updating the catalogue.',
        '2. Repeatable - Some teams or departments manage their own catalogues, but there is limited coordination or formal process for updating them.',
        '3. Defined - The organisation\'s high-value datasets are included in the catalogue, but there are gaps in comprehensiveness or coordination across departments.',
        '4. Managed - The catalogue includes all datasets that are used or published by the organisation, and there is a formal process in place for ensuring it is regularly updated.',
        '5. Optimising - The asset catalogue is managed comprehensively, and its upkeep is fully integrated into the organisation\'s data management strategy, with clear accountability.'
      ],
      tip: "Maintain the list. **Initial:** Ad hoc. **Defined:** Gaps exist. **Managed:** All datasets included & process for updates. **Optimising:** Comprehensive & fully integrated."
    },
    {
      id: 44,
      theme: 'strategic-oversight',
      question: 'How is the asset catalogue used and applied within the organisation?',
      type: 'rating',
      options: [
        '1. Initial - The asset catalogue, if it exists, is not used to inform decision-making or project planning.',
        '2. Repeatable - Some teams make use of the asset catalogue to avoid duplicating datasets, but its application is inconsistent across the organisation.',
        '3. Defined - New projects and products attempt to reuse datasets referenced in the catalogue to prevent unnecessary duplication.',
        '4. Managed - The catalogue is a critical resource for project planning, and the organisation strives for efficiency by reusing existing datasets whenever possible.',
        '5. Optimising - The organisation actively identifies overlaps and commonalities between datasets in the catalogue, achieving cost and efficiency savings by aligning or consolidating datasets.'
      ],
      tip: "Avoid duplication. **Initial:** None. **Defined:** Some reuse. **Managed:** Planning resource. **Optimising:** Active consolidation & efficiency savings."
    },
    {
      id: 45,
      theme: 'strategic-oversight',
      question: 'Is the asset catalogue shared externally, and how is it used to improve transparency?',
      type: 'rating',
      options: [
        '1. Initial - There is no publicly available asset catalogue, and no external transparency around the organisation\'s data holdings.',
        '2. Repeatable - Some information about data assets is shared externally, but it is sporadic and incomplete.',
        '3. Defined - Elements of the organisation\'s asset catalogue are publicly available as open data, providing transparency into key datasets.',
        '4. Managed - The asset catalogue is regularly published and includes details about datasets that have not yet been released to help external users understand upcoming resources.',
        '5. Optimising - The organisation publishes its entire asset catalogue, including metadata and descriptions, and actively engages with external stakeholders to improve the quality and relevance of the datasets it holds.'
      ],
      tip: "Public transparency. **Initial:** Internal only. **Defined:** Some parts public. **Managed:** Scheduled publication. **Optimising:** Entire catalogue public with metadata."
    },

    // Sub-theme: Responsible data stewardship (2 questions)
    {
      id: 46,
      theme: 'strategic-oversight',
      question: 'How well does the organisation understand and assign responsibilities for data stewardship?',
      type: 'rating',
      options: [
        '1. Initial - There is little to no understanding of the concept of data stewardship, and responsibilities are undefined.',
        '2. Repeatable - There are defined responsibilities around data stewardship, including collecting, using, and sharing data. A specific job role may exist for these tasks.',
        '3. Defined - The organisation has a clear, public identity as a steward of data, with committed responsibilities for data collection, sharing, and use.',
        '4. Managed - Data stewardship responsibilities include publishing open data, securely sharing sensitive data, and building and maintaining data infrastructure.',
        '5. Optimising - The organisation has a system in place for continually assessing data stewardship responsibilities, ensuring data is used for public benefit and mitigating harm.'
      ],
      tip: "Be a steward. **Initial:** Unknown concept. **Defined:** Public commitment. **Managed:** Publishing & sharing responsibilities. **Optimising:** System for assessing stewardship."
    },
    {
      id: 47,
      theme: 'strategic-oversight',
      question: 'How does the organisation demonstrate and improve its commitment to responsible data stewardship?',
      type: 'rating',
      options: [
        '1. Initial - There is no public commitment or action plan regarding responsible data stewardship.',
        '2. Repeatable - Some public actions are taken to demonstrate responsible data stewardship, but these are limited to basic compliance with regulations.',
        '3. Defined - The organisation demonstrates a clear, public commitment to responsible data stewardship, with ongoing actions and responsibilities.',
        '4. Managed - The organisation adopts a systemic, iterative process to ensure data is used ethically, addressing public benefit and structural inequalities.',
        '5. Optimising - The organisation shows leadership in responsible data stewardship, with a proven public track record, and actively helps other organisations on their stewardship journey.'
      ],
      tip: "Demonstrate commitment. **Initial:** No plan. **Repeatable:** Basic compliance. **Defined:** Public commitment. **Managed:** Systemic ethical process. **Optimising:** Leadership & track record."
    }
  ];

  constructor(
    private aiService: AiService
  ) {
    // Add static tips
    this.questions = this.questions.map(q => ({
      ...q,
      tip: this.getStaticTip(q.id)
    }));

    // Restore session if available
    this.checkPreviousSession();
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

  private getStaticTip(questionId: number): string | undefined {
    // Simple static tips based on ID
    const tips: { [key: number]: string } = {
      1: 'A defined strategy helps align open data efforts with organizational goals.',
      2: 'Sustainable funding is crucial for long-term open data success.',
      3: 'Data quality ensures trust and usability for third-party developers.',
      4: 'Privacy by design builds confidence among users and citizens.',
      5: 'Modern platforms like CKAN or APIs facilitate easier data consumption.',
      6: 'Engaging the community drives innovation and real-world usage of your data.'
    };
    return tips[questionId];
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

  private async calculateResults(data: AssessmentData): Promise<AssessmentResult> {
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

    // Generate recommendations using AI
    const recommendations = await this.aiService.generateRecommendations(data, maturityLevel, themeScores);

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