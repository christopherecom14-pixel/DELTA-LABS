// Shared recruitment configuration. Imported by both client and server code,
// so it must stay free of Node-only imports.

export const OPPORTUNITY = {
  company: "Delta Labs",
  location: "BCG Chowk, Mumtazabad, Multan",
  city: "Multan",
  arrangement: "On-site",
  stipendBase: 10_000,
  stipendUpper: 15_000,
  currency: "PKR",
} as const;

export const formatPkr = (amount: number) =>
  `PKR ${amount.toLocaleString("en-PK")}`;

export const DEPARTMENTS = [
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    summary: "Plan and run campaigns across social, search and content channels for real clients.",
    learn: ["Campaign planning", "Content calendars", "Performance reporting"],
    platforms: ["Meta Business Suite", "Google Analytics", "Canva", "Mailchimp", "Google Ads", "TikTok"],
    question: {
      id: "dm_strategy",
      prompt: "Propose a basic campaign strategy for a new local business in Multan. Choose the business type yourself.",
      hint: "Cover the audience, channels, a rough budget split and how you would measure results.",
    },
    links: ["linkedin", "portfolio"],
  },
  {
    id: "meta-ads",
    name: "Meta Ads",
    summary: "Build, monitor and optimise Facebook and Instagram ad campaigns with the media team.",
    learn: ["Campaign structure", "Audience and creative testing", "Pixel and conversion tracking"],
    platforms: ["Meta Ads Manager", "Meta Pixel / Events Manager", "Google Analytics", "Canva", "Looker Studio"],
    question: {
      id: "meta_diagnosis",
      prompt: "A Meta campaign is generating clicks but no leads. Explain your diagnostic process.",
      hint: "Walk through what you would check, in what order, and why.",
    },
    links: ["linkedin", "portfolio"],
  },
  {
    id: "seo",
    name: "SEO",
    summary: "Research keywords, audit websites and improve organic visibility for client sites.",
    learn: ["Technical audits", "Keyword research", "On-page optimisation"],
    platforms: ["Google Search Console", "Google Analytics", "Ahrefs", "Semrush", "Screaming Frog", "WordPress"],
    question: {
      id: "seo_decline",
      prompt: "How would you investigate a website's declining search visibility?",
      hint: "Describe the data you would look at first and the likely causes you would rule in or out.",
    },
    links: ["linkedin", "portfolio"],
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    summary: "Create social creatives, brand assets and ad visuals with feedback from senior designers.",
    learn: ["Brand systems", "Ad creative production", "Client feedback cycles"],
    platforms: ["Adobe Photoshop", "Adobe Illustrator", "Figma", "Canva", "Adobe Premiere Pro", "CapCut"],
    question: {
      id: "design_brief",
      prompt: "How would you approach a client brief with unclear requirements?",
      hint: "Explain how you would clarify the goal before and during the design work.",
    },
    links: ["portfolio", "behance"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    summary: "Support store operations, product listings and conversion improvements for online stores.",
    learn: ["Store management", "Product listing optimisation", "Conversion analysis"],
    platforms: ["Shopify", "WooCommerce", "Daraz Seller Center", "Google Analytics", "Meta Commerce Manager"],
    question: {
      id: "ecom_conversion",
      prompt: "How would you identify why an online store has traffic but few purchases?",
      hint: "Describe where in the journey you would look and what you would measure.",
    },
    links: ["linkedin", "portfolio"],
  },
  {
    id: "customer-support",
    name: "Customer Support",
    summary: "Handle client and customer queries over chat, email and phone with clear, calm communication.",
    learn: ["Ticket handling", "Escalation procedures", "Written communication"],
    platforms: ["WhatsApp Business", "Gmail / Google Workspace", "Zendesk", "Freshdesk", "Microsoft Excel"],
    question: {
      id: "support_angry",
      prompt: "How would you resolve an angry customer's complaint?",
      hint: "Describe what you would say and do, step by step, until the issue is closed.",
    },
    links: ["linkedin"],
  },
  {
    id: "sales",
    name: "Sales",
    summary: "Qualify leads, follow up with prospects and support the sales team through the pipeline.",
    learn: ["Lead qualification", "Follow-up discipline", "CRM hygiene"],
    platforms: ["HubSpot", "Zoho CRM", "WhatsApp Business", "LinkedIn", "Microsoft Excel"],
    question: {
      id: "sales_qualify",
      prompt: "How would you qualify a potential lead?",
      hint: "List the questions you would ask and how you would decide whether to pursue them.",
    },
    links: ["linkedin"],
  },
  {
    id: "business-development",
    name: "Business Development",
    summary: "Research markets, identify partnership opportunities and prepare outreach with leadership.",
    learn: ["Market research", "Outreach and proposals", "Partnership tracking"],
    platforms: ["LinkedIn Sales Navigator", "HubSpot", "Google Sheets", "Canva", "Notion"],
    question: {
      id: "bd_opportunity",
      prompt: "How would you identify and approach a new type of client for a digital agency in Multan?",
      hint: "Explain how you would research the opportunity, pick targets and open the conversation.",
    },
    links: ["linkedin"],
  },
] as const;

