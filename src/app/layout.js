import { Inter } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Header from "@/app/header"; // ✅ Adjust the path if needed
import Footer from "@/app/footer"; // ✅ Adjust the path if needed

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: "LawyerLinked",
  description:
    "LawyerLinked is an innovative and user-friendly platform that aims to bridge the gap between individuals, businesses, and verified legal professionals across India. By leveraging advanced technology, LawyerLinked offers a seamless experience for those seeking legal services and attorneys looking to expand their reach.",
  icons: {
    icon: '/legislation.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}