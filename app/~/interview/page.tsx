"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InterviewStartPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

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
    if (!selectedFile) {
      alert("Please upload your profile first");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to reports page
    router.push("/~/interview/reports");
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

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#1E2B3A] mb-4">
            Start Your Interview
          </h1>
          <p className="text-lg text-[#1a2b3b]">
            Upload your profile and begin your AI-powered interview practice session
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-[#1E2B3A] mb-6">
            Upload Your Profile
          </h2>
          
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
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
                  <svg className="w-8 h-8 text-[#407BBF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-[#1E2B3A] mb-2">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-[#1a2b3b]">
                  Upload your resume, portfolio, or any relevant profile document
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-[#1a2b3b]">
            <p className="mb-2"><strong>Supported format:</strong> PDF files only</p>
            <p><strong>What to include:</strong> Resume, portfolio, or any document that represents your professional profile</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/~">
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
            disabled={!selectedFile || isLoading}
            className={`rounded-full px-8 py-3 text-[14px] font-semibold transition-all flex items-center justify-center text-white no-underline gap-x-2 active:scale-95 scale-100 duration-75 ${
              !selectedFile || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E2B3A] hover:bg-[#2a3a4d]"
            }`}
            style={{
              boxShadow: !selectedFile || isLoading ? "none" : "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
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
        </motion.div>
      </div>
    </div>
  );
}