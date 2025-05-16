'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const { theme } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("job")
        .select(`
          id,
          name,
          city,
          firm_name,
          firm:firm_id (image)
        `)
        .limit(6);

      if (error) {
        console.error("Error fetching jobs:", error);
      } else {
        setJobs(data);
      }
    }

    async function fetchLawyers() {
      const { data, error } = await supabase
        .from("lawyer")
        .select(`id, name, city, image, case_types, experience`)
        .limit(6);

      if (error) {
        console.error("Error fetching lawyers:", error);
      } else {
        setLawyers(data);
      }
    }

    fetchJobs();
    fetchLawyers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-4 py-8 sm:p-20 font-sans">
      <main className="flex-grow flex flex-col gap-12 w-full max-w-6xl mx-auto">
        {/* Hero Section */}
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

        {/* Jobs Section */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold text-[#1A4D8F] mb-6 text-center">
            Jobs Near You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <p className="text-center col-span-3">No jobs available right now.</p>
            ) : (
              jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="border rounded-2xl p-4 shadow hover:shadow-md transition duration-300 cursor-pointer">
                    <div className="flex items-center gap-4 mb-2">
                      <Avatar className="h-12 w-12 rounded-none overflow-hidden">
                        <AvatarImage
                          src={job.firm?.image || "/corporation.png"}
                          alt={job.firm_name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {job.firm_name?.[0]?.toUpperCase() || "F"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-lg font-bold text-[#1A4D8F]">
                          {job.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{job.firm_name}</p>
                        <p className="text-sm">{job.city}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Lawyers Section */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold text-[#1A4D8F] mb-6 text-center">
            Lawyers Near You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {lawyers.length === 0 ? (
              <p className="text-center col-span-3">No lawyers found nearby.</p>
            ) : (
              lawyers.map((lawyer) => (
                <Link key={lawyer.id} href={`/lawyers/${lawyer.id}`}>
                  <div className="border rounded-2xl p-4 shadow hover:shadow-md transition duration-300 cursor-pointer">
                    <div className="flex items-center gap-4 mb-2">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        <AvatarImage
                          src={lawyer.image || "/default-avatar.png"}
                          alt={lawyer.name}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {lawyer.name?.[0]?.toUpperCase() || "L"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-lg font-bold text-[#1A4D8F]">
                          {lawyer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{lawyer.city}</p>
                        <p className="text-sm">{lawyer.experience} yrs experience</p>
                        <p className="text-sm text-muted-foreground">
                          {(lawyer.case_types || []).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
