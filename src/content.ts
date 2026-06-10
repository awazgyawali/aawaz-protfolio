export const hero = {
  kicker: "Senior Software Engineer · Toptal Top 3% · Remote",
  roles: [
    "Mobile Platform Architecture",
    "Real-time Systems at Scale",
    "Cross-platform Engineering",
    "AI-Augmented Development",
    "Technical Leadership",
  ],
  title: "I build systems that millions use daily.",
  body: "8 years shipping production software. Architected Nepal's #1 stock trading platform (100k+ DAU). Senior engineer at GreyOrange on gStore — the in-store execution platform used by Fortune 500 retailers. Real-time mobile systems, Flutter at scale, AI-accelerated delivery without cutting corners.",
  ctas: [
    { label: "View case studies", target: "work", primary: true },
    { label: "Download resume", href: "https://www.toptal.com/developers/resume/avaaj-gyawali" },
    { label: "Get in touch", target: "contact" },
  ],
};

export const manifesto = {
  title: "AI-native engineering workflow.",
  body: "I use AI agents for research, scaffolding, and testing — so human hours go to architecture, complex problem-solving, and product decisions. Faster delivery without cutting corners on quality. The numbers below are production systems, not side projects.",
  stats: [
    { value: 8, suffix: "+", label: "years production experience" },
    { value: 100, suffix: "k+", label: "daily active users" },
    { value: 1000, suffix: "+", label: "stores on gStore" },
    { value: 3, suffix: "", label: "Fortune 500 clients" },
  ],
  brands:
    "Currently: **GreyOrange** (gStore platform). Previously: **ETTEO** (field operations), **Toptal** (blockchain & logistics for F500), **Brainants** (co-founder, telemedicine platform).",
};

export const arsenal = {
  title: "Platform expertise.",
  body: "Deep specialization in mobile platform architecture with full-stack capabilities for end-to-end delivery.",
  rings: [
    {
      name: "core",
      color: "#00e0c6",
      radius: 130,
      tilt: 16,
      speed: 14,
      skills: ["Flutter Architecture", "Real-time Systems", "Offline-First Design", "Performance Optimization"],
    },
    {
      name: "mobile",
      color: "#ff2e63",
      radius: 190,
      tilt: 8,
      speed: -10,
      skills: ["iOS Native", "Android Native", "BLE / IoT", "Video Streaming"],
    },
    {
      name: "backend",
      color: "#c8ff00",
      radius: 250,
      tilt: 2,
      speed: 7,
      skills: ["Node.js", "Firebase", "MongoDB", "PostgreSQL", "GCP"],
    },
  ],
};

export const work = {
  slides: [
    {
      kicker: "Nepal Share · CTO & Lead Architect · 2017 — Present",
      title: "The stock market app for Nepal.",
      body: "Architected and built Nepal's largest financial platform from scratch. Real-time stock data pipeline, offline-first architecture for low-connectivity regions, and CI/CD infrastructure. Self-sustaining platform I maintain while working full-time — systems that don't require constant firefighting.",
      metrics: [
        { value: "100k+", label: "daily active users" },
        { value: "4.6★", label: "app store rating" },
        { value: "#1", label: "finance app in Nepal" },
        { value: "8 yrs", label: "self-maintained" },
      ],
      tags: ["Flutter", "Real-time Data", "System Architecture", "Solo Maintenance"],
    },
    {
      kicker: "GreyOrange · Senior Software Engineer · 2023 — Present",
      title: "In-store execution for global retail.",
      body: "Senior engineer on gStore, the task orchestration platform used by Fortune 500 retailers worldwide. Lead feature development across replenishment, shipping, and the real-time tablet command center store managers run their floors on. Multi-tenant architecture serving 1000+ store locations.",
      metrics: [
        { value: "1000+", label: "store locations" },
        { value: "F500", label: "client roster" },
        { value: "3", label: "core product areas" },
      ],
      tags: ["Flutter", "Retail Tech", "Multi-tenant Systems", "Task Orchestration"],
    },
    {
      kicker: "Brainants Technology · Co-founder · 2018 — Present",
      title: "Built a company before graduating.",
      body: "Co-founded Brainants in college — now a self-sustaining services firm. Nepal's largest telemedicine app, a custom BLE scanner for a major North American enterprise, a child-protection tracking app for an international NGO, and ten-plus major Flutter products.",
      metrics: [
        { value: "10+", label: "major products" },
        { value: "#1", label: "telemedicine in Nepal" },
        { value: "8 yrs", label: "and counting" },
      ],
      tags: ["Founding", "Flutter", "BLE", "TDD", "Leadership"],
    },
    {
      kicker: "Toptal · Top 3% · Fortune 500 clients",
      title: "Vetted for the world's best companies.",
      body: "Through Toptal: blockchain integration, advanced GPS tracking, and logistics platforms for a major North American agricultural company and LogistixAi. 25+ freelance projects across automotive, real estate, BLE medical devices, and video streaming.",
      metrics: [
        { value: "F500", label: "client roster" },
        { value: "25+", label: "projects delivered" },
        { value: "Top 3%", label: "Toptal network" },
      ],
      tags: ["Blockchain", "GPS / Logistics", "BLE Medical", "Streaming"],
    },
    {
      kicker: "Selected highlights",
      title: "Hard problems, shipped.",
      body: "A spin-the-wheel comment UI for Muzdo that Flutter wasn't supposed to handle. An entrance-prep app that helped 10,000+ students get admitted. An election-results app 100,000+ Nepalis refreshed all night. Flick the wheel — client feedback, not marketing copy.",
      metrics: [
        { value: "10k+", label: "students admitted" },
        { value: "100k+", label: "election-night users" },
      ],
      tags: ["Muzdo", "CSIT Entrance", "Election App"],
      wheel: ["“rehire ✓”", "“ships fast”", "“top 3%”", "“unreal UI”", "“just works”", "“strong architect”", "“5★ track record”", "“would recommend”"],
    },
  ],
};

