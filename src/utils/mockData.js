// Mock responses for the task analysis

export const mockExamples = [
  {
    id: 'example1',
    title: 'Customer Support Chatbot',
    answers: {
      0: 'This task involves answering routine customer inquiries about product features, pricing, and basic troubleshooting. Currently it's handled by our first-tier support team who respond to about 500 requests daily. The goal is to provide accurate information quickly and identify which issues need human escalation.',
      1: 'The judgments required include understanding customer intent when queries are vague, recognizing emotional tone to adjust responses appropriately, and determining when an issue is complex enough to require human intervention. While many questions follow patterns, about 30% require contextual understanding beyond simple templates.',
      2: 'We handle approximately 500 inquiries per day, with peaks of up to 700 after product launches or updates. About 70% follow familiar patterns that could be categorized into 20-30 common question types. The remaining 30% involve unique situations or complex issues.',
      3: 'We have comprehensive product documentation, FAQs, pricing sheets, and a database of previous customer interactions with resolution notes. We also have access to customer account details including purchase history, support history, and product usage statistics when relevant.',
      4: 'The main risks include providing incorrect information that could lead to customer frustration or inappropriate product use, misunderstanding urgent issues that need immediate attention, and failing to recognize when sensitive customer data might be involved in a query. We must comply with GDPR for European customers.',
      5: 'Response time is important - we currently aim to respond within 2 hours, but immediate responses are preferred. If volume doubled, our current team would be severely overwhelmed, leading to longer wait times and potential quality issues due to rushing.',
      6: 'Our customer surveys indicate that for routine inquiries, customers are comfortable with automated responses as long as they're accurate and helpful. However, for complex issues or when they're frustrated, they strongly prefer human interaction. We try to be transparent about when they're interacting with automated systems.',
    },
    result: {
      Classification: 'AI Agent with Human Oversight (Human-in-the-Loop)',
      Reasoning: 'This task is ideal for an AI agent with human oversight because it involves a high volume of repetitive queries (70%) that follow predictable patterns, yet requires judgment for the remaining 30% of complex cases. The abundance of structured data (product documentation, FAQs, previous interactions) provides excellent training material for an AI system. The time-sensitivity and scaling challenges make automation valuable, while the need for emotional intelligence and handling sensitive data necessitates human oversight for complex cases.',
      Tools: [
        'Natural Language Processing for query understanding',
        'Knowledge base integration',
        'Sentiment analysis',
        'Escalation protocol automation',
        'Customer data access with proper security controls'
      ],
      PotentialConsiderations: [
        'Clearly communicate to customers when they're interacting with an AI system',
        'Establish clear escalation criteria for human review',
        'Implement feedback loops for continuous improvement',
        'Ensure GDPR compliance for data handling',
        'Monitor for bias in response patterns'
      ]
    }
  },
  {
    id: 'example2',
    title: 'Monthly Financial Reporting',
    answers: {
      0: 'The task involves preparing standardized monthly financial reports for our company's department heads. This includes compiling data from our financial system, formatting it into Excel spreadsheets, creating charts, and distributing reports via email. Our accounting clerk currently spends about 3 full days each month on this. The primary goal is to provide accurate, consistent financial insights to management.',
      1: 'Very few judgments are required for this task. The reports follow a fixed template with predetermined calculations and charts. The data sources, formulas, and report formats are all standardized and haven't changed in over two years. The only occasional judgment might involve verifying unusual numbers that appear to be outliers.',
      2: 'This task occurs exactly once per month, at month-end close (typically by the 5th business day). It follows the same process every time with almost no variation. The steps, calculations, and output formats are completely standardized.',
      3: 'All data comes directly from our ERP system (SAP) in structured format. We have predefined data extraction queries that pull the exact required information. Historical reports are stored on our shared drive, and we have documented templates for all reports.',
      4: 'The primary risk would be calculation errors that might lead to incorrect business decisions. However, the calculations are simple and standardized. There are no special regulatory requirements beyond normal financial data confidentiality. The data is for internal use only and doesn't contain customer information.',
      5: 'The reports must be completed within 5 business days after month-end, but there's no need for real-time processing. If volume doubled (e.g., more departments needed reports), it would significantly impact our accounting clerk's ability to complete other work, as this already consumes about 40% of their monthly capacity.',
      6: 'Department heads care about accuracy and consistency in the reports but have no expectation or requirement for human preparation. They've previously mentioned that automation would be welcome if it meant getting reports faster without sacrificing accuracy.',
    },
    result: {
      Classification: 'Fully Automated (Rules-Based)',
      Reasoning: 'This task is ideal for rules-based automation because it involves highly structured data, follows a fixed template with standard calculations, has minimal variation, and requires almost no judgment. The task is repetitive, time-consuming (3 days per month), and follows the exact same process each time. Both the inputs (SAP data) and outputs (standardized reports) are well-defined, and there are no regulatory or stakeholder barriers to automation.',
      Tools: [
        'RPA (Robotic Process Automation)',
        'Scheduled data extraction from SAP',
        'Automated Excel reporting with macros',
        'Email automation for distribution'
      ],
      PotentialConsiderations: [
        'Implement data validation checks to flag unusual numbers',
        'Schedule automation to run after month-end close processes complete',
        'Maintain audit logs of automated processes',
        'Ensure proper access controls for financial data',
        'Consider a phased implementation, starting with the most straightforward reports'
      ]
    }
  },
  {
    id: 'example3',
    title: 'Executive Hiring Decision',
    answers: {
      0: 'This task involves evaluating and selecting candidates for C-suite positions. It's performed jointly by our CEO, board members, and occasionally external executive recruiters. It happens approximately 2-3 times per year when we need to fill executive positions. The goal is to identify candidates who will contribute to company success through leadership, cultural fit, and strategic expertise.',
      1: 'This task requires significant judgment across multiple dimensions. We evaluate leadership capabilities, communication style, cultural fit, strategic thinking, industry expertise, past performance, and future potential. Each candidate must be assessed contextually against our specific needs, market challenges, and company culture. Every hiring situation is unique based on our evolving business needs and the specific role.',
      2: 'Executive hiring occurs infrequently, only 2-3 times per year at most. Each case is highly unique, varying based on the specific role, our current strategic challenges, market conditions, and the available talent pool. While we follow a general process, the specifics require customization each time.',
      3: 'We have candidate resumes, references, background checks, and assessment reports from executive search firms. We also have internal performance metrics for our company, strategic plans, and leadership competency frameworks. However, much of the critical information comes from unstructured interviews, board discussions, and nuanced reference conversations.',
      4: 'The consequences of poor executive hiring decisions are extremely high, potentially affecting company performance, employee retention, culture, and strategic direction. The cost of a bad hire at this level can run into millions of dollars. We must comply with employment laws and maintain strict confidentiality throughout the process.',
      5: 'The hiring process typically takes 2-3 months and isn't particularly time-sensitive beyond ensuring continuity in leadership. There's no need to scale this process, as the frequency is inherently limited by organization size and structure.',
      6: 'All stakeholders (board, employees, investors) expect and demand significant human judgment, expertise, and personal interaction in executive hiring. This is considered one of the most important human decisions in our organization, requiring personal assessment, instinct, and group deliberation.',
    },
    result: {
      Classification: 'Human-Only',
      Reasoning: 'This executive hiring process requires deep human judgment across multiple dimensions that AI cannot adequately replace. The task involves complex, nuanced assessment of leadership qualities, cultural fit, and strategic capability - areas where human intuition and experience are paramount. The high stakes nature of these decisions (with potential million-dollar consequences), the infrequent occurrence (2-3 times yearly), and the strong stakeholder expectation for human judgment all point to this being a fundamentally human process. The unstructured nature of the critical data (interview impressions, references, board discussions) further supports keeping this as a human-only task.',
      Tools: [
        'Structured interview frameworks',
        'Reference check protocols',
        'Leadership assessment instruments',
        'Board decision facilitation methods'
      ],
      PotentialConsiderations: [
        'AI could assist with initial resume screening or identifying potential candidates',
        'Data analytics might help evaluate past hiring success patterns',
        'Technology can facilitate the logistics of the process',
        'Structured frameworks can reduce bias while preserving human judgment',
        'The core evaluation and decision should remain human-driven'
      ]
    }
  }
];

