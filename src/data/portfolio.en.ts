// =============================================================================
//  PORTFOLIO CONTENT — ENGLISH VERSION
// =============================================================================
import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Boxes,
  Smartphone,
  BrainCircuit,
  ScanFace,
  Fingerprint,
  BarChart3,
  Workflow,
  Lightbulb,
  GraduationCap,
  Building2,
} from "lucide-react";

export const profile = {
  name: "Mame Bou FALL",
  firstName: "Mame Bou",
  title: "AI & Big Data Engineer",
  subtitle: "Building AI solutions for production",
  roles: [
    "AI & Big Data Engineer",
    "Full Stack Developer",
    "Data / AI Engineer",
    "Computer Vision Engineer",
    "Instructor",
    "Entrepreneur",
  ],
  pitch:
    "I design, develop and deploy end-to-end AI products: from model training to Docker deployment, all the way to user adoption.",
  location: "Malika Plage, Dakar, Senegal",
  email: "mameboufall21@gmail.com",
  phone: "+221 77 795 49 21",
  linkedin: "https://www.linkedin.com/in/mameboufall",
  linkedinHandle: "@mameboufall",
  github: "https://github.com/FALL21",
  githubHandle: "@FALL21",
  cvPath: "/CV_Mame_Bou_FALL.pdf",
  photo: "/profile.jpg",
};

export const about = {
  paragraphs: [
    "AI & Big Data Engineer (Master's from École Supérieure Polytechnique de Dakar, Bachelor's in Mathematics from UCAD), I bring over 4 years of experience turning real-world challenges into robust digital products.",
    "My specialty: production AI systems. I delivered a complete biometric pipeline (detection, anti-spoofing, ArcFace facial recognition) for a government institution, conversational agents on enterprise data, and SaaS platforms deployed in production.",
    "Instructor for over 4 years, I make technical concepts accessible to decision-makers and developers alike, bridging the gap between research and the field.",
  ],
  atouts: ["Analytical mindset", "Mathematical rigor", "Autonomy", "Pedagogy", "Product vision"],
};

export const stats = [
  { value: 4, suffix: "+", label: "Years of experience" },
  { value: 15, suffix: "+", label: "Projects & products delivered" },
  { value: 999, prefix: "0.", label: "AUC ROC of biometric pipeline", isMetric: true },
  { value: 100, suffix: "%", label: "Passion" },
];

export type TimelineItem = {
  year: string;
  title: string;
  org: string;
  icon: LucideIcon;
};

export const timeline: TimelineItem[] = [
  { year: "2016 – 2020", title: "Bachelor's in Mathematics", org: "Cheikh Anta Diop University (UCAD)", icon: GraduationCap },
  { year: "2021", title: "Instructor · Data & Full Stack", org: "GoMyCode Dakar", icon: GraduationCap },
  { year: "2024 – 2026", title: "Master's in AI & Big Data", org: "École Supérieure Polytechnique de Dakar", icon: BrainCircuit },
  { year: "2025", title: "Founder · SIGAC / VBS Digital", org: "Personal venture", icon: Building2 },
  { year: "2025 – 2026", title: "Full Stack Engineer · AI & Data", org: "Public Treasury of Dakar", icon: ScanFace },
  { year: "2025 – 2026", title: "DataOps / AIOps Engineer", org: "CDSLABS · France (Freelance)", icon: Workflow },
];

export type SkillGroup = { name: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    name: "Artificial Intelligence",
    items: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "ArcFace / InsightFace", "LangChain", "Ollama (Local LLM)"],
  },
  {
    name: "Data & Big Data",
    items: ["Apache Spark", "Hadoop", "Kafka", "NiFi", "Talend", "Elasticsearch", "Kibana", "Power BI", "Tableau", "Pandas", "OpenTelemetry"],
  },
  {
    name: "Development",
    items: ["Next.js", "React", "TypeScript", "NestJS", "Node.js", "Python", "Java", "Scala", "R", "REST API", "Prisma"],
  },
  {
    name: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Oracle", "Neo4j", "Redis"],
  },
  {
    name: "DevOps & Cloud",
    items: ["Docker", "Kubernetes", "CI/CD", "Git", "Linux", "AWS", "OAuth2 / OIDC", "Swagger"],
  },
];

export type Service = { title: string; desc: string; icon: LucideIcon };

export const services: Service[] = [
  { title: "Custom AI Solutions", desc: "From data to production model: ML, deep learning, time series.", icon: BrainCircuit },
  { title: "Computer Vision", desc: "Detection, classification, tracking and real-time video pipelines.", icon: ScanFace },
  { title: "Facial Recognition", desc: "Robust biometrics with anti-spoofing and ArcFace verification.", icon: Fingerprint },
  { title: "Full Stack Development", desc: "Modern Next.js / NestJS web apps, from prototype to production.", icon: Code2 },
  { title: "SaaS Platforms", desc: "Multi-tenant architecture, auth, dashboards and billing.", icon: Boxes },
  { title: "Apps & PWA", desc: "Installable, fast and offline-ready mobile experiences.", icon: Smartphone },
  { title: "Data Analytics", desc: "ETL, decision dashboards and visualization.", icon: BarChart3 },
  { title: "Automation & MLOps", desc: "Ingestion pipelines, monitoring and anomaly detection.", icon: Workflow },
  { title: "Consulting & Training", desc: "Technical guidance and team upskilling.", icon: Lightbulb },
];

