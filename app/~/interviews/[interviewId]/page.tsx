"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "motion/react";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import jobDescriptions from "../../../../data/job-descriptions.json";
import { createInterviewSession } from './action';
import { Building2, Upload, FileText, MapPin, Calendar, Briefcase, IndianRupee, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const interviewRounds = [
  { id: "hr", label: "HR Round", description: "Behavioral questions and company culture fit" },
  { id: "coding", label: "Coding", description: "Programming challenges and algorithm problems" },
  { id: "system-design", label: "System Design", description: "Architecture and scalability discussions" },
  { id: "problem-solving", label: "Problem Solving", description: "Analytical and logical reasoning" },
  { id: "domain-specific", label: "Domain Specific", description: "Role-specific technical knowledge" },
  { id: "aptitude", label: "Aptitude & Logical Reasoning", description: "Quantitative and logical skills" },
  { id: "case-study", label: "Case Study", description: "Business scenarios and strategic thinking" }
];

function SubmitButton({ selectedRound, selectedFile }: { selectedRound: string; selectedFile: File | null }) {
  const { pending } = useFormStatus();
  const isDisabled = !selectedRound || !selectedFile || pending;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center text-white gap-2 active:scale-95 scale-100 duration-75 ${isDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#1E2B3A] hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247]"
        }`}
      style={
        !isDisabled
          ? {
            boxShadow:
              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)"
          }
          : undefined
      }
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Starting Interview...
        </>
      ) : (
        <>
          Start Interview
          <svg
            className="w-4 h-4"
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
  );
}

async function submitInterview(prevState: any, formData: FormData) {
  const selectedRound = formData.get('interviewRound') as string;
  const resume = formData.get('resume') as File;
  const jobId = formData.get('jobId') as string;

  if (!selectedRound || !resume || !jobId) {
    return { error: 'Please fill all required fields' };
  }

  if (resume.type !== 'application/pdf') {
    return { error: 'Please select a PDF file' };
  }

  try {
    const sessionId = uuidv4();

    // Store interview details
    localStorage.setItem("interviewRound", selectedRound);
    localStorage.setItem("resumeUploaded", "true");
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("selectedJobId", jobId);

    // Create interview session
    const sessionData = await createInterviewSession({
      jobId: jobId,
      interviewRound: selectedRound,
      sessionId: sessionId,
      enableRecording: true
    });

    return { success: true, roomId: sessionId };
  } catch (error) {
    console.error("Failed to create interview session:", error);
    return { error: 'Failed to start interview. Please try again.' };
  }
}

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedRound, setSelectedRound] = useState<string>("");

  const [state, formAction] = useActionState(submitInterview, null);

  const job = jobDescriptions.jobDescriptions.find(job => job.id === interviewId);

  useEffect(() => {
    if (state?.success && state?.roomId) {
      router.push(`/room?id=${state.roomId}`);
    }
  }, [state, router]);

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E2B3A] mb-2">Job not found</h2>
          <p className="text-[#1a2b3b]">The job you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details (2/3 width) */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.165, 0.84, 0.44, 1] }}
          >
            {/* Job Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-[#1E2B3A]">{job.company}</h1>
              <h2 className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mt-2">{job.role}</h2>
            </div>

            {/* Job Info */}
            <div className="mb-6">
              <div className="space-y-2">
                <p className="text-[13px] text-gray-600">{job.location} • {job.experience}</p>
                <p className="text-[13px] font-medium text-[#1E2B3A]">{job.salary}</p>
                <p className="text-[13px] text-gray-600">Posted {new Date(job.postedDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1E2B3A] mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1E2B3A] mb-4">Job Description</h3>
              <div className="prose prose-sm max-w-none text-[#1a2b3b] leading-relaxed">
                <ReactMarkdown
                  components={{
                    h2: (props: any) => (
                      <h3 className="text-lg font-semibold text-[#1E2B3A] mt-6 mb-3 first:mt-0">
                        {props.children}
                      </h3>
                    ),
                    h3: (props: any) => (
                      <h4 className="text-base font-semibold text-[#1E2B3A] mt-4 mb-2">
                        {props.children}
                      </h4>
                    ),
                    p: (props: any) => (
                      <p className="mb-3 text-[#1a2b3b]">
                        {props.children}
                      </p>
                    ),
                    ul: (props: any) => (
                      <ul className="mb-4 space-y-1">
                        {props.children}
                      </ul>
                    ),
                    li: (props: any) => (
                      <li className="ml-4 text-[#1a2b3b] list-disc">
                        {props.children}
                      </li>
                    ),
                    strong: (props: any) => (
                      <strong className="font-semibold text-[#1E2B3A]">
                        {props.children}
                      </strong>
                    ),
                  }}
                >
                  {job.description}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Sticky Form Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.165, 0.84, 0.44, 1] }}
              className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#1E2B3A] mb-6">
                Start Your Interview
              </h2>

              <form action={formAction}>
                <input type="hidden" name="jobId" value={job.id} />

                {/* Interview Round Selection */}
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    Select Interview Round *
                  </label>
                  <Select value={selectedRound} onValueChange={setSelectedRound}>
                    <SelectTrigger className="w-full h-auto py-3">
                      <SelectValue placeholder="Choose an interview round...">
                        {selectedRound && (
                          <div className="text-left">
                            <span className="font-medium text-[#1E2B3A] text-sm block">
                              {interviewRounds.find(r => r.id === selectedRound)?.label}
                            </span>
                            <p className="text-xs text-[#1a2b3b] mt-0.5">
                              {interviewRounds.find(r => r.id === selectedRound)?.description}
                            </p>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {interviewRounds.map((round) => (
                        <SelectItem
                          key={round.id}
                          value={round.id}
                          className="py-3"
                        >
                          <div>
                            <h4 className="font-medium text-[#1E2B3A] text-sm mb-0.5">{round.label}</h4>
                            <p className="text-xs text-[#1a2b3b]">{round.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="interviewRound" value={selectedRound} />
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-gray-900 mb-2">
                    Upload Resume *
                  </label>

                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                        ? "border-[#1E2B3A] bg-[#1E2B3A]/5"
                        : selectedFile
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-[#1E2B3A] bg-gray-50"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />

                    {selectedFile ? (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-700 mb-1 truncate max-w-[200px] mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-green-600">
                          PDF uploaded successfully
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#1E2B3A]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Upload className="w-6 h-6 text-[#1E2B3A]" />
                        </div>
                        <p className="text-[13px] font-medium text-gray-900 mb-1">
                          Drop your resume here
                        </p>
                        <p className="text-[11px] text-gray-500">
                          or click to browse (PDF only)
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] text-gray-500">
                    Maximum file size: 10MB
                  </p>
                </div>

                {/* Error Message */}
                {state?.error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{state.error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <SubmitButton selectedRound={selectedRound} selectedFile={selectedFile} />
              </form>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-[13px] font-medium text-gray-900 mb-2">Before you start:</h4>
                <ul className="text-[11px] text-gray-600 space-y-1.5">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#1E2B3A] rounded-full mt-1 mr-2 flex-shrink-0"></span>
                    Ensure you&apos;re in a quiet environment
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#1E2B3A] rounded-full mt-1 mr-2 flex-shrink-0"></span>
                    Have a stable internet connection
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#1E2B3A] rounded-full mt-1 mr-2 flex-shrink-0"></span>
                    Allow camera and microphone access
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#1E2B3A] rounded-full mt-1 mr-2 flex-shrink-0"></span>
                    Keep your resume handy for reference
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}