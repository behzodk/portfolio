export const projects = [
  {
    id: 1,
    title: "CompetentSwimming",
    description:
      "Full-stack platform for managing swimming lessons with role-based dashboards (Swimmer, Teacher, Admin), subscriptions, scheduling, progress tracking, and billing.",
    shortDescription: "Swimming lessons platform with role-based dashboards",
    image: "/dashboard-competentswimming.jpeg", // update path if needed
    category: "Web App",
    tags: ["React", "Supabase", "Stripe", "Postgres", "Edge Functions", "Tailwind"],
    links: {
      live: "https://competentswimming.co.uk",
      github: ""
    },
    problem:
      "Manual sign-ups, scattered payments, and limited visibility into lesson progress make swim-school ops inefficient.",
    solution:
      "A role-based web app using Supabase Auth and RLS for access control, class scheduling, subscriptions via Stripe (Edge Functions + webhooks), skills/levels progress tracking, and in-app notifications.",
    impact:
      "Simplifies scheduling and payments for families and staff while giving teachers clear progress tracking and admins clean controls.",
    role: "Founder & Full-Stack Developer",
    stack: ["React", "Supabase (Auth, Postgres, RLS)", "Stripe (Subscriptions, Webhooks)", "Edge Functions", "Tailwind CSS"]
  },
  {
    id: 2,
    title: "EYUFNavbat Bot",
    description: "A Telegram-based queue management system built during my internship at the El-Yurt Umidi (EYUF) Foundation to streamline document-submission flows. It handled ticketing, smart time-slotting, priority rules, multilingual prompts (Uzbek/Russian/English), and real-time counters for staff dashboards.",
    shortDescription: "Queue & document submission bot for EYUF",
    image: "/eyufnavbat.jpg",
    category: "Automation / Chatbots",
    tags: ["Python", "Telegram Bot API", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    links: {
      live: 'https://t.me/EyufNavbatBot',
      github: 'https://github.com/behzodk/eyufbot',
    },
    problem: "Staff faced long, unpredictable queues and manual spreadsheets while managing large groups of applicants submitting documents.",
    solution: "Designed a Telegram bot with ticket issuance, time-slot booking, priority lanes, auto-reminders, and an admin view showing real-time queue length, expected wait times, and no-show flags.",
    impact: "Cut average waiting time by ~45%, doubled peak-hour throughput, and reduced no-shows with automated reminders.",
    role: "Software Engineering Intern (Backend & Product)",
    stack: ["Python", "FastAPI", "Telegram Bot API", "PostgreSQL", "Redis", "Docker", "Nginx"]
  },
  {
    id: 3,
    title: "Retro Pong Online",
    description: "A 2D Pong remake with three modes: local multiplayer, AI opponent, and online PvP. Features retro pixel art, responsive canvas, WebSocket real-time play, matchmaking/lobbies, and lag compensation.",
    shortDescription: "Pong with AI + online multiplayer",
    image: "/pong.jpg",
    category: "Games / Web",
    tags: ["React", "Canvas", "WebSockets", "Node.js", "Express", "Redis"],
    links: {
      live: "https://pongs.games", // demo URL if hosted
      github: "https://github.com/behzodk/pong"  // repo URL
    },
    problem: "Simple web games rarely offer smooth real-time online play with both AI and multiplayer in one clean codebase.",
    solution: "Built a client–server architecture: React canvas client with fixed-timestep loop and input buffering; Node.js WebSocket server with authoritative state, room matchmaking, and basic ELO; AI paddle with predictive interception and difficulty scaling.",
    impact: "Stable 60 FPS render loop; ~80–120 ms median round-trip in EU tests; <1% desync after 10 minutes due to server authority and reconciliation.",
    role: "Game & Backend Engineer",
    stack: ["React", "HTML5 Canvas", "Node.js", "WebSockets (ws)", "Express", "Redis (rooms/leaderboard)"]
  },
  {
    id: 4,
    title: "Dovuchcha Originals",
    description: "A social project and YouTube series to improve Uzbek language and scientific literacy. We produce short pop-science videos with clear Uzbek narration, on-screen glossary cards, bilingual subtitles (Uz/En/Ru), and companion notes to help learners build vocabulary through real topics.",
    shortDescription: "Pop-science in Uzbek to boost language skills",
    image: "/Dovuchcha.png",
    category: "Community / Education",
    tags: ["YouTube", "Education", "Uzbek", "Subtitles", "Content Strategy"],
    links: {
      live: "https://youtube.com/@dovuchcha", // update if different
      github: null // content project; no public repo
    },
    problem: "Learners lack engaging, modern Uzbek content that builds language skills while explaining real science clearly.",
    solution: "Created a repeatable pipeline: topic research → plain-language script → glossary pack → bilingual subtitles → visuals and narration → publish + community prompts. Each video includes vocabulary highlights, example sentences, and a quick quiz.",
    impact: "Improved audience retention and vocabulary recall (measured via post-video quizzes and comments); steady growth in watch time and returning viewers; teachers use clips in class.",
    role: "Producer & Editor (scriptwriting, narration, subtitles, publishing, analytics)",
    stack: ["YouTube Studio", "Premiere Pro", "Audacity/Descript", "Figma", "OBS", "Notion"],
  }

]

export const blogPosts = [
  {
    id: 1,
    title: "Understanding Transformer Architecture",
    slug: "understanding-transformers",
    date: "2024-01-15",
    tags: ["AI", "Deep Learning", "NLP"],
    summary: "A deep dive into how transformer models revolutionized natural language processing",
    content: `# Understanding Transformer Architecture

Transformers have become the backbone of modern AI systems. In this post, we'll explore how they work.

## The Attention Mechanism

The key innovation of transformers is the attention mechanism, which allows models to focus on relevant parts of the input.

## Self-Attention

Self-attention enables each token to attend to all other tokens in the sequence, creating rich contextual representations.

## Multi-Head Attention

By using multiple attention heads, transformers can capture different types of relationships simultaneously.

## Conclusion

Transformers represent a paradigm shift in how we approach sequence modeling and have enabled breakthrough applications in NLP, vision, and beyond.`,
    cover: "/transformer-architecture.jpg",
  },
  {
    id: 2,
    title: "Building Production ML Systems",
    slug: "production-ml-systems",
    date: "2024-01-10",
    tags: ["Machine Learning", "Engineering", "Best Practices"],
    summary: "Best practices for deploying and maintaining machine learning models in production",
    content: `# Building Production ML Systems

Moving from research to production requires careful consideration of many factors.

## Model Versioning

Keeping track of model versions, training data, and hyperparameters is crucial for reproducibility.

## Monitoring and Observability

Production models need continuous monitoring to detect performance degradation and data drift.

## Scalability

Designing systems that can handle increasing load while maintaining latency requirements.

## Conclusion

Production ML is as much about engineering as it is about machine learning algorithms.`,
    cover: "/neural-network-tutorial.jpg",
  },
  {
    id: 3,
    title: "The Future of AI in Healthcare",
    slug: "ai-healthcare-future",
    date: "2024-01-05",
    tags: ["AI", "Healthcare", "Future"],
    summary: "Exploring how AI is transforming healthcare and what the future holds",
    content: `# The Future of AI in Healthcare

AI is poised to revolutionize healthcare in the coming years.

## Diagnostic Assistance

AI models can help radiologists and pathologists by providing second opinions and flagging potential issues.

## Drug Discovery

Machine learning accelerates the drug discovery process by predicting molecular properties and interactions.

## Personalized Medicine

AI enables personalized treatment plans based on individual genetic and health profiles.

## Challenges

Despite the promise, challenges around data privacy, regulatory approval, and clinical validation remain.

## Conclusion

The future of healthcare will be shaped by thoughtful integration of AI with human expertise.`,
    cover: "/ai-healthcare-future.jpg",
  },
]

export const galleryImages = [
  {
    id: 1,
    src: "/eyuf-volunteering.jpg",
    alt: "Volunteering with EYUF",
    caption: "Volunteering event organized by EYUF Foundation",
    category: "Community",
  },
  {
    id: 2,
    src: "/graduation.jpg",
    alt: "Graduation Ceremony",
    caption: "High school graduation day",
    category: "Personal",
  },
  {
    id: 3,
    src: "/london_trip.jpg",
    alt: "london Trip",
    caption: "Exploring London landmarks",
    category: "Travel",
  },
  {
    id: 4,
    src: "/oxford.jpg",
    alt: "oxford trip",
    caption: "Visiting Oxford University",
    category: "Travel",
  },
  {
    id: 5,
    src: "/uzbek_society.png",
    alt: "International Food Festival",
    caption: "with the Uzbek Society at the International Food Festival",
    category: "Community",
  },
  {
    id: 6,
    src: "/samarkand.jpg",
    alt: "Samarkand Visit",
    caption: "Exploring the historic city of Samarkand with Prime Minister Abdulla Aripov",
    category: "Travel",
  },
    {
    id: 7,
    src: "/football_cup.jpg",
    alt: "Football Cup",
    caption: "Winning the inter-school football cup",
    category: "Sports",
  },
]

export const skills = {
  "Machine Learning": ["TensorFlow", "PyTorch", "Scikit-learn", "XGBoost"],
  "Web Development": ["React", "Next.js", "Node.js", "TypeScript"],
  "Data Science": ["Python", "Pandas", "NumPy", "SQL"],
  "Tools & Platforms": ["Git", "Docker", "AWS", "Google Cloud"],
}

export const timeline = [
  {
    year: "2025 - Present",
    title: "Full-Stack Developer",
    organization: "Competent Swimming Ltd",
    description: "Designed and implemented role-based dashboards for Swimmer, Teacher, and Admin; clear navigation, responsive UI, and clean states and made comprehensive payment system integrating Stripe API for seamless transactions",
  },
  {
    year: "2025 Aug - Sep",
    title: "Data Analyst Intern",
    organization: "“El-Yurt Umidi” Foundation for the Training of Future-Oriented Specialists under the President of the Republic of Uzbekistan",
    description: "Built an AI model to analyze scholars’ social-media topics and presented the findings as clear visual dashboards.",
  },
  {
    year: "2025 - Present",
    title: "AI & Computer Science Student",
    organization: "University of Birmingham",
    description: "Pursuing degree in Artificial Intelligence and Computer Science",
  },
]