export type DepartmentId = (typeof DEPARTMENTS)[number]["id"];
export const DEPARTMENT_IDS = DEPARTMENTS.map((d) => d.id) as [DepartmentId, ...DepartmentId[]];
export const departmentById = (id: string) => DEPARTMENTS.find((d) => d.id === id);
export const departmentName = (id: string) => departmentById(id)?.name ?? id;

export const GENERAL_QUESTIONS = [
  {
    id: "general_problem",
    prompt: "Tell us about a problem you solved recently — in study, work or life. What did you do, and what did you learn?",
  },
  {
    id: "general_learning",
    prompt: "What is something you taught yourself in the last year, and how did you go about learning it?",
  },
] as const;

export const EXPERIENCE_LEVELS = [
  { id: "student", label: "Current student" },
  { id: "fresh-graduate", label: "Fresh graduate" },
  { id: "some-experience", label: "Some experience (under 1 year)" },
  { id: "experienced", label: "Experienced (1+ years)" },
] as const;

export const EDUCATION_LEVELS = [
  { id: "intermediate", label: "Intermediate / A-Levels" },
  { id: "bachelors", label: "Bachelor's" },
  { id: "masters", label: "Master's / MPhil" },
  { id: "diploma", label: "Diploma / Certificate" },
  { id: "other", label: "Other" },
] as const;

export const AVAILABILITY = [
  { id: "full-time", label: "Full-time (5–6 days a week)" },
  { id: "part-time", label: "Part-time (around classes)" },
] as const;

export const WORKING_HOURS = [
  { id: "morning", label: "Morning (9am – 1pm)" },
  { id: "afternoon", label: "Afternoon (1pm – 5pm)" },
  { id: "full-day", label: "Full day (9am – 5pm)" },
  { id: "flexible", label: "Flexible" },
] as const;

export const COMMITMENT = [
  { id: "1-month", label: "1 month" },
  { id: "2-months", label: "2 months" },
  { id: "3-months", label: "3 months" },
  { id: "6-months", label: "6 months or more" },
] as const;

export const DAILY_HOURS = [
  { id: "2-4", label: "2–4 hours" },
  { id: "4-6", label: "4–6 hours" },
  { id: "6-8", label: "6–8 hours" },
] as const;

export const STIPEND_COMFORT = [
  { id: "yes", label: "Yes, I'm comfortable with it" },
  { id: "discuss", label: "I'd like to discuss it" },
  { id: "no", label: "No" },
] as const;

export const YES_NO_MAYBE = [
  { id: "yes", label: "Yes" },
  { id: "maybe", label: "Maybe" },
  { id: "no", label: "No" },
] as const;

export const SALARY_RANGES = [
  { id: "under-30k", label: "Under PKR 30,000" },
  { id: "30-50k", label: "PKR 30,000 – 50,000" },
  { id: "50-80k", label: "PKR 50,000 – 80,000" },
  { id: "80k-plus", label: "PKR 80,000+" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

export const labelFor = (
  list: readonly { id: string; label: string }[],
  id: string | undefined,
) => list.find((o) => o.id === id)?.label ?? id ?? "—";

// ---------------------------------------------------------------------------
// Pipeline & scoring (admin)
// ---------------------------------------------------------------------------

export const PIPELINE = [
  { id: "new", label: "New" },
  { id: "under-review", label: "Under review" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "assessment", label: "Assessment" },
  { id: "interview", label: "Interview" },
  { id: "selected", label: "Selected" },
  { id: "rejected", label: "Rejected" },
  { id: "talent-pool", label: "Talent pool" },
] as const;

export type PipelineStatus = (typeof PIPELINE)[number]["id"];
export const PIPELINE_IDS = PIPELINE.map((p) => p.id) as [PipelineStatus, ...PipelineStatus[]];

export const SCORE_CRITERIA = [
  { id: "practicalSkills", label: "Practical skills", max: 30 },
  { id: "learningProblemSolving", label: "Learning ability & problem-solving", max: 25 },
  { id: "communication", label: "Communication & professionalism", max: 15 },
  { id: "portfolioAssessment", label: "Portfolio & assessment", max: 15 },
  { id: "availabilityCommitment", label: "Availability & commitment", max: 10 },
  { id: "budgetAlignment", label: "Budget alignment", max: 5 },
] as const;

export type ScoreKey = (typeof SCORE_CRITERIA)[number]["id"];
export type Scores = Partial<Record<ScoreKey, number>>;

export const CV_MAX_BYTES = 4 * 1024 * 1024; // keep total request under serverless body limits
export const CV_MAX_LABEL = "4 MB";
