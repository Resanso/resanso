export interface JourneyItem {
  id: string;
  year: string;
  month: string;
  day: string;
  title: string;
  description: string;
  photos: string[];
}

export const journeyData: JourneyItem[] = [
  {
    id: "journey-2024-telkom",
    year: "2024",
    month: "June",
    day: "02",
    title: "Telkom University",
    description:
      "Marked the beginning of my academic journey at Telkom University as an Informatics undergraduate. This pivotal moment transformed my passion for technology into a structured pursuit of knowledge.",
    photos: [
      "/journey/journey-1/bg/bg-1.png",
      "https://picsum.photos/seed/tech2021b/800/600",
      "https://picsum.photos/seed/tech2021c/800/600",
    ],
  },
  {
    id: "journey-2025-digital-twin",
    year: "2025",
    month: "March",
    day: "08",
    title: "Digital Twin Project",
    description:
      "Participated in a Digital Twin implementation project for a manufacturing factory in Medan, North Sumatra, leveraging advanced simulation technologies to optimize industrial processes.",
    photos: [
      "/journey/journey-2/bg/bg-2.png",
      "https://picsum.photos/seed/code2022b/800/600",
      "https://picsum.photos/seed/code2022c/800/600",
    ],
  },
  {
    id: "journey-2025-adacareer",
    year: "2025",
    month: "May",
    day: "18",
    title: "Frontend Developer at ADACAREER",
    description:
      "Started my professional career as a Frontend Developer at ADACAREER, contributing to the development of a comprehensive job search and career growth platform.",
    photos: [
      "/journey/journey-3/bg/bg-3.jpg",
      "https://picsum.photos/seed/fullstack2023b/800/600",
      "https://picsum.photos/seed/fullstack2023c/800/600",
    ],
  },
  {
    id: "journey-2025-ericsson",
    year: "2025",
    month: "November",
    day: "14",
    title: "1st Place - Ericsson Hackathon 2025",
    description:
      "Secured 1st Place in Ericsson Hackathon 2025: Indonesia’s NextGen Digital Sprint with 5G and AI. Developed an innovative solution leveraging 5G and Artificial Intelligence to solve real-world challenges.",
    photos: [
      "/journey/journey-4/bg/bg-4.png",
      "https://picsum.photos/seed/lead2024b/800/600",
      "https://picsum.photos/seed/lead2024c/800/600",
    ],
  },
];

// Personal photos for each journey period - ganti dengan foto asli Anda
export const personalPhotos = [
  "/journey/journey-1/me-1.png", // 2021
  "/journey/journey-2/me-2.png", // 2022 (Actually 2025 based on new data)
  "/journey/journey-3/me-3.png", // 2023
  "/journey/journey-4/me-4.jpg", // 2024
];
