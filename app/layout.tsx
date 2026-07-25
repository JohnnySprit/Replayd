import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Replayd",
  description: "AI coaching reports for ranked League of Legends games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${spaceGrotesk.variable} min-h-full flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <div className="fixed top-4 right-4 z-50"> {/* maybe remove this in the future or find a better way to keep it with the hero background */}
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}