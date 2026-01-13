import { Question } from '../models/assessment.model';

export const QUESTIONS: Question[] = [
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
        tip: `Initial: Very little open data is publicly available.
Repeatable: Data is published sporadically on various sites without a unified approach.
Defined: Specific datasets are published reliably on a set schedule.
Managed: Data is hosted on a dedicated platform with professional management tools.
Optimising: Your updates are automatic and instantly reflect in external aggregation portals.`
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
        tip: `Initial: Publishing is manual, irregular, and often chaotic.
Repeatable: Some teams have a system, but it's not standard across the organisation.
Defined: A reliable schedule and consistent process exist for the whole organisation.
Managed: Every dataset follows the same strict standard for release.
Optimising: You measure how efficient your release process is and improve it based on data.`
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
        tip: `Initial: No license is provided, so legal reuse is risky or impossible.
Repeatable: You use an open license, so people know they can use the data.
Defined: You clearly state how to attribute the data, making reuse easier.
Managed: Detailed documentation explains exactly what the license covers.
Optimising: You update licenses to account for AI usage and modern technologies.`
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
        tip: `Initial: Once published, data is forgotten and rarely updated.
Repeatable: Some datasets get updated, but it's not consistent for everything.
Defined: You stick to a published timetable for regular updates.
Managed: You keep old versions so people can compare changes over time.
Optimising: Automated reports tell you if any data is getting too old or stale.`
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
        tip: `Initial: Everyone uses whatever format they want; no standards exist.
Repeatable: Some teams agree on formats, but it's not universal.
Defined: The organisation has defined official standards for formats and metadata.
Managed: Every single dataset strictly follows the organisation's technical standards.
Optimising: You actively adopt new, modern standards as technology evolves.`
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
        tip: `Initial: Formats are messy and inconsistent (e.g., PDF, Word).
Repeatable: You use structured formats like Excel or CSV that humans can read.
Defined: Data is machine-readable with standard headers, making it easier to process.
Managed: You use open formats like JSON/CSV and include rich descriptions.
Optimising: Data is optimized for AI and machine learning applications.`
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
        tip: `Initial: No extra information (metadata) explains the data.
Repeatable: Some metadata exists, but it's incomplete or inconsistent.
Defined: Metadata is high-quality, structured, and reliable.
Managed: Your metadata follows international standards like DCAT.
Optimising: Both data and metadata use open standards for perfect interoperability.`
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
        tip: `Initial: You don't have a process for managing data standards.
Repeatable: You pick standards based on what's easiest for you internally.
Defined: You follow a formal, consistent process for managing standards.
Managed: You strategically adopt open standards that help external users.
Optimising: Your standards evolve to support new tech like AI and Machine Learning.`
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
        tip: `Initial: There is no consistent way you manage your datasets.
Repeatable: Some teams have their own little processes, but it varies.
Defined: Important datasets follow a standard management process.
Managed: Every dataset follows a standard process that can be adapted if needed.
Optimising: You constantly review and improve your management processes.`
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
        tip: `Initial: No one knows who is responsible for which dataset.
Repeatable: People know informally who owns data, but it's not written down.
Defined: Every dataset has a documented owner who manages it.
Managed: Ownership is documented, reviewed, and accountable.
Optimising: Changes in staff or roles automatically update data ownership records.`
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
        tip: `Initial: You don't check if data is accurate or complete.
Repeatable: You check quality sometimes, usually only when there's a problem.
Defined: You regularly check the quality of your most important datasets.
Managed: You actively monitor all data and fetch feedback to fix issues.
Optimising: You work with users to proactively improve data quality before issues arise.`
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
        tip: `Initial: There are no rules or governance for open data.
Repeatable: Some teams have informal rules, but they aren't standard.
Defined: A governance framework exists for important datasets.
Managed: The framework applies to every single dataset you release.
Optimising: You improve your governance based on real-world feedback and impact.`
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
        tip: `Initial: You know there are risks, but you don't do anything about them.
Repeatable: You assess risks informally for some data, but it's not documented.
Defined: You have a documented risk process for your most important data.
Managed: strict risk assessment is done for every dataset before release.
Optimising: You use advanced technology and external validation to manage risks.`
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
        tip: `Initial: You release data without checking for sensitive information.
Repeatable: You informally strip out sensitive data, but it's not a strict process.
Defined: You have standard anonymisation rules for most datasets.
Managed: Strict de-identification is applied to all sensitive data legally.
Optimising: You use advanced privacy tech and are transparent about your methods.`
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
        tip: `Initial: You don't really think about ethics when publishing data.
Repeatable: Some people care about ethics, but there's no official way to handle it.
Defined: You have a standard process to evaluate ethical consequences.
Managed: Ethics reviews are a mandatory part of your governance process.
Optimising: You proactively review long-term societal impacts and AI ethics.`
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
        tip: `Initial: You aren't aware of international laws or standards.
Repeatable: You informally check compliance, but it's not thorough.
Defined: You ensure compliance for your most important datasets.
Managed: You routinely monitor and ensure compliance for all datasets.
Optimising: You actively track new laws and validate your compliance externally.`
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
        tip: `Initial: The public knows nothing about how you manage risks.
Repeatable: You know the risks internally, but you don't share that info.
Defined: You publish a risk register for key datasets.
Managed: You publish a complete, regularly updated risk register.
Optimising: Your risk process is fully transparent and open to public feedback.`
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
        tip: `Initial: Only a few people know about open data, and that's it.
Repeatable: You have some experts in teams, but no plan to grow their skills.
Defined: Expertise is available from a central team or external partners.
Managed: A central team has clear roles to support everyone else.
Optimising: You build expertise at all levels and partner globally to advance the field.`
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
        tip: `Initial: You offer no training or mentoring.
Repeatable: You provide training only when a specific project needs it.
Defined: Experts mentor others, and training options are growing.
Managed: Training and mentorship are standard for staff development.
Optimising: Training is tailored to every role and supported by a mentoring network.`
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
        tip: `Initial: You don't check what skills your team is missing.
Repeatable: Individuals figure out what they need, but there's no overall plan.
Defined: You've analyzed the organisation to find key skill gaps.
Managed: You regularly analyze skill gaps to align with your strategy.
Optimising: You continuously track how learning improves performance.`
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
        tip: `Initial: There are almost no chances to learn new skills.
Repeatable: Resources exist but are random and project-focused.
Defined: You offer structured training for core data skills.
Managed: Well-defined programs encourage staff to learn strategically.
Optimising: Tailored learning programs are available for everyone continuously.`
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
        tip: `Initial: No one is responsible for driving data skills.
Repeatable: Someone is responsible, but they only focus on basic tools like Excel.
Defined: You provide generic data training, but it's not linked to goals.
Managed: Data skills are part of performance reviews and strategy.
Optimising: You track KPIs to ensure skills align with future business needs.`
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
        tip: `Initial: Non-expert teams are left to fend for themselves.
Repeatable: They get help sometimes from consultants or random training.
Defined: Champions or professionals are available to help them.
Managed: A clear structure provides mentors and central support.
Optimising: Continuous, tailored support ensures they are fully integrated.`
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
        tip: `Initial: You don't know who uses your data or talk to them.
Repeatable: Some teams talk to users, but don't share that info.
Defined: You identify users and have a process to engage them.
Managed: You actively ask for feedback before and after releases.
Optimising: You build and nurture a thriving community of data users.`
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
        tip: `Initial: You release data only when you feel like it internally.
Repeatable: You listen to some demands, but there's no system.
Defined: Users can request datasets, and you release based on demand.
Managed: You have a clear strategy that you communicate to everyone.
Optimising: Constant dialogue with the community shapes your priorities.`
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
        tip: `Initial: You work alone and don't collaborate with others.
Repeatable: You sometimes chat with peers but it's not formal.
Defined: You participate in sector-wide efforts when asked.
Managed: You proactively contribute to sector collaborations.
Optimising: You lead the sector, setting best practices and fostering innovation.`
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
        tip: `Initial: If users need help, they are on their own.
Repeatable: Typically, support is random and depends on who they ask.
Defined: Users have specific contacts to ask for help.
Managed: You actively promote support channels and set response times.
Optimising: You measure how well you support users and constantly improve.`
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
        tip: `Initial: You don't collect or monitor feedback.
Repeatable: Teams get feedback individually, but don't share it.
Defined: You have formal channels (like forums) to collect feedback.
Managed: You analyze feedback routinely to improve your data.
Optimising: You collaborate with users to enhance data quality directly.`
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
        tip: `Initial: You don't track how people use your data.
Repeatable: You monitor some datasets sporadically.
Defined: You routinely collect metrics to improve services.
Managed: Automated metrics give you insights into usage and efficiency.
Optimising: Metrics drive your strategy and continuous improvement.`
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
        tip: `Initial: You release data without explaining it.
Repeatable: Some data has docs, but it varies by person.
Defined: A standard exists but is only used for key datasets.
Managed: Every dataset has standard docs and metadata.
Optimising: All data has comprehensive, high-quality documentation.`
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
        tip: `Initial: There is no process to check documentation quality.
Repeatable: Some people use templates, but not everyone.
Defined: You have a standard approach, but it's not fully adopted.
Managed: Every dataset follows the strict documentation process.
Optimising: Documentation is integrated into publishing and reviewed.`
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
        tip: `Initial: You don't ask for feedback on your docs.
Repeatable: Users complain informally, but you don't track it.
Defined: You have a process for feedback and occasionally fix things.
Managed: You actively ask for feedback and fix issues regularly.
Optimising: You encourage users to contribute and improve the docs.`
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
        tip: `Initial: Data release is an unplanned cost.
Repeatable: Costs are covered project-by-project.
Defined: Long-term costs are budgeted and assigned.
Managed: You track the costs and benefits continuously.
Optimising: You optimize for efficiency and sustainability.`
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
        tip: `Initial: There is no plan for the future.
Repeatable: You only have short-term funding.
Defined: You budget for updates and management.
Managed: Sustainability is part of your core governance.
Optimising: You seek external partners and funding for longevity.`
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
        tip: `Initial: Contracts ignore data rights completely.
Repeatable: You clarify rights after the fact.
Defined: Some contracts address data rights.
Managed: Standard clauses ensure data rights are clear.
Optimising: Every contract explicitly defines open data rights.`
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
        tip: `Initial: You don't know if you can release the data.
Repeatable: You check rights project-by-project.
Defined: Processes exist to clarify rights.
Managed: You ensure rights are clear in all partnerships.
Optimising: Rights management is fully integrated from the start.`
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
        tip: `Initial: You never measure the value of data.
Repeatable: You describe value vaguely in reports.
Defined: You use qualitative methods to estimate benefits.
Managed: You measure ROI using a standard quantitative approach.
Optimising: Valuation guides your investment decisions.`
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
        tip: `Initial: You don't report on data value.
Repeatable: You share general benefits but nothing concrete.
Defined: You share reports with specific examples of reuse.
Managed: Detailed reports include case studies and feedback.
Optimising: Strategic reports guide your future data releases.`
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
        tip: `Initial: You have no strategy for open data.
Repeatable: Experiments happen, but there's no plan.
Defined: You have a documented strategy for key areas.
Managed: Your strategy aligns with goals and has targets.
Optimising: Open data is critical to your overall success.`
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
        tip: `Initial: No one is accountable.
Repeatable: Departments do their own thing.
Defined: Senior management manages the strategy.
Managed: Executive performance is tied to open data success.
Optimising: The whole organisation owns the strategy.`
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
        tip: `Initial: You have no metrics or goals.
Repeatable: You see benefits but can't measure them.
Defined: You set targets and review progress regularly.
Managed: You track performance against strict metrics.
Optimising: Metrics drive continuous improvement.`
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
        tip: `Initial: You don't have a list of your data assets.
Repeatable: Teams keep their own lists, but they don't connect.
Defined: You have a central catalogue for key datasets.
Managed: The catalogue is current and includes all high-value data.
Optimising: Your catalogue is exhaustive and routinely maintained.`
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
        tip: `Initial: You don't manage or update the catalogue.
Repeatable: Updates are uncoordinated and sporadic.
Defined: Important data is listed, but gaps remain.
Managed: All published data is listed and updated formally.
Optimising: Management is comprehensive and fully integrated.`
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
        tip: `Initial: The catalogue isn't used for planning.
Repeatable: Using the catalogue is optional and inconsistent.
Defined: Projects check the catalogue to avoid duplication.
Managed: It's a critical resource for all project planning.
Optimising: You use it to actively find savings and consolidate data.`
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
        tip: `Initial: You don't share your data list externally.
Repeatable: You share bits and pieces, but it's incomplete.
Defined: Key parts of the catalogue are public.
Managed: You publish regularly and include future plans.
Optimising: The entire catalogue is public and interactive.`
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
        tip: `Initial: Responsibilities for stewardship are undefined.
Repeatable: Some roles focus on stewardship tasks.
Defined: You have a public identity as a data steward.
Managed: Stewardship includes security, sharing, and infrastructure.
Optimising: You continuously assess data use for public benefit.`
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
        tip: `Initial: You haven't committed to responsible data use publicly.
Repeatable: You do the minimum to comply with regulations.
Defined: You have made a clear public commitment.
Managed: You have a systemic process for ethical data use.
Optimising: You are a leader and help others improve.`
    }
];
