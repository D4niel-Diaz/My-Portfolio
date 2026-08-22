import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * Set NEXT_PUBLIC_SITE_URL to the deployed origin. Without a metadataBase,
 * Next resolves the OG image against localhost and social previews break.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Daniel Diaz | Full-Stack Developer",
  description:
    "Full-stack developer specializing in modern web platforms. Building production-ready solutions with Next.js, Laravel, REST APIs, and more.",
  keywords: [
    "Full-Stack Developer",
    "Mobile Developer",
    "React",
    "Next.js",
    "Laravel",
    "Python",
    "RestAPI",
    "Mysql",
    "Postgresql",
    "Philippines",
  ],
  authors: [{ name: "Daniel Diaz" }],
  creator: "Daniel Diaz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Daniel Diaz Portfolio",
    title: "Daniel Diaz | Full-Stack Developer",
    description:
      "Full-stack developer specializing in modern web platforms.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daniel Diaz Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Diaz | Full-Stack Developer",
    description:
      "Full-stack specializing in modern web platforms",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="antialiased font-sans" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
