"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import jobDescriptions from "../../../data/job-descriptions.json";
import { MapPin, Clock, Briefcase, Building2, X, Calendar, IndianRupee } from "lucide-react";

export default function InterviewStartPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [showJobDetails, setShowJobDetails] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectJob = (jobId: string) => {
    setSelectedJob(jobId);
  };

  const handleViewJobDetails = (jobId: string) => {
    setShowJobDetails(jobId);
  };

  const handleCloseJobDetails = () => {
    setShowJobDetails(null);
  };

  const handleStartInterview = (jobId?: string) => {
    const targetJobId = jobId || selectedJob;
    if (!targetJobId) {
      alert("Please select a job position first");
      return;
    }
    // Store selected job in localStorage and pass as param
    localStorage.setItem("selectedJobId", targetJobId);
    router.push(`/~/interview/start?jobId=${targetJobId}`);
  };

  const selectedJobData = showJobDetails ? jobDescriptions.jobDescriptions.find(job => job.id === showJobDetails) : null;

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#1E2B3A] mb-4">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {jobDescriptions.jobDescriptions.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              onClick={() => handleViewJobDetails(job.id)}
              className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${selectedJob === job.id
                ? "ring-2 ring-[#407BBF] ring-opacity-50 shadow-xl"
                : "hover:shadow-xl"
                }`}
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
              <div className="flex flex-wrap gap-2">
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

              {/* Selection Indicator */}
              {selectedJob === job.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2 text-[#407BBF]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>


        {/* Job Details Popup/Sidecard */}
        <AnimatePresence>
          {showJobDetails && selectedJobData && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleCloseJobDetails}
              />

              {/* Sidecard */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#407BBF]/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#407BBF]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#1E2B3A]">{selectedJobData.company}</h2>
                        <p className="text-sm text-gray-500">{selectedJobData.jobType}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseJobDetails}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1E2B3A] mb-4">{selectedJobData.role}</h3>

                  {/* Start Interview Button */}
                  <button
                    onClick={() => handleStartInterview(selectedJobData.id)}
                    className="w-full rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#2a3a4d] no-underline gap-x-2 active:scale-95 scale-100 duration-75"
                    style={{
                      boxShadow: "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Start Interview for This Position
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Job Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{selectedJobData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span>{selectedJobData.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Posted {new Date(selectedJobData.postedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-[#407BBF]">{selectedJobData.salary}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-[#1E2B3A] mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobData.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="text-sm px-3 py-1 bg-[#407BBF]/10 text-[#407BBF] rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-[#1E2B3A] mb-3">Job Description</h4>
                    <div className="prose prose-sm max-w-none text-[#1a2b3b] leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h2: ({ children }) => (
                            <h3 className="text-lg font-semibold text-[#1E2B3A] mt-6 mb-3 first:mt-0">
                              {children}
                            </h3>
                          ),
                          h3: ({ children }) => (
                            <h4 className="text-base font-semibold text-[#1E2B3A] mt-4 mb-2">
                              {children}
                            </h4>
                          ),
                          p: ({ children }) => (
                            <p className="mb-3 text-[#1a2b3b]">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="mb-4 space-y-1">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="ml-4 text-[#1a2b3b] list-disc">
                              {children}
                            </li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-[#1E2B3A]">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {selectedJobData.description}
                      </ReactMarkdown>
                    </div>
                  </div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}