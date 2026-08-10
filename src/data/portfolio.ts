// =============================================================================
//  CONTENU DU PORTFOLIO : tout se modifie ici.
//  Gardez les noms de champs ; ne changez que les valeurs (texte entre "").
//  Guide détaillé : docs/03-personnalisation.md
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
  title: "Ingénieur IA & Big Data",
  subtitle: "Constructeur de solutions IA en production",
  roles: [
    "Ingénieur IA & Big Data",
    "Développeur Full Stack",
    "Data / AI Engineer",
    "Computer Vision Engineer",
    "Formateur",
    "Entrepreneur",
  ],
  pitch:
    "Je conçois, développe et déploie des produits IA de bout en bout : de l'entraînement des modèles au déploiement Docker, jusqu'à l'adoption par les utilisateurs.",
  location: "Malika Plage, Dakar, Sénégal",
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
    "Ingénieur en Intelligence Artificielle & Big Data (Master à l'École Supérieure Polytechnique de Dakar, Licence de Mathématiques à l'UCAD), je cumule plus de 4 ans d'expérience à transformer des problématiques concrètes en produits numériques robustes.",
    "Ma spécialité : les systèmes IA de production. J'ai livré un pipeline biométrique complet (détection, anti-spoofing, reconnaissance faciale ArcFace) pour une institution d'État, des agents conversationnels sur données d'entreprise, et des plateformes SaaS déployées en ligne.",
    "Formateur depuis 4 ans et demi, je sais rendre la technique accessible aux décideurs comme aux développeurs, et je fais le pont entre la recherche et le terrain.",
  ],
  atouts: ["Esprit analytique", "Rigueur mathématique", "Autonomie", "Pédagogie", "Vision produit"],
};

export const stats = [
  { value: 4, suffix: "+", label: "Années d'expérience" },
  { value: 15, suffix: "+", label: "Projets & produits livrés" },
  { value: 999, prefix: "0.", label: "AUC ROC du pipeline biométrique", isMetric: true },
  { value: 100, suffix: "%", label: "Passion" },
];

export type TimelineItem = {
  year: string;
  title: string;
  org: string;
  icon: LucideIcon;
};

export const timeline: TimelineItem[] = [
  { year: "2016 – 2020", title: "Licence en Mathématiques", org: "Université Cheikh Anta Diop (UCAD)", icon: GraduationCap },
  { year: "2021", title: "Chargé de cours · Data & Full Stack", org: "GoMyCode Dakar", icon: GraduationCap },
  { year: "2024 – 2026", title: "Master IA & Big Data", org: "École Supérieure Polytechnique de Dakar", icon: BrainCircuit },
  { year: "2025", title: "Fondateur · SIGAC / VBS Digital", org: "Entreprise personnelle", icon: Building2 },
  { year: "2025 – 2026", title: "Full Stack Engineer · IA & Data", org: "Trésor Public de Dakar", icon: ScanFace },
  { year: "2025 – 2026", title: "Ingénieur DATAOPS / AIOPS", org: "CDSLABS · France (Freelance)", icon: Workflow },
];

export type SkillGroup = { name: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    name: "Intelligence Artificielle",
    items: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "ArcFace / InsightFace", "LangChain", "Ollama (LLM local)"],
  },
  {
    name: "Data & Big Data",
    items: ["Apache Spark", "Hadoop", "Kafka", "NiFi", "Talend", "Elasticsearch", "Kibana", "Power BI", "Tableau", "Pandas", "OpenTelemetry"],
  },
  {
    name: "Développement",
    items: ["Next.js", "React", "TypeScript", "NestJS", "Node.js", "Python", "Java", "Scala", "R", "REST API", "Prisma"],
  },
  {
    name: "Bases de données",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Oracle", "Neo4j", "Redis"],
  },
  {
    name: "DevOps & Cloud",
    items: ["Docker", "Kubernetes", "CI/CD", "Git", "Linux", "AWS", "OAuth2 / OIDC", "Swagger"],
  },
];

export type Service = { title: string; desc: string; icon: LucideIcon };

