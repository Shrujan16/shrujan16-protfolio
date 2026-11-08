/**
 * ============================================================
 *  ALL YOUR PORTFOLIO CONTENT LIVES HERE.
 *  Edit text, links and lists in this file only — every section
 *  of the site reads from these objects.
 * ============================================================
 */

export const profile = {
  name: "C Shrujan Reddy",
  // The giant words over your portrait. They swap as you scroll.
  kineticWords: ["CREATIVE DEVELOPER", "PYTHON + MERN", "DATA + AI BUILDER"],
  tagline:
    "Computer Science student at Nagarjuna College of Engineering and Technology, Bengaluru, building with Python, the MERN stack and data science.",
  about: [
    "I'm an aspiring computer science engineer looking for real-world opportunities to apply programming, web development and data science.",
    "I want to grow inside a dynamic, innovative organisation — learning fast through impactful projects and shipping things that matter.",
  ],
  email: "shrujan16@gmail.com",
  // TODO: replace with your real URLs (leave "" to hide a button).
  linkedin: "",
  github: "",
  resumeUrl: "/downloads/C_Shrujan_Reddy_Resume.pdf",
  openToWork: true,
};

export const skills = [
  { group: "Python", items: ["Core Python", "OOP", "REST APIs"] },
  { group: "Web", items: ["Node.js", "MERN Stack"] },
  { group: "Data & AI", items: ["Data Science", "Supervised ML"] },
  { group: "Security", items: ["Cybersecurity concepts", "Classical ciphers"] },
];

// Words that scroll in the tilted marquee strip.
export const marquee = ["Python", "Node.js", "MongoDB", "Express", "React", "REST APIs", "Machine Learning", "OOP", "Cryptography"];

export const education = [
  {
    degree: "B.E. Computer Science and Engineering",
    school: "Nagarjuna College of Engineering and Technology, Bengaluru",
    detail: "3rd year · 5th semester",
  },
];

export const experience = [
  // TODO: add dates and what you worked on.
  { role: "Trainee", company: "ToriiMinds", detail: "" },
];

export const certifications = [
  { title: "Python Essentials 1", issuer: "Cisco Networking Academy", date: "Aug 2025" },
  { title: "Python Programming with Red Hat (AD141)", issuer: "Red Hat", date: "Aug 2025" },
  { title: "Master Python in 60 Minutes for Full Stack Developers", issuer: "SkillEcted", date: "Aug 2025" },
  { title: "OOP in Python Bootcamp", issuer: "SkillEcted", date: "Aug 2025" },
  { title: "Data Science Roadmap + Supervised ML in Action", issuer: "SkillEcted", date: "Aug 2025" },
  { title: "Master RESTful APIs with Node.js", issuer: "SkillEcted", date: "Aug 2025" },
  { title: "Classical Ciphers in Cybersecurity Bootcamp", issuer: "SkillEcted", date: "Aug 2025" },
  { title: "Build an AI Voice Assistant with MERN Stack", issuer: "SkillEcted", date: "Aug 2025" },
];

// Only real numbers. Add more when you have them.
export const stats = [
  { value: certifications.length, suffix: "", label: "Certifications" },
  { value: 4, suffix: "", label: "Projects in progress" },
  { value: 5, suffix: "th", label: "Semester, B.E. CSE" },
];

export const projects = [
  {
    title: "Why-Engine",
    summary:
      "Finds WHY traffic is jammed, not just where — combining camera and traffic data with context (rain, events, bus stops, illegal parking, signal timing), then labels the root cause and recommends a fix.",
    tags: ["Computer vision", "Data fusion", "AI"],
    status: "Draft",
    link: "", // TODO
  },
  { title: "SkillBridge", summary: "Student skill-gap and career roadmap platform.", tags: ["MERN", "Careers"], status: "Draft", link: "" },
  { title: "iQOO Hackathon 2026", summary: "Phone-first AI build.", tags: ["AI", "Mobile"], status: "Hackathon", link: "" },
  { title: "Smart Dustbin", summary: "Sensors + AI waste-bin concept.", tags: ["IoT", "AI"], status: "Research", link: "" },
];

// Optional: create a free form at formspree.io and paste its ID (e.g. "xyzabcd").
// While empty, the contact form opens your email app instead.
export const formspreeId = "";
