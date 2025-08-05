"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import jobDescriptions from "../../../data/job-descriptions.json";
import { MapPin, Clock, Briefcase, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InterviewsPage() {
  const router = useRouter();

  const handleStartInterview = (jobId: string) => {
    // Store selected job in localStorage and pass as param
    localStorage.setItem("selectedJobId", jobId);
    router.push(`/~/interviews/start?jobId=${jobId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.165, 0.84, 0.44, 1] }}
      >
        <h1 className="text-4xl font-bold text-[#1E2B3A]">
          Choose a Position
        </h1>
        <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mt-4">
          Select a job position to practice your interview skills with our AI interviewer.
        </p>
      </motion.div>

      {/* Job Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.165, 0.84, 0.44, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 cursor-pointer"
      >
        {jobDescriptions.jobDescriptions.map((job, index) => (
          <Link
            key={job.id}
            href={`/~/interviews/${job.id}`}
          >
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.165, 0.84, 0.44, 1] }}
              className="group bg-white rounded-lg border border-gray-300 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#1E2B3A] focus:outline-none"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center">
                  <span className="flex flex-col text-sm">
                    <span className="font-medium text-gray-900">
                      {job.company}
                    </span>
                    <span className="text-gray-500">
                      <span className="block sm:inline">
                        {job.role} • {job.location}
                      </span>
                    </span>
                  </span>
                </span>
              </div>

              <div className="mb-4">
                <p className="text-[13px] text-gray-600 mb-2">{job.experience}</p>
                <p className="text-[13px] font-medium text-[#1E2B3A]">{job.salary}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>

            </motion.div>
          </Link>

        ))}
      </motion.div>
    </div>
  );
}