export const services: Service[] = [
  { title: "Solutions IA sur mesure", desc: "De la donnée au modèle en production : ML, deep learning, séries temporelles.", icon: BrainCircuit },
  { title: "Computer Vision", desc: "Détection, classification, tracking et pipelines vidéo temps réel.", icon: ScanFace },
  { title: "Reconnaissance faciale", desc: "Biométrie robuste avec anti-spoofing et vérification ArcFace.", icon: Fingerprint },
  { title: "Développement Full Stack", desc: "Applications web modernes Next.js / NestJS, du prototype à la production.", icon: Code2 },
  { title: "Plateformes SaaS", desc: "Architecture multi-tenant, auth, dashboards et facturation.", icon: Boxes },
  { title: "Applications & PWA", desc: "Expériences mobiles installables, rapides et hors-ligne.", icon: Smartphone },
  { title: "Analyse de données", desc: "ETL, tableaux de bord décisionnels et visualisation.", icon: BarChart3 },
  { title: "Automatisation & MLOps", desc: "Pipelines d'ingestion, monitoring et détection d'anomalies.", icon: Workflow },
  { title: "Consulting & Formation", desc: "Accompagnement technique et montée en compétences des équipes.", icon: Lightbulb },
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
    name: "Pointage biométrique · Trésor Public",
    tagline: "Reconnaissance faciale de production pour une institution d'État",
    description:
      "Pipeline biométrique complet remplaçant les feuilles de présence manuelles : détection SCRFD, anti-spoofing double couche (YOLO + MobileNetV3 par transfer learning) et vérification ArcFace (embeddings 512D, similarité cosinus).",
    highlights: [
      "AUC ROC de 0,999 et taux d'égale erreur de 1,8 % en validation croisée",
      "Identification en quelques secondes, géolocalisation multi-sites",
      "Déploiement Docker, architecture MVC, contrôle d'accès hiérarchique à 7 niveaux",
    ],
    tech: ["Python", "PyTorch", "OpenCV", "ArcFace", "YOLO", "Docker"],
    status: "En production",
    accent: "#22C55E",
  },
  {
    name: "SIGAC",
    tagline: "Gestion administrative intelligente du capital humain",
    description:
      "SaaS de gestion du personnel avec pointage par reconnaissance faciale et géolocalisation, adapté aux PME et établissements scolaires.",
    highlights: [
      "Pointage intelligent + géolocalisation intégrés",
      "Analytics RH et tableaux de bord décisionnels",
      "Multi-organisations, prêt pour le déploiement",
    ],
    tech: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Computer Vision"],
    status: "En développement",
    accent: "#16A34A",
  },
  {
    name: "VBS · Vos Besoins Services",
    tagline: "Marketplace de mise en relation clients ↔ prestataires",
    description:
      "Plateforme déployée en ligne connectant clients et prestataires de services, avec vérification par OTP, cartographie et parcours de réservation complet.",
    highlights: [
      "Authentification OTP (Twilio) et profils vérifiés",
      "Recherche géolocalisée avec cartographie",
      "Architecture conteneurisée, déployée en production",
    ],
    tech: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Twilio", "Docker"],
    status: "En ligne",
    link: "https://vbs.services",
    accent: "#22C55E",
  },
  {
    name: "Bolt Spreadsheet",
    tagline: "Tableur SaaS collaboratif augmenté par l'IA",
    description:
      "Plateforme collaborative où l'on interroge ses données en langage naturel via un agent conversationnel (LangChain + Ollama), avec pipelines d'ingestion automatisés.",
    highlights: [
      "Agent conversationnel LLM local sur données métier",
      "10+ connecteurs de données et dashboards partageables",
      "MFA, SSO (OAuth2/OIDC), détection d'anomalies par ML",
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
    role: "Full Stack Engineer · IA & Data",
    company: "Trésor Public, Dakar",
    period: "Août 2025 – Fév. 2026",
    points: [
      "Conception et entraînement d'un pipeline biométrique complet (SCRFD, anti-spoofing, ArcFace 512D).",
      "AUC ROC 0,999, EER 1,8 % : identification en quelques secondes.",
      "Déploiement Docker : architecture MVC, géolocalisation multi-sites, accès hiérarchique à 7 niveaux.",
    ],
  },
  {
    role: "Ingénieur DataOps / AIOps",
    company: "CDSLABS · France / Sénégal (remote)",
    period: "Jan. 2025 – Juin 2026",
    points: [
      "Agent conversationnel LangChain + Ollama pour interroger les données en langage naturel.",
      "10+ connecteurs, pipelines d'ingestion automatisés, dashboards multi-graphiques partageables.",
      "MFA, SSO (OAuth2/OIDC), Real User Monitoring, détection d'anomalies par ML.",
    ],
  },
  {
    role: "Fondateur & Développeur Principal",
    company: "SIGAC / VBS Digital, Dakar",
    period: "Depuis déc. 2025",
    points: [
      "SIGAC : SaaS de gestion du capital humain (pointage facial + géolocalisation).",
      "VBS : marketplace clients-prestataires déployée en ligne.",
    ],
  },
  {
    role: "Chargé de cours",
    company: "GoMyCode, Dakar",
    period: "Depuis déc. 2021",
    points: [
      "Introduction à l'Intelligence Artificielle · Formateur Data Analyst.",
      "Séries temporelles & visualisation · Bootcamp Développeur Full Stack.",
    ],
  },
];

export const education = [
  { degree: "Master en IA & Big Data", school: "École Supérieure Polytechnique de Dakar", period: "2024 – 2026" },
  { degree: "Licence en Mathématiques", school: "Université Cheikh Anta Diop de Dakar", period: "2016 – 2020" },
  { degree: "Baccalauréat S2", school: "Lycée Jules Sagna de Thiès", period: "2016" },
];

export const languages = [
  { name: "Français", level: "Courant" },
  { name: "Anglais", level: "Professionnel" },
];