export type Project = {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  status: string;
  link?: string;
  accent: string;
};

export const projects: Project[] = [
  {
    name: "Biometric Attendance · Public Treasury",
    tagline: "Production facial recognition for a government institution",
    description:
      "Complete biometric pipeline replacing manual attendance sheets: SCRFD detection, dual-layer anti-spoofing (YOLO + MobileNetV3 via transfer learning) and ArcFace verification (512D embeddings, cosine similarity).",
    highlights: [
      "AUC ROC of 0.999 and equal error rate of 1.8% in cross-validation",
      "Identification in seconds, multi-site geolocation",
      "Docker deployment, MVC architecture, 7-level hierarchical access control",
    ],
    tech: ["Python", "PyTorch", "OpenCV", "ArcFace", "YOLO", "Docker"],
    status: "In production",
    accent: "#22C55E",
  },
  {
    name: "SIGAC",
    tagline: "Smart administrative HR management",
    description:
      "HR management SaaS with facial recognition attendance and geolocation, tailored for SMEs and schools.",
    highlights: [
      "Smart attendance + integrated geolocation",
      "HR analytics and decision dashboards",
      "Multi-organization, deployment-ready",
    ],
    tech: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Computer Vision"],
    status: "In development",
    accent: "#16A34A",
  },
  {
    name: "VBS · Vos Besoins Services",
    tagline: "Client ↔ service provider marketplace",
    description:
      "Deployed platform connecting clients and service providers, with OTP verification, mapping and a complete booking flow.",
    highlights: [
      "OTP authentication (Twilio) and verified profiles",
      "Geolocated search with mapping",
      "Containerized architecture, deployed in production",
    ],
    tech: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Twilio", "Docker"],
    status: "Live",
    link: "https://vbs.services",
    accent: "#22C55E",
  },
  {
    name: "Bolt Spreadsheet",
    tagline: "AI-augmented collaborative SaaS spreadsheet",
    description:
      "Collaborative platform where you query your data in natural language via a conversational agent (LangChain + Ollama), with automated ingestion pipelines.",
    highlights: [
      "Local LLM conversational agent on business data",
      "10+ data connectors and shareable dashboards",
      "MFA, SSO (OAuth2/OIDC), ML anomaly detection",
    ],
    tech: ["LangChain", "Ollama", "Python", "TypeScript", "OAuth2"],
    status: "Remote · CDSLABS",
    accent: "#16A34A",
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export const experiences: Experience[] = [
  {
    role: "Full Stack Engineer · AI & Data",
    company: "Public Treasury, Dakar",
    period: "Aug. 2025 – Feb. 2026",
    points: [
      "Designed and trained a complete biometric pipeline (SCRFD, anti-spoofing, ArcFace 512D).",
      "AUC ROC 0.999, EER 1.8%: identification in seconds.",
      "Docker deployment: MVC architecture, multi-site geolocation, 7-level hierarchical access.",
    ],
  },
  {
    role: "DataOps / AIOps Engineer",
    company: "CDSLABS · France / Senegal (remote)",
    period: "Jan. 2025 – Jun. 2026",
    points: [
      "LangChain + Ollama conversational agent to query data in natural language.",
      "10+ connectors, automated ingestion pipelines, shareable multi-chart dashboards.",
      "MFA, SSO (OAuth2/OIDC), Real User Monitoring, ML anomaly detection.",
    ],
  },
  {
    role: "Founder & Lead Developer",
    company: "SIGAC / VBS Digital, Dakar",
    period: "Since Dec. 2025",
    points: [
      "SIGAC: HR management SaaS (facial attendance + geolocation).",
      "VBS: client-provider marketplace deployed online.",
    ],
  },
  {
    role: "Instructor",
    company: "GoMyCode, Dakar",
    period: "Since Dec. 2021",
    points: [
      "Introduction to Artificial Intelligence · Data Analyst trainer.",
      "Time series & visualization · Full Stack Developer Bootcamp.",
    ],
  },
];

export const education = [
  { degree: "Master's in AI & Big Data", school: "École Supérieure Polytechnique de Dakar", period: "2024 – 2026" },
  { degree: "Bachelor's in Mathematics", school: "Cheikh Anta Diop University of Dakar", period: "2016 – 2020" },
  { degree: "Baccalauréat S2", school: "Lycée Jules Sagna de Thiès", period: "2016" },
];

export const languages = [
  { name: "French", level: "Fluent" },
  { name: "English", level: "Professional" },
];
