
import { Facebook } from "lucide-react";
import { ReactNode } from "react";

// Personal Info
export const personalInfo = {
    name: "Daniel Diaz",
    role: "Full-Stack Developer",
    tagline: "Building modern web applications",
    location: "Sorsogon City, Philippines",
    email: "danieldiesta00@gmail.com",
    facebook: "https://www.facebook.com/share/1KHVNxXuZJ/",
    github: "https://github.com/D4NIEL-DIAZ",
    instagram: "https://www.instagram.com/daniel_diesta00/",
    portfolio: "https://your-portfolio.vercel.app",
};

/// About Section
export const aboutContent = `I am a full-stack developer with a strong foundation in web development, specializing in building modern applications that solve real-world problems.

I ve worked as the primary developer on multiple client projects, delivering production-ready solutions using technologies such as Next.js, React, Laravel, REST APIs, MySQL, and PostgreSQL.

My focus is on creating clean, scalable, and reliable systems—whether it s an AI-driven web app, a real-time tracking platform, or a smart embedded solution. I enjoy turning complex ideas into practical, high-impact digital products.`;

// Tech Stack
export const techStack = {
    frontend: ["JavaScript", "TypeScript","React", "Next.js", "Tailwind CSS"],
    backend: ["Laravel", "Python (Django)", "REST APIs", "FastAPI"],
    database: ["MySQL", "PostgreSQL"],

    other: ["Git/GitHub", "Trello"],
};

// Experience
interface Experience {
    title: string;
    client: string;
    description: string[];
}

export const experiences: Experience[] = [
    {
        title: "Inventory Management System - Full Backend Developer",
        client: "Student",
        description: [
            "Developed a complete backend for an inventory management system using Laravel and REST API.",
            "Implemented CRUD operations, authentication, and data validation for secure and efficient management.",
        ],
    },
    {
        title: "Real-Time Chat Application - Full-Stack Developer",
        client: "Sorsu Students",
        description: [
            "Built a real-time chat application using React and Laravel.",
            "Implemented user authentication, live messaging with WebSockets, and admin-only management features.",
        ],
    },
    {
        title: "BSHM Inventory Management System - PHP & MySQL Developer",
        client: "BSHM Student of Sorsogon State University",
        description: [
            "Developed an inventory management system using PHP and MySQL for streamlined record-keeping.",
            "Created modules for product tracking, reporting, and database optimization.",
        ],
    },
];


// Achievements
export const achievements = [
    "Developed a full backend for an inventory management system using Laravel and REST API.",
    "Built a full-stack web-based chat application using React and Laravel.",
    "Created a web-based inventory management system using PHP and MySQL.",
];


// Projects
interface Project {
    title: string;
    description: string;
    tags: string[];
    url: string;
    image: string;
}

export const projects: Project[] = [
    {
        title: "SoChat -  web-based chat application",
        description: "A real-time chat application for sorsu students",
        tags: ["React", "Laravel"],
        url: "",
        image: "/photos/sochat.png",
    },
    {
        title: "Inventory Management System",
        description: "Full Backend for inventory management",
        tags: ["Laravel", "REST API"],
        url: "",
        image: "/photos/inventory.png",
    },
];

// Navigation Links
export const navLinks = [
    { name: "About", href: "#about" },
    { name: "Tech", href: "#tech" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];
