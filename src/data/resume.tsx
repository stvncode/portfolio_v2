import { Icons } from "@/components/icons"
import { HomeIcon, NotebookIcon } from "lucide-react"

export const DATA = {
  name: "Steven Travers",
  initials: "ST",
  url: "https://steventravers.com",
  location: "Lille, France",
  locationLink: "https://www.google.com/maps/place/Rennes,+France",
  description:
    "Fullstack Developer / Designer",
  summary:
    "Welcome to my portfolio! As a fullstack developer, I am passionate about creating innovative and dynamic solutions. I strive to create visually stunning and intuitive interfaces that enhance the user experience. In addition to my technical skills, I also enjoy creating content and share it for free. Whether it's writing articles, producing videos, or sharing insights from my experiences, I believe in the power of communication to bring people together and drive positive change. So take a look around and see what I've been working on. I hope you'll find something that sparks your interest. And if you have any questions or feedback, please don't hesitate to reach out.",
  avatarUrl: "/me.jpeg",
  skills: [
    "React",
    "TypeScript",
    "Vite/Next.js",
    "Rest/GraphQL",
    "Elysia/Hono/Express",
    "Drizzle/Prisma/MongoDB/PostgreSQL",
    "UI/UX Design",
    "Radix/Shadcnui/Mantine",
    "Tailwind/Sticthes/StyledComponents",
    "Framer Motion",
    "FP-TS/Monocle-TS/IO-TS/TS-Belt",
    "Docker",
    "CI/CD",
    "Git/GitHub/GitLab",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "steventraverspro.com",
    tel: "+33677908955",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/stvncode",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/steven-travers-313b1b102",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:steventraverspro.com",
        icon: Icons.email,
        navbar: true,
      },
      X: {
        name: "Twitter",
        url: "https://x.com/stvnnsvt",
        icon: Icons.x,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Meteroid",
      href: "https://www.meteroid.io/",
      badges: [],
      location: "Remote",
      title: "Freelance Developer",
      logoUrl: "/meteroid.jpg",
      start: "2025",
      end: "Present",
      description:
      "Contributing to Meteroid, an open-source billing infrastructure that helps SaaS companies launch, iterate, and scale their billing processes with ease. The platform enables businesses to implement complex billing models while maintaining flexibility for growth and market adaptation.",
    },
    {
      company: "Nudibranches Technologies",
      href: "https://www.nudibranches.tech/",
      badges: [],
      location: "Remote",
      title: "Freelance Developer",
      logoUrl: "/nudibranches.png",
      start: "2025",
      end: "Present",
      description:
      "Contributed to the European Lakehouse project, a cloud experience platform designed for air gap environments. Developed solutions that provide cloud-like capabilities while maintaining the security and isolation required for sensitive or regulated industries.",
    },
    {
      company: "Thales",
      href: "https://www.thalesgroup.com/",
      badges: [],
      location: "Remote",
      title: "Freelance Developer",
      logoUrl: "/thales.png",
      start: "2024",
      end: "Present",
      description:
        "Building an internal AI-powered chat system for document analysis that handles both classified and unclassified materials. The solution allows users to view and edit documents, ask questions, and analyze specific sections. The system is designed to maintain security protocols while providing advanced analysis capabilities.",
    },
    {
      company: "Conduktor",
      href: "https://www.conduktor.io/",
      badges: [],
      location: "Lille, France",
      title: "Lead Frontend Developer",
      logoUrl: "/conduktor.png",
      start: "2021",
      end: "2024",
      description:
        "As the first frontend developer at Conduktor, I contributed to developing the company's frontend infrastructure (design system, monorepo, etc). I built intuitive user interfaces and improved the user experience across all applications in our product suite. Conduktor specializes in creating tools for Apache Kafka, providing a user-friendly desktop application for developers and data engineers to monitor, manage, and interact with Kafka clusters.",
    },
    {
      company: "Libertrip",
      href: "https://www.libertrip.com/",
      badges: [],
      location: "Lille, France",
      title: "Fullstack Developer",
      logoUrl: "/libertrip.webp",
      start: "2020",
      end: "2021",
      description:
        "At Libertrip, a digital platform for planning and booking personalized travel experiences, I added features such as all-inclusive trips, refactored Vue.js code to React, and integrated Kafka. My work involved using functional programming paradigms with libraries like fp-ts, monocle-ts, and effect-ts. Unfortunately, the company had to close due to COVID-related revenue losses.",
    },
    {
      company: "Feelingo",
      href: "https://feelingo.com/",
      badges: [],
      location: "Lille, France",
      title: "Freelance Developer",
      logoUrl: "/feelingo.png",
      start: "2019",
      end: "2020",
      description:
        "At Feelingo, an eco-friendly hotel booking platform, I added features to the existing application and provided technical guidance to the founder. Feelingo promotes sustainable tourism by offering environmentally responsible hotels to customers. I worked with React, GraphQL, Gatsby, and Ruby on Rails to enhance their web application.",
    },
    {
      company: "Orange",
      href: "https://www.orange.com",
      badges: [],
      location: "Rennes, France",
      title: "Work-Study Developer",
      logoUrl: "/orange.webp",
      start: "2017",
      end: "2018",
      description:
        "I worked on the Wed project at Orange, a management tool designed to help project managers handle client infrastructure. My primary task was to rewrite the existing Perl project in Angular, modernizing the codebase while maintaining functionality.",
    },
  ],
  education: [
    {
      school: "ISEN (Institut Supérieur de l'Electronique et du Numérique)",
      href: "https://isen-ouest.fr/",
      degree: "Master's Degree",
      logoUrl: "/isen.png",
      start: "2013",
      end: "2018",
    },
  ],
  projects: [
    {
      title: "Userpact",
      href: "https://userpact.com",
      dates: "2025 - Present",
      active: true,
      description:
        "Co-creating an innovative feedback application for on-premise technology. Userpact enables businesses to collect, manage, and respond to user feedback effectively. Built with modern technologies to ensure performance, scalability, and an excellent user experience.",
      technologies: [
        "React",
        "Vite",
        "TypeScript",
        "ShadCN UI",
        "Tailwind CSS",
        "PostgreSQL",
        "Drizzle",
        "Elysia"
      ],
      links: [
        {
          type: "Website",
          href: "https://userpact.com",
          icon: <Icons.globe className="size-3" />,
        }
      ],
      image: "/userpact.png",
      video: "",
    },
    {
      title: "Alice Le Guennec",
      href: "https://alice-leguennec.vercel.app/",
      dates: "2025 - Present",
      active: true,
      description:
        "Designed and developed a professional website for Alice Le Guennec, an osteopath and yoga teacher. The site showcases her services, philosophy, and appointment scheduling capabilities. Built with Astro for optimal performance and ShadCN UI for a clean, modern aesthetic that reflects her professional practice.",
      technologies: [
        "Astro",
        "TypeScript",
        "ShadCN UI",
        "Tailwind CSS",
        "Responsive Design"
      ],
      links: [
        {
          type: "Website",
          href: "https://alice-leguennec.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        }
      ],
      image: "/alice.png",
      video: "",
    },
    {
      title: "Mathilde Bauden",
      href: "https://mathildebauden.vercel.app/",
      dates: "2023",
      active: true,
      description:
        "Created a digital haven for psychology professionals, delivering a fully deployed website with empathetic design and robust technology. Every aspect was meticulously curated to ensure an intuitive and serene user experience, seamlessly marrying functionality with aesthetics.",
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Mantine",
        "Framer Motion"
      ],
      links: [
        {
          type: "Website",
          href: "https://mathildebauden.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        }
      ],
      image: "/mathilde.png",
      video: "",
    }
  ],
  hackathons: [
    {
      title: "ActInSpace",
      description: "Participated in this international hackathon focused on space technologies and applications. Developed innovative solutions using space data and technologies to address real-world challenges.",
      location: "Brest, France",
      dates: "May 2018",
      image: "/actinspace.webp",
      links: [
        {
          title: "Website",
          href: "https://actinspace.org/",
          icon: <Icons.globe className="size-3" />,
        }
      ],
    },
    {
      title: "Ocean Hackathon",
      description: "Worked on a project to develop technological solutions for ocean conservation and sustainable maritime activities. Used data visualization and IoT sensors to monitor marine environments.",
      location: "Brest, France",
      dates: "October 2017",
      image: "/oceanhackathon.png",
      links: [
        {
          title: "Website",
          href: "https://www.ocean-hackathon.fr/",
          icon: <Icons.globe className="size-3" />,
        }
      ],
    },
    {
      title: "Startup Weekend Brest",
      description: "Participated in this 54-hour event where I collaborated with a team to develop a business idea from concept to prototype. Focused on designing and developing the technical aspects of a smart home energy conservation solution.",
      location: "Brest, France",
      dates: "March 2016",
      image: "/startupweekend.png",
      links: [
        {
          title: "Website",
          href: "https://startupweekend.org/",
          icon: <Icons.globe className="size-3" />,
        }
      ],
    },
    {
      title: "Hackathon ISEN IoT",
      description: "Internal hackathon at ISEN focused on Internet of Things applications. Developed a connected device prototype for smart agriculture, measuring soil conditions and automating irrigation systems.",
      location: "Brest, France",
      dates: "November 2015",
      image: "/isen-hackathon.png",
      links: [],
    },
  ],
} as const;
