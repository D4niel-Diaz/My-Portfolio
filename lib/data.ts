
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
    instagram: "https://www.instagram.com/_danyeeeeeel?igsh=MW9panR1OGZ1MzBydQ==",
    portfolio: "https://your-portfolio.vercel.app",
};

/// About Section
export const aboutContent = `I am a Full Stack Web Developer with experience building modern web applications using Laravel, React, and MySQL. I specialize in creating responsive, user-friendly systems and efficiently handling both frontend and backend development.

I have experience deploying applications using platforms like Vercel for frontend and Render for backend services, ensuring scalable and reliable production environments.

One of my notable projects is soNonymous, an anonymous messaging platform designed for SORSU students, showcasing my ability to develop practical and engaging web solutions.

I am highly adaptable, quick to learn new technologies, and committed to continuous improvement. I am passionate about building efficient and innovative applications that enhance user experience.`;

// Tech Stack
export const techStack = {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
    backend: ["PHP", "Laravel", "REST APIs"],
    database: ["MySQL", "PostgreSQL"],
    

    other: ["Git/GitHub", "Vercel", "Render", "Vscode", "Figma", "Postman", "Docker"]
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
    {
        title: "SoNynomous - Real-Time Anonymous Messaging Platform",
        client: "Student of Sorsogon State University",
        description: [
            ".A web-based anonymous messaging platform built with React and Laravel.",
        ],
    },
];


// Achievements
export const achievements = [
    "Developed a full backend for an inventory management system using Laravel and REST API.",
    "Built a full-stack web-based chat application using React, Laravel and MySQL.",
    "Created a web-based inventory management system using PHP and MySQL.",
    "Built a real-time anonymous messaging platform using React, Laravel and MySQL.",
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
    {
        title: "SoNynomous - Real-Time Anonymous Messaging Platform",
        description: "A web-based anonymous messaging platform built with React and Laravel",
        tags: ["React", "Laravel"],
        url: "",
        image: "/photos/Son.png",
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