// Mock responses for the API
export const mockAnalysisResponse = {
  Classification: 'AI Agent with Human Oversight (Human-in-the-Loop)',
  Reasoning: 'This task requires a balance of automation and human judgment. The majority of cases follow standard patterns that an AI can handle efficiently, but the significant minority of complex cases require human expertise. The structured data available provides a solid foundation for AI, while the need for contextual understanding and regulatory compliance necessitates human oversight.',
  Tools: [
    'Natural Language Processing',
    'Decision support systems',
    'Workflow automation',
    'Knowledge base integration',
    'Human escalation protocols'
  ],
  PotentialConsiderations: [
    'Clear escalation criteria are essential',
    'Regular retraining on new patterns will improve performance',
    'Transparent communication about AI involvement',
    'Privacy and security controls for sensitive data',
    'Monitor for bias and ensure fairness across all user groups'
  ]
};

// Questions for task analysis
export const QUESTIONS = [
  "1. Please describe the task you'd like to evaluate: what it is, who currently performs it, how often it's done, and what the primary goal or outcome is.",
  "2. What kinds of judgments or creative/empathetic decisions are required? Are there situations where a template or set of fixed rules wouldn't suffice?",
  "3. Roughly how many times per day/week/month does this task occur, and how much of it follows the same pattern versus unique cases?",
  "4. What structured data (e.g. customer records, product catalogs, past logs) is available to inform or automate parts of this task?",
  "5. What risks or consequences would arise if the task were done incorrectly, and what regulations or confidentiality concerns (e.g. GDPR, HIPAA) apply?",
  "6. How time-sensitive is completion or response, and how much would you need to scale this task if volume doubled or tripled?",
  "7. To what extent do stakeholders (customers, employees, regulators) expect a genuine human interaction or oversight, versus accepting an automated or AI-driven approach?"
];
