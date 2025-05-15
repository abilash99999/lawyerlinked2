'use client';

import { useTheme } from "next-themes";

export default function Footer() {
    const { theme } = useTheme();

    const linkColor = theme === "dark" ? "text-[#9FBEDC]" : "text-[#0F1C3F]";
    const hoverColor = theme === "dark" ? "hover:text-white" : "hover:text-[#1A4D8F]";
    const textMuted = theme === "dark" ? "text-[#9FBEDC]" : "text-muted-foreground";

    return (
        <footer className="flex flex-col items-center gap-4 text-center py-6 mt-auto border-t">
            <div className={`flex gap-6 flex-wrap justify-center text-sm ${linkColor}`}>
                <a className={`hover:underline underline-offset-4 ${hoverColor}`} href="#learn-more">Learn More</a>
                <a className={`hover:underline underline-offset-4 ${hoverColor}`} href="/contact">Contact Us</a>
                <a className={`hover:underline underline-offset-4 ${hoverColor}`} href="#privacy-policy">Privacy Policy</a>
                <a className={`hover:underline underline-offset-4 ${hoverColor}`} href="#terms">Terms of Service</a>
            </div>
            <p className={`text-xs ${textMuted}`}>
                © {new Date().getFullYear()} Alenist Tech Pvt Ltd. All rights reserved.
            </p>
            <div className="h-[56px] bg-gray-200 md:hidden">

            </div>

        </footer>
    );
}