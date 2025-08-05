"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import jobDescriptions from "../../../../data/job-descriptions.json";
import { createInterviewSession } from './action';
import { Building2, Upload, FileText, ChevronDown, MapPin, Calendar, Briefcase, IndianRupee } from "lucide-react";

const interviewRounds = [
  { id: "hr", label: "HR Round", description: "Behavioral questions and company culture fit" },
  { id: "coding", label: "Coding", description: "Programming challenges and algorithm problems" },
  { id: "system-design", label: "System Design", description: "Architecture and scalability discussions" },
  { id: "problem-solving", label: "Problem Solving", description: "Analytical and logical reasoning" },
  { id: "domain-specific", label: "Domain Specific", description: "Role-specific technical knowledge" },
  { id: "aptitude", label: "Aptitude & Logical Reasoning", description: "Quantitative and logical skills" },
  { id: "case-study", label: "Case Study", description: "Business scenarios and strategic thinking" }
];

export default function InterviewStartPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedJob = selectedJobId 
    ? jobDescriptions.jobDescriptions.find(job => job.id === selectedJobId)
    : null;

  useEffect(() => {
    // Get job ID from URL params first, then fallback to localStorage
    const jobIdFromParams = searchParams.get('jobId');
    const jobIdFromStorage = localStorage.getItem("selectedJobId");
    
    const jobId = jobIdFromParams || jobIdFromStorage;
    
    if (jobId) {
      setSelectedJobId(jobId);
      // Store in localStorage for consistency
      localStorage.setItem("selectedJobId", jobId);
    } else {
      // Redirect back if no job selected
      router.push("/~/interview");
    }
  }, [router, searchParams]);

  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleStartInterview = async () => {
    if (!selectedRound) {
      alert("Please select an interview round");
      return;
    }
    if (!selectedFile) {
      alert("Please upload your resume");
      return;
    }
    if (!selectedJobId) {
      alert("Job information missing");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate session ID
      const sessionId = uuidv4();
      
      // Store interview details in localStorage
      localStorage.setItem("interviewRound", selectedRound);
      localStorage.setItem("resumeUploaded", "true");
      localStorage.setItem("sessionId", sessionId);
      
      // Create interview session with agent configuration
      const sessionData = await createInterviewSession({
        jobId: selectedJobId,
        interviewRound: selectedRound,
        sessionId: sessionId,
        enableRecording: true
      });
      
      console.log("Interview session created:", sessionData);
      
      // Redirect to interview session
      router.push(`/~/interview/${sessionId}`);
    } catch (error) {
      console.error("Failed to create interview session:", error);
      alert("Failed to start interview. Please try again.");
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (!selectedJob) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#1E2B3A] mb-4">
            Start Your Interview
          </h1>
          <p className="text-lg text-[#1a2b3b]">
            Configure your interview session and upload your resume
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Job Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 h-fit max-h-[80vh] overflow-y-auto"
          >
            {/* Job Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#407BBF]/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[#407BBF]" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1E2B3A]">{selectedJob.company}</h2>
                <h3 className="text-lg font-semibold text-[#1a2b3b]">{selectedJob.role}</h3>
              </div>
            </div>

            {/* Job Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{selectedJob.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{selectedJob.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Posted {new Date(selectedJob.postedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                <IndianRupee className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-[#407BBF]">{selectedJob.salary}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-[#1E2B3A] mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, skillIndex) => (
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
            <div>
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
                  {selectedJob.description}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
          <h2 className="text-2xl font-semibold text-[#1E2B3A] mb-6">
            Interview Configuration
          </h2>

          {/* Interview Round Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-[#1E2B3A] mb-4">
              Select Interview Round *
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#407BBF] focus:border-[#407BBF] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    {selectedRound ? (
                      <div>
                        <span className="font-medium text-[#1E2B3A]">
                          {interviewRounds.find(r => r.id === selectedRound)?.label}
                        </span>
                        <p className="text-sm text-[#1a2b3b] mt-1">
                          {interviewRounds.find(r => r.id === selectedRound)?.description}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-500">Choose an interview round...</span>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {interviewRounds.map((round) => (
                    <div
                      key={round.id}
                      onClick={() => {
                        setSelectedRound(round.id);
                        setDropdownOpen(false);
                      }}
                      className={`p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                        selectedRound === round.id ? 'bg-[#407BBF]/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-[#1E2B3A] mb-1">{round.label}</h4>
                          <p className="text-sm text-[#1a2b3b]">{round.description}</p>
                        </div>
                        {selectedRound === round.id && (
                          <div className="w-5 h-5 rounded-full bg-[#407BBF] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-[#1E2B3A] mb-4">
              Upload Resume *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? "border-[#407BBF] bg-[#407BBF]/5" 
                  : selectedFile 
                  ? "border-green-400 bg-green-50" 
                  : "border-gray-300 hover:border-[#407BBF]"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {selectedFile ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium text-green-700 mb-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-600">
                    PDF uploaded successfully
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#407BBF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-[#407BBF]" />
                  </div>
                  <p className="text-lg font-medium text-[#1E2B3A] mb-2">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-sm text-[#1a2b3b]">
                    Upload your resume in PDF format
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-[#1a2b3b]">
              <p className="mb-2"><strong>Supported format:</strong> PDF files only</p>
              <p><strong>File size:</strong> Maximum 10MB</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6">
          <Link href="/~/interview">
            <button
              disabled={isLoading}
              className={`rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center border border-gray-300 bg-white text-gray-700 no-underline gap-x-2 active:scale-95 scale-100 duration-75 ${
                isLoading 
                  ? "cursor-not-allowed opacity-50" 
                  : "hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </button>
          </Link>

          <button
            onClick={handleStartInterview}
            disabled={!selectedRound || !selectedFile || isLoading}
            className={`rounded-full px-8 py-3 text-[14px] font-semibold transition-all flex items-center justify-center text-white no-underline gap-x-2 active:scale-95 scale-100 duration-75 ${
              !selectedRound || !selectedFile || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E2B3A] hover:bg-[#2a3a4d]"
            }`}
            style={{
              boxShadow: !selectedRound || !selectedFile || isLoading ? "none" : "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Starting Interview...</span>
              </>
            ) : (
              <>
                Start Interview
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
              </>
            )}
          </button>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}