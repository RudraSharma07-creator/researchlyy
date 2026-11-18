import astronomy from "@/assets/fields/astronomy.jpg";
import biology from "@/assets/fields/biology.jpg";
import economics from "@/assets/fields/economics.jpg";
import robotics from "@/assets/fields/robotics.jpg";
import environment from "@/assets/fields/environment.jpg";
import psychology from "@/assets/fields/psychology.jpg";
import history from "@/assets/fields/history.jpg";
import ai from "@/assets/fields/ai.jpg";
import chemistry from "@/assets/fields/chemistry.jpg";
import mathematics from "@/assets/fields/mathematics.jpg";
import medicine from "@/assets/fields/medicine.jpg";
import politics from "@/assets/fields/politics.jpg";

export type FieldKey =
  | "astronomy"
  | "biology"
  | "economics"
  | "robotics"
  | "environment"
  | "psychology"
  | "history"
  | "ai"
  | "chemistry"
  | "mathematics"
  | "medicine"
  | "politics";

export type Field = { key: FieldKey; label: string; image: string };

export const FIELDS: Field[] = [
  { key: "astronomy", label: "Astronomy", image: astronomy },
  { key: "biology", label: "Biology", image: biology },
  { key: "economics", label: "Economics", image: economics },
  { key: "robotics", label: "Robotics", image: robotics },
  { key: "environment", label: "Environmental Science", image: environment },
  { key: "psychology", label: "Psychology", image: psychology },
  { key: "history", label: "History", image: history },
  { key: "ai", label: "Computer Science & AI", image: ai },
  { key: "chemistry", label: "Chemistry", image: chemistry },
  { key: "mathematics", label: "Mathematics", image: mathematics },
  { key: "medicine", label: "Medicine & Neuroscience", image: medicine },
  { key: "politics", label: "Political Science & Law", image: politics },
];

export const fieldByKey = (key: FieldKey) => FIELDS.find((f) => f.key === key)!;

export type ItemKind = "research" | "course";

export type CatalogItem = {
  id: string;
  kind: ItemKind;
  field: FieldKey;
  title: string;
  duration: string;
  mode: string;
  level: string;
  price: number; // INR
  summary: string; // short, shown on hover
  details: string; // longer, shown in the slide panel
  includes: string[];
  benefits: string[];
};

