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
    id: "journey-2021",
    year: "2021",
    month: "September",
    day: "15",
    title: "Started My Tech Journey",
    description:
      "Began learning web development and built my first projects. Explored HTML, CSS, and JavaScript fundamentals while creating simple websites and applications.",
    photos: [
      "https://picsum.photos/seed/tech2021a/800/600",
      "https://picsum.photos/seed/tech2021b/800/600",
      "https://picsum.photos/seed/tech2021c/800/600",
    ],
  },
  {
    id: "journey-2022",
    year: "2022",
    month: "March",
    day: "08",
    title: "Deepened Frontend Skills",
    description:
      "Mastered React and modern frontend frameworks. Started contributing to open-source projects and built more complex web applications with state management.",
    photos: [
      "https://picsum.photos/seed/code2022a/800/600",
      "https://picsum.photos/seed/code2022b/800/600",
      "https://picsum.photos/seed/code2022c/800/600",
    ],
  },
  {
    id: "journey-2023",
    year: "2023",
    month: "July",
    day: "22",
    title: "Full-Stack Development",
    description:
      "Expanded into backend development with Node.js and databases. Learned about system design, APIs, and deployed production applications.",
    photos: [
      "https://picsum.photos/seed/fullstack2023a/800/600",
      "https://picsum.photos/seed/fullstack2023b/800/600",
      "https://picsum.photos/seed/fullstack2023c/800/600",
    ],
  },
  {
    id: "journey-2024",
    year: "2024",
    month: "January",
    day: "10",
    title: "Leading Projects & Innovation",
    description:
      "Took on leadership roles in development teams. Focused on performance optimization, accessibility, and cutting-edge technologies like AI integration.",
    photos: [
      "https://picsum.photos/seed/lead2024a/800/600",
      "https://picsum.photos/seed/lead2024b/800/600",
      "https://picsum.photos/seed/lead2024c/800/600",
    ],
  },
];
