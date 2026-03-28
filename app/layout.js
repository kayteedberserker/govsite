// app/layout.jsx
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import PageWrapper from "@/app/components/PageWrapper"; // NEW IMPORT
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  // Explicitly loading these weights ensures your bold text and labels look crisp
  weight: ["400", "500", "600", "700", "800"], 
});

// A cleaner monospace font just in case you display any code or raw data
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// UPDATED: Public-facing metadata for SEO
export const metadata = {
  title: "Candidate 2027 | Official Campaign",
  description: "Dedicated to progress, transparency, and sustainable development for our great state.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // Injecting plusJakarta.className here forces the whole app to use it instantly
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} ${plusJakarta.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        {/* We wrap the children in our new client wrapper to handle the conditional Navbar/Footer */}
        <PageWrapper>
          {children}
        </PageWrapper>
      </body>
    </html>
  );
}