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
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-[#1E2B3A] mb-2">
          Choose a Position
        </h1>
        <p className="text-lg text-[#1a2b3b]">
          Select a job position to practice your interview skills
        </p>
      </motion.div>

      {/* Job Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer"
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
              transition={{ duration: 0.4, delay: 0.05 * index }}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg p-6 transition-all duration-200 border border-gray-100 hover:border-[#407BBF]/20"
            >
              {/* Company Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#407BBF]/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#407BBF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E2B3A]">{job.company}</h3>
                  <p className="text-sm text-gray-500">{job.jobType}</p>
                </div>
              </div>

              {/* Role Title */}
              <h4 className="text-lg font-semibold text-[#1E2B3A] mb-3">
                {job.role}
              </h4>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Salary */}
              <div className="mb-4">
                <p className="text-sm font-medium text-[#407BBF]">{job.salary}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {job.skills.slice(0, 3).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    +{job.skills.length - 3} more
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