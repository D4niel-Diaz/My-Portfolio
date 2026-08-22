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

/**
 * Cycled by the hero's typing effect. The first entry is what renders under
 * `prefers-reduced-motion`, so keep the primary role at the front.
 */
export const heroRoles = [
    personalInfo.role,
    personalInfo.tagline,
    "Laravel · React · MySQL",
];

/// About Section
export const aboutContent = `Full Stack Web Developer with experience building modern, scalable web applications using Laravel, React, and MySQL. Skilled in both frontend and backend development, with a focus on creating responsive, user-friendly systems.

Experienced in deploying applications using Vercel and Render, ensuring reliable production environments. Developed projects like soNonymous, an anonymous messaging platform for SORSU students.

Adaptable and fast-learning, with a strong commitment to continuous improvement and delivering efficient, high-quality solutions.`;

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
            "A web based platform built with React and Laravel that allows users to send anonymous messages in real-time, Also, I used redis for caching and queue management to ensure fast and reliable message delivery. ",
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

// Gallery
interface GalleryPhoto {
    id: string;
    src: string;
    /** Describes the photo for screen readers. Never leave this generic. */
    alt: string;
    /** Shown under the photo in the lightbox. */
    caption: string;
}

export const galleryPhotos: GalleryPhoto[] = [
    {
        id: "chat-api",
        src: "/photos/d.jpg",
        alt: "Postman showing a POST to the chat message endpoint returning 201 Created, next to the Laravel broadcast channel file in VS Code",
        caption: "Testing the SoChat message endpoint against the Laravel broadcast channels",
    },
    {
        id: "laravel-outdoors",
        src: "/photos/d2.jpg",
        alt: "Laptop on an outdoor table running VS Code on a Laravel controller, with a backlit mechanical keyboard in front of it",
        caption: "Match controller work — anywhere with a flat surface counts as an office",
    },
    {
        id: "inventory-repo",
        src: "/photos/d3.jpg",
        alt: "GitHub repository page for Inventory-System-Full-Backend-using-Laravel showing the first commit",
        caption: "First push of the Laravel inventory backend",
    },
    {
        id: "task-manager",
        src: "/photos/d4.jpg",
        alt: "React task manager app running on localhost next to its component source in VS Code",
        caption: "A React task manager, side by side with the component driving it",
    },
    {
        id: "form-validation",
        src: "/photos/d5.jpg",
        alt: "VS Code showing a JavaScript form controller with name, email, and age validation rules",
        caption: "Hand-rolled form validation — the groundwork for every form since",
    },
    {
        id: "api-routes",
        src: "/photos/d6.jpg",
        alt: "Laravel api.php route file with Sanctum-protected route groups for books, transactions, and admin",
        caption: "Route groups behind Sanctum auth, split by role",
    },
    {
        id: "dual-stack",
        src: "/photos/d7.jpg",
        alt: "Two editor windows side by side: Laravel database migrations on the left, a Next.js dashboard page on the right",
        caption: "Migrations on one side, the dashboard consuming them on the other",
    },
    {
        id: "home-setup",
        src: "/photos/d8.jpg",
        alt: "Working on a laptop at a green tiled table at home, with a pitcher of iced coffee alongside",
        caption: "Where most of it actually gets written",
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