export const agentops = {
  title: "AI-accelerated delivery.",
  body: "My workflow integrates AI agents for research, code generation, and testing. Not replacing engineering — eliminating boilerplate so human time goes to architecture and hard problems.",
  punch: "Result: faster delivery, same code quality, more time for system design.",
  examples: [
    { task: "API scaffolding", time: "Traditional: 4h → With agents: 45min" },
    { task: "Test coverage", time: "Traditional: 3h → With agents: 30min" },
    { task: "Research & docs", time: "Traditional: 2h → With agents: 15min" },
    { task: "Code review prep", time: "Traditional: 1h → With agents: 10min" },
  ],
};

export const openSource = {
  title: "Ecosystem contributions.",
  body: "Verified pub.dev publisher. When the Flutter ecosystem lacked critical integrations, I built and open-sourced them.",
  cards: [
    {
      name: "stripe_terminal",
      stars: "pub.dev publisher",
      desc: "First-party Stripe Terminal SDK for Flutter — card reader discovery, connection, and in-person payments.",
      link: "https://pub.dev/packages/stripe_terminal",
    },
    {
      name: "rn_flutter",
      stars: "29★ · reference impl",
      desc: "React Native and Flutter coexisting in a single Android app. Proof of concept for gradual migrations.",
      link: "https://github.com/awazgyawali/rn_flutter",
    },
    {
      name: "flutter_khalti",
      stars: "community package",
      desc: "Unofficial Khalti payments bridge — enabling Nepali merchants to accept digital payments via Flutter.",
      link: "https://github.com/awazgyawali/flutter_khalti",
    },
    {
      name: "multipart_request",
      stars: "utility package",
      desc: "Native multipart uploads with progress callbacks. Addresses Flutter's gap in large file upload handling.",
      link: "https://github.com/awazgyawali/multipart_request",
    },
  ],
  badges: ["Flutter Contributor", "FlutterFire Contributor", "Verified pub.dev Publisher"],
  medium: { label: "Technical writing on Medium →", link: "https://medium.com/@awazgyawali" },
};

export const journey = {
  title: "Career progression.",
  items: [
    { year: "2015", title: "First production code", text: "Started shipping while in college." },
    { year: "2017", title: "Nepal Share launched", text: "Side project becomes national financial platform." },
    { year: "2018", title: "Co-founded Brainants", text: "Telemedicine, NGOs, enterprise BLE. Learned to run a company." },
    { year: "2020", title: "Senior remote @ ETTEO", text: "Offline-first field tooling for enterprise. First F500 exposure." },
    { year: "2022", title: "Top 3% on Toptal", text: "Vetted network. Blockchain, GPS logistics, medical devices." },
    { year: "2023", title: "Senior Engineer @ GreyOrange", text: "gStore team. Scale challenges with Fortune 500 retail." },
    { year: "2025", title: "Staff Engineer track", text: "System architecture, mentoring, AI-augmented delivery." },
  ],
};

export const contact = {
  title: "Let's talk.",
  body: "Open to senior engineering roles, technical advisory positions, and select consulting engagements. Based in Kathmandu, working globally.",
  availability: "Available for opportunities",
  email: "awazgyawali@gmail.com",
  resumeUrl: "https://www.toptal.com/developers/resume/avaaj-gyawali",
  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/aawaz/" },
    { label: "GitHub", url: "https://github.com/awazgyawali" },
    { label: "Toptal Profile", url: "https://www.toptal.com/developers/resume/avaaj-gyawali" },
    { label: "Medium", url: "https://medium.com/@awazgyawali" },
    { label: "pub.dev", url: "https://pub.dev/publishers/aawaz.dev/packages" },
  ],
  footer: "Avaaj Gyawali · Senior Software Engineer",
};
