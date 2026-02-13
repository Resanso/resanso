"use client";

// Work type definition
export interface Work {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  x: string;
  y: string;
  rotate: number;
}

// Works data with closer positioning and more details
export const works: Work[] = [
  {
    id: 1,
    title: "ADACareer Job Platform",
    category: "SaaS Application",
    description: "A comprehensive job search platform helping users find their first job in 7 days. Features CV upload, automated matching, and career guidance tools.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    image: "/works/works-1.png",
    x: "15%",
    y: "15%",
    rotate: -3,
  },
  {
    id: 2,
    title: "Jari Pemoeda Advocacy",
    category: "Non-Profit Platform",
    description: "Digital advocacy platform for HMI to map, analyze, and advocate for social issues. Centralized data bank and research participation hub.",
    technologies: ["React", "Node.js", "PostgreSQL", "Express"],
    image: "/works/works-2.png",
    x: "40%",
    y: "10%",
    rotate: 2,
  },
  {
    id: 3,
    title: "Manjo Catering",
    category: "E-Commerce",
    description: "Modern landing page and ordering system for a premium catering service. Features appetizing menu gallery, reviews, and seamless ordering flow.",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    image: "/works/works-3.png",
    x: "65%",
    y: "18%",
    rotate: -2,
  },
  {
    id: 4,
    title: "FRI Certification Portal",
    category: "Academic System",
    description: "Official digital platform for the Faculty of Industrial Engineering, Telkom University. Streamlines lecturer certification and training approvals.",
    technologies: ["Laravel", "Vue.js", "MySQL", "Bootstrap"],
    image: "/works/works-4.png",
    x: "20%",
    y: "40%",
    rotate: 4,
  },
  {
    id: 5,
    title: "Ergonomics Research Lab",
    category: "Research Portal",
    description: "Interactive website for the Product Development & Ergonomics Laboratory. Showcases research activities, team members, and 3D assets.",
    technologies: ["Three.js", "React", "GSAP", "WebGL"],
    image: "/works/works-5.png",
    x: "50%",
    y: "35%",
    rotate: -4,
  },
  {
    id: 6,
    title: "Local Food Delivery",
    category: "Mobile App / PWA",
    description: "Hyperlocal food delivery application featuring real-time driver tracking, menu browsing, and location-based merchant discovery.",
    technologies: ["React", "Leaflet Maps", "Firebase", "PWA"],
    image: "/works/works-6.png",
    x: "75%",
    y: "45%",
    rotate: 3,
  },
  {
    id: 7,
    title: "TRICH Barberspace",
    category: "Booking System",
    description: "Premium booking platform for a modern barbershop. Allows customers to view services, check waiting lists, and book appointments online.",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Radix UI"],
    image: "/works/works-7.png",
    x: "30%",
    y: "65%",
    rotate: -3,
  },
  {
    id: 8,
    title: "MINERVA Digital Twin",
    category: "Industrial IoT",
    description: "Real-time Digital Twin dashboard for industrial manufacturing. Monitors furnace data, energy usage, and machine status with AI optimization.",
    technologies: ["React", "Socket.io", "Chart.js", "IoT"],
    image: "/works/works-8.png",
    x: "55%",
    y: "60%",
    rotate: 2,
  },
  {
    id: 9,
    title: "3D Logistics Simulation",
    category: "Simulation",
    description: "Advanced 3D simulation of factory logistics and AGV movement. Used for optimizing layout and analyzing industrial processes.",
    technologies: ["Three.js", "Blender", "Physics Engine", "TypeScript"],
    image: "/works/works-9.png",
    x: "80%",
    y: "70%",
    rotate: -5,
  },
];