export const CATALOG: CatalogItem[] = [
  // ───────── Research opportunities ─────────
  {
    id: "r-exoplanet",
    kind: "research",
    field: "astronomy",
    title: "Hunting Exoplanets with TESS Data",
    duration: "10 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 11 – UG",
    price: 14999,
    summary: "Analyse real NASA light-curve data to find and validate planets around distant stars.",
    details:
      "Work with a PhD astrophysicist to process public TESS satellite data in Python, spot transit dips, rule out false positives and write up a candidate planet in a short research paper.",
    includes: [
      "Weekly 1:1 sessions with a PhD mentor",
      "Python notebooks and real NASA datasets",
      "Guided research paper write-up",
      "Final presentation to a review panel",
    ],
    benefits: [
      "A genuine research paper for college applications",
      "Hands-on Python and data analysis skills",
      "Strong letter of recommendation",
    ],
  },
  {
    id: "r-crispr",
    kind: "research",
    field: "biology",
    title: "Gene Editing & CRISPR: A Literature-to-Lab Study",
    duration: "12 weeks",
    mode: "Online · Small group",
    level: "Class 11 – UG",
    price: 16999,
    summary: "Design a CRISPR experiment for a real disease target and defend your research proposal.",
    details:
      "Review recent CRISPR papers, pick a disease-linked gene, design guide RNAs using bioinformatics tools and build a complete wet-lab research proposal with your mentor.",
    includes: [
      "Group sessions with a molecular biologist",
      "Bioinformatics tools walkthrough",
      "Proposal and poster templates",
      "Peer review rounds",
    ],
    benefits: [
      "Understand cutting-edge genetics",
      "Publishable-quality research proposal",
      "Great for NEET, biotech and pre-med paths",
    ],
  },
  {
    id: "r-microfinance",
    kind: "research",
    field: "economics",
    title: "Microfinance & Women's Income in Rural India",
    duration: "10 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 10 – UG",
    price: 12999,
    summary: "Use national survey data to measure how small loans change household income.",
    details:
      "Clean and analyse NSSO / NFHS survey data, run regressions and write a policy paper on whether microfinance improves women's economic independence.",
    includes: [
      "1:1 mentorship with an economist",
      "Intro to Stata / R for econometrics",
      "Policy brief writing workshop",
      "Final paper review",
    ],
    benefits: [
      "Real econometrics experience",
      "Policy paper for your portfolio",
      "Ideal for economics, commerce and public-policy aspirants",
    ],
  },
  {
    id: "r-swarm",
    kind: "research",
    field: "robotics",
    title: "Swarm Robots for Disaster Rescue",
    duration: "12 weeks",
    mode: "Hybrid · Simulation",
    level: "Class 11 – UG",
    price: 18999,
    summary: "Program a robot swarm in simulation to search collapsed buildings for survivors.",
    details:
      "Build swarm algorithms in ROS and Gazebo, test search strategies in a simulated disaster zone and compare their efficiency in a research report.",
    includes: [
      "ROS + Gazebo setup support",
      "Weekly mentor code reviews",
      "Simulation environment and assets",
      "Demo video and report",
    ],
    benefits: [
      "Robotics and algorithm design skills",
      "Impressive project demo video",
      "Strong fit for engineering and JEE aspirants",
    ],
  },
  {
    id: "r-yamuna",
    kind: "research",
    field: "environment",
    title: "Microplastics in Indian Rivers",
    duration: "8 weeks",
    mode: "Online + Field kit",
    level: "Class 9 – UG",
    price: 10999,
    summary: "Collect river samples near you and map microplastic pollution across India.",
    details:
      "Receive a sampling kit, collect water from a local river or lake, count microplastics with a phone microscope and contribute to a nationwide citizen-science dataset.",
    includes: [
      "Home sampling and microscope kit",
      "Field-safety and method training",
      "Data analysis sessions",
      "Co-authored dataset credit",
    ],
    benefits: [
      "Field research experience",
      "Contribute to real environmental data",
      "Perfect for sustainability-minded students",
    ],
  },
  {
    id: "r-screentime",
    kind: "research",
    field: "psychology",
    title: "Screen Time & Teen Sleep: A Survey Study",
    duration: "10 weeks",
    mode: "Online · Small group",
    level: "Class 10 – UG",
    price: 11999,
    summary: "Design and run an ethical survey study on how phones affect students' sleep.",
    details:
      "Learn research ethics, build a validated questionnaire, collect responses from peers, analyse results statistically and present findings like a psychologist.",
    includes: [
      "Research ethics and consent training",
      "Survey design templates",
      "Statistics in Google Sheets / JASP",
      "Final conference-style talk",
    ],
    benefits: [
      "Understand how psychology research works",
      "Data and statistics confidence",
      "Great for psychology and social-science paths",
    ],
  },
  {
    id: "r-harappa",
    kind: "research",
    field: "history",
    title: "Decoding Harappan Trade Networks",
    duration: "8 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 9 – UG",
    price: 9999,
    summary: "Trace Indus Valley trade routes using seals, artefacts and archaeological reports.",
    details:
      "Study excavation reports and seal databases, map Harappan trade with Mesopotamia using free GIS tools, and write an argued historical essay.",
    includes: [
      "1:1 sessions with a historian",
      "Primary source reading packs",
      "Intro to QGIS mapping",
      "Essay feedback rounds",
    ],
    benefits: [
      "Original historical research essay",
      "Critical reading and argument skills",
      "Ideal for humanities and UPSC-minded students",
    ],
  },
  {
    id: "r-llm-indic",
    kind: "research",
    field: "ai",
    title: "Teaching AI to Understand Indian Languages",
    duration: "12 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 11 – UG",
    price: 19999,
    summary: "Fine-tune a small language model for Hindi, Tamil or another Indian language.",
    details:
      "Build a dataset in an Indian language, fine-tune an open-source model on free cloud GPUs, measure its accuracy and document results in a research paper.",
    includes: [
      "1:1 mentorship with an ML engineer",
      "Free GPU notebook setup",
      "Dataset building guide",
      "Paper and GitHub repo review",
    ],
    benefits: [
      "Real machine learning research",
      "GitHub portfolio project",
      "Top pick for CS and AI aspirants",
    ],
  },
  {
    id: "r-green-chem",
    kind: "research",
    field: "chemistry",
    title: "Green Catalysts from Kitchen Waste",
    duration: "10 weeks",
    mode: "Online · Small group",
    level: "Class 11 – UG",
    price: 13999,
    summary: "Explore how fruit-peel extracts can replace toxic chemicals in reactions.",
    details:
      "Review green-chemistry literature, model reactions computationally and design a safe home-lab experiment using natural catalysts from everyday waste.",
    includes: [
      "Group sessions with a chemist",
      "Computational chemistry tools",
      "Safe home-experiment protocol",
      "Research poster",
    ],
    benefits: [
      "Applied chemistry experience",
      "Sustainability-focused project",
      "Supports JEE, NEET and chemistry olympiad prep",
    ],
  },
  {
    id: "r-graph-theory",
    kind: "research",
    field: "mathematics",
    title: "Graph Theory & Mumbai Local Train Networks",
    duration: "10 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 10 – UG",
    price: 11999,
    summary: "Model a real metro network as a graph and find its weakest links.",
    details:
      "Learn graph theory from scratch, model the Mumbai suburban rail network, compute centrality and resilience, and propose improvements in a mathematical paper.",
    includes: [
      "1:1 sessions with a mathematician",
      "Python + NetworkX notebooks",
      "Proof-writing workshop",
      "Paper review",
    ],
    benefits: [
      "Real applied-math research",
      "Problem-solving and proof skills",
      "Great for olympiad and maths-major aspirants",
    ],
  },
  {
    id: "r-alzheimers",
    kind: "research",
    field: "medicine",
    title: "Early Alzheimer's Detection from Brain Scans",
    duration: "12 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 11 – UG",
    price: 17999,
    summary: "Analyse open MRI datasets to find early signs of Alzheimer's disease.",
    details:
      "Learn neuroanatomy basics, explore public MRI datasets, measure brain-region changes and build a simple classifier to flag early Alzheimer's risk.",
    includes: [
      "Mentorship by a neuroscience researcher",
      "Open MRI dataset access guide",
      "Medical imaging basics",
      "Research paper write-up",
    ],
    benefits: [
      "Medical research exposure",
      "Combines biology with data science",
      "Perfect for pre-med and NEET students",
    ],
  },
  {
    id: "r-panchayat",
    kind: "research",
    field: "politics",
    title: "Women in Panchayats: Does Representation Work?",
    duration: "8 weeks",
    mode: "Online · Small group",
    level: "Class 10 – UG",
    price: 9999,
    summary: "Study how reserved seats for women changed local governance in India.",
    details:
      "Review the 73rd Amendment, analyse village-level data and case studies, and write a policy paper on the impact of women's reservation in Panchayati Raj.",
    includes: [
      "Group sessions with a political scientist",
      "Case-study packs",
      "Policy writing workshop",
      "Mock policy presentation",
    ],
    benefits: [
      "Deep understanding of Indian governance",
      "Policy paper for your portfolio",
      "Great for law, CLAT and UPSC aspirants",
    ],
  },
  {
    id: "r-mangrove",
    kind: "research",
    field: "environment",
    title: "Satellite Mapping of Sundarbans Mangroves",
    duration: "10 weeks",
    mode: "Online · 1:1 mentor",
    level: "Class 11 – UG",
    price: 13999,
    summary: "Use free satellite images to measure mangrove loss over 20 years.",
    details:
      "Learn remote sensing with Google Earth Engine, track mangrove cover changes in the Sundarbans and link them to cyclones and human activity.",
    includes: [
      "Google Earth Engine training",
      "1:1 mentor sessions",
      "Mapping project templates",
      "Final map story and report",
    ],
    benefits: [
      "In-demand GIS and remote sensing skills",
      "Visually stunning project output",
      "Ideal for geography and climate enthusiasts",
    ],
  },
  {
    id: "r-behavioural",
    kind: "research",
    field: "economics",
    title: "Why Do We Overspend? Behavioural Economics Experiment",
    duration: "8 weeks",
    mode: "Online · Small group",
    level: "Class 9 – UG",
    price: 9999,
    summary: "Run a simple online experiment on how UPI changes spending habits.",
    details:
      "Learn behavioural economics concepts, design an online experiment, collect data from peers and analyse whether digital payments make people spend more.",
    includes: [
      "Group mentor sessions",
      "Experiment design toolkit",
      "Data analysis walkthrough",
      "Short research article",
    ],
    benefits: [
      "Fun intro to economic research",
      "Experiment design skills",
      "Good for commerce and economics students",
    ],
  },

  // ───────── Courses ─────────
  {
    id: "c-astro-101",
    kind: "course",
    field: "astronomy",
    title: "Astrophysics: From Stars to Black Holes",
    duration: "6 weeks",
    mode: "Live online classes",
    level: "Beginner",
    price: 4999,
    summary: "A visual journey through stars, galaxies, black holes and the Big Bang.",
    details:
      "Twelve live classes covering stellar life cycles, galaxies, black holes and cosmology, with telescope-observation nights and simple Python sky simulations.",
    includes: [
      "12 live classes + recordings",
      "Virtual stargazing sessions",
      "Weekly quizzes",
      "Certificate of completion",
    ],
    benefits: [
      "Strong foundation for astronomy olympiads",
      "No prior physics required",
      "Learn to read the night sky",
    ],
  },
  {
    id: "c-bio-human",
    kind: "course",
    field: "biology",
    title: "Human Biology & Genetics Essentials",
    duration: "8 weeks",
    mode: "Live online classes",
    level: "Beginner – Intermediate",
    price: 5499,
    summary: "Understand how the human body and DNA work, beyond the textbook.",
    details:
      "Covers cells, organ systems, inheritance, DNA technology and modern medicine with animated lessons and virtual lab experiments.",
    includes: [
      "16 live classes + recordings",
      "Virtual lab simulations",
      "Concept notes and mind maps",
      "Certificate of completion",
    ],
    benefits: [
      "Boosts NEET and board exam understanding",
      "Builds curiosity for biomedical careers",
      "Clear visual explanations",
    ],
  },
  {
    id: "c-econ-101",
    kind: "course",
    field: "economics",
    title: "Economics for Curious Minds",
    duration: "6 weeks",
    mode: "Self-paced + live Q&A",
    level: "Beginner",
    price: 3999,
    summary: "Learn how markets, inflation, budgets and RBI policy shape everyday life.",
    details:
      "A friendly introduction to micro- and macroeconomics using Indian examples — from onion prices to the Union Budget — with weekly live doubt sessions.",
    includes: [
      "30+ short video lessons",
      "Weekly live Q&A",
      "Real Indian case studies",
      "Certificate of completion",
    ],
    benefits: [
      "Understand news and policy with confidence",
      "Great for commerce and humanities students",
      "Foundation for economics degrees",
    ],
  },
  {
    id: "c-arduino",
    kind: "course",
    field: "robotics",
    title: "Build Your First Robot with Arduino",
    duration: "8 weeks",
    mode: "Live online + home kit",
    level: "Beginner",
    price: 6999,
    summary: "Build and code a line-following, obstacle-avoiding robot at home.",
    details:
      "Get an Arduino robotics kit delivered and learn electronics, sensors, motors and C++ programming step by step until your robot drives itself.",
    includes: [
      "Arduino robot kit delivered",
      "16 live build sessions",
      "Code templates and circuit diagrams",
      "Certificate of completion",
    ],
    benefits: [
      "Hands-on engineering skills",
      "A working robot you keep",
      "Great first step for robotics competitions",
    ],
  },
  {
    id: "c-climate",
    kind: "course",
    field: "environment",
    title: "Climate Change & Sustainable India",
    duration: "5 weeks",
    mode: "Self-paced + live Q&A",
    level: "Beginner",
    price: 2999,
    summary: "Understand climate science and India's path to a greener future.",
    details:
      "Explore the greenhouse effect, monsoon changes, renewable energy and sustainable cities, ending with your own climate action plan for your school or town.",
    includes: [
      "25 video lessons",
      "Live expert sessions",
      "Climate action project",
      "Certificate of completion",
    ],
    benefits: [
      "Science-backed climate literacy",
      "Real-world action project",
      "Useful for any academic background",
    ],
  },
  {
    id: "c-psych-intro",
    kind: "course",
    field: "psychology",
    title: "Introduction to Psychology",
    duration: "6 weeks",
    mode: "Live online classes",
    level: "Beginner",
    price: 4499,
    summary: "Discover how memory, emotions, motivation and behaviour really work.",
    details:
      "Covers the brain, learning, memory, emotions, personality and mental health with interactive experiments you can try on yourself and friends.",
    includes: [
      "12 live classes + recordings",
      "Interactive mini-experiments",
      "Study and wellbeing toolkit",
      "Certificate of completion",
    ],
    benefits: [
      "Better study habits and self-awareness",
      "Foundation for psychology degrees",
      "Engaging for every stream",
    ],
  },
  {
    id: "c-history-india",
    kind: "course",
    field: "history",
    title: "Empires of India: Mauryas to Mughals",
    duration: "6 weeks",
    mode: "Self-paced + live Q&A",
    level: "Beginner",
    price: 3499,
    summary: "Storytelling-led course on the empires, art and ideas that shaped India.",
    details:
      "Travel through the Mauryan, Gupta, Chola, Vijayanagara and Mughal eras using maps, monuments and primary sources, with virtual heritage walks.",
    includes: [
      "30 story-based video lessons",
      "Virtual heritage walks",
      "Timeline and map packs",
      "Certificate of completion",
    ],
    benefits: [
      "Makes history memorable",
      "Helps with boards and UPSC foundations",
      "Builds analytical thinking",
    ],
  },
  {
    id: "c-python-ai",
    kind: "course",
    field: "ai",
    title: "Python & AI for Beginners",
    duration: "8 weeks",
    mode: "Live online classes",
    level: "Beginner",
    price: 5999,
    summary: "Learn Python from zero and build your own simple AI chatbot and image classifier.",
    details:
      "Start with Python basics, move to data handling and machine learning, and finish by building two AI projects you can show on GitHub.",
    includes: [
      "16 live coding classes",
      "Two portfolio AI projects",
      "Code reviews from mentors",
      "Certificate of completion",
    ],
    benefits: [
      "No coding experience needed",
      "Future-ready tech skills",
      "Portfolio projects for applications",
    ],
  },
  {
    id: "c-chem-lab",
    kind: "course",
    field: "chemistry",
    title: "Chemistry in Everyday Life",
    duration: "5 weeks",
    mode: "Self-paced + live Q&A",
    level: "Beginner",
    price: 2999,
    summary: "The chemistry behind cooking, medicines, cosmetics and fireworks.",
    details:
      "Connects class 9–12 chemistry to real life with safe home experiments, explainer videos and live sessions with practising chemists.",
    includes: [
      "Safe home experiment guides",
      "25 video lessons",
      "Live chemist Q&A",
      "Certificate of completion",
    ],
    benefits: [
      "Makes chemistry intuitive",
      "Strengthens board exam concepts",
      "Fun for every stream",
    ],
  },
  {
    id: "c-math-olympiad",
    kind: "course",
    field: "mathematics",
    title: "Olympiad Maths Problem Solving",
    duration: "10 weeks",
    mode: "Live online classes",
    level: "Intermediate",
    price: 6499,
    summary: "Master number theory, combinatorics and geometry tricks for olympiads.",
    details:
      "Weekly problem-solving workshops on olympiad topics with mock tests, detailed solutions and personalised feedback from olympiad medallists.",
    includes: [
      "20 live workshops",
      "Mock olympiad tests",
      "Detailed solution videos",
      "Certificate of completion",
    ],
    benefits: [
      "Prepares for IOQM / RMO",
      "Sharper logical thinking",
      "Boosts JEE problem solving",
    ],
  },
  {
    id: "c-neuro",
    kind: "course",
    field: "medicine",
    title: "Neuroscience: How Your Brain Works",
    duration: "6 weeks",
    mode: "Live online classes",
    level: "Beginner",
    price: 4999,
    summary: "Explore neurons, senses, sleep and learning in a lively neuroscience course.",
    details:
      "From neurons and brain regions to sleep, memory and brain disorders, with case studies from doctors and simple brain experiments.",
    includes: [
      "12 live classes + recordings",
      "Doctor case-study sessions",
      "Brain anatomy 3D models",
      "Certificate of completion",
    ],
    benefits: [
      "Great foundation for medicine",
      "Learn how to study smarter",
      "Engaging for science and humanities students",
    ],
  },
  {
    id: "c-constitution",
    kind: "course",
    field: "politics",
    title: "The Indian Constitution & You",
    duration: "5 weeks",
    mode: "Self-paced + live Q&A",
    level: "Beginner",
    price: 2499,
    summary: "Understand your rights, landmark judgements and how Parliament works.",
    details:
      "Covers Fundamental Rights, Directive Principles, landmark Supreme Court cases and how laws are made, ending with a mock Parliament debate.",
    includes: [
      "20 video lessons",
      "Landmark case summaries",
      "Mock Parliament debate",
      "Certificate of completion",
    ],
    benefits: [
      "Become an informed citizen",
      "Strong base for CLAT and law school",
      "Builds debating and reasoning skills",
    ],
  },
  {
    id: "c-data-science",
    kind: "course",
    field: "ai",
    title: "Data Science with Real Indian Data",
    duration: "8 weeks",
    mode: "Live online classes",
    level: "Intermediate",
    price: 6999,
    summary: "Analyse cricket stats, census data and weather records with Python.",
    details:
      "Learn pandas, visualisation and basic statistics by working on fun Indian datasets — IPL, census and monsoon records — and build a data story.",
    includes: [
      "16 live classes",
      "Curated Indian datasets",
      "Capstone data story project",
      "Certificate of completion",
    ],
    benefits: [
      "Highly employable skill",
      "Useful in every subject",
      "Portfolio-ready project",
    ],
  },
  {
    id: "c-research-methods",
    kind: "course",
    field: "psychology",
    title: "Research Methods & Academic Writing",
    duration: "4 weeks",
    mode: "Live online classes",
    level: "All levels",
    price: 3499,
    summary: "Learn how to ask questions, read papers and write like a researcher.",
    details:
      "A cross-disciplinary course covering research questions, literature reviews, citing sources, basic statistics and writing a short research paper.",
    includes: [
      "8 live classes",
      "Paper-reading templates",
      "Writing feedback",
      "Certificate of completion",
    ],
    benefits: [
      "Perfect companion to any research programme",
      "Useful for every field",
      "Better essays and projects",
    ],
  },
];

export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const itemById = (id: string) => CATALOG.find((i) => i.id === id);
