import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/Portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C Shrujan Reddy — Creative Developer · Python + MERN" },
      { name: "description", content: "Portfolio of C Shrujan Reddy, Computer Science student in Bengaluru building with Python, the MERN stack and data science." },
      { property: "og:title", content: "C Shrujan Reddy — Creative Developer" },
      { property: "og:description", content: "Python, MERN and data + AI projects by a CS student in Bengaluru." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});
