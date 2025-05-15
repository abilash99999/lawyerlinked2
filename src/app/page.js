'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("job")
        .select("name, firm_name, city")
        .limit(6); // limit to 6 or any number you like

      if (error) {
        console.error("Error fetching jobs:", error);
      } else {
        setJobs(data);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-4 py-8 sm:p-20 font-sans">
      <main className="flex-grow flex flex-col gap-12 w-full max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A4D8F] leading-tight">
              LawyerLinked: A Legal Hub
            </h1>
            <p className="text-lg mt-2 text-muted-foreground max-w-xl">
              A one-stop platform for clients and firms to hire verified lawyers, and for lawyers to find jobs. Discover the best legal minds in India.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/lawyers">
                <Button className={theme === "dark" ? "bg-[#0F1C3F] text-white hover:bg-[#1c2a5e]" : "bg-[#E6F0FA] text-[#0F1C3F] hover:bg-[#d3e4f7]"}>
                  Search Lawyers
                </Button>
              </Link>
              <Link href="/firms">
                <Button className={theme === "dark" ? "bg-[#0F1C3F] text-white hover:bg-[#1c2a5e]" : "bg-[#E6F0FA] text-[#0F1C3F] hover:bg-[#d3e4f7]"}>
                  Search Firms
                </Button>
              </Link>
              <Link href="/login-firm">
                <Button className={theme === "dark" ? "bg-[#0F1C3F] text-white hover:bg-[#1c2a5e]" : "bg-[#E6F0FA] text-[#0F1C3F] hover:bg-[#d3e4f7]"}>
                  Post a Job
                </Button>
              </Link>
              <Link href="/login">
                <Button className={theme === "dark" ? "bg-[#0F1C3F] text-white hover:bg-[#1c2a5e]" : "bg-[#E6F0FA] text-[#0F1C3F] hover:bg-[#d3e4f7]"}>
                  Find Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <section className="w-full">
          <h2 className="text-2xl font-semibold text-[#0F1C3F] mb-6 text-center">
            Jobs Near You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <p className="text-center col-span-3">No jobs available right now.</p>
            ) : (
              jobs.map((job, idx) => (
                <div key={idx} className="border rounded-2xl p-4 shadow hover:shadow-md transition duration-300">
                  <h3 className="text-lg font-bold text-[#1A4D8F]">{job.name}</h3>
                  <p className="text-sm text-muted-foreground">{job.firm_name}</p>
                  <p className="text-sm">{job.city}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
