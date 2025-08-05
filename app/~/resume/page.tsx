"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Download, Edit3 } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-[#1E2B3A] mb-2">
          Resume Management
        </h1>
        <p className="text-lg text-[#1a2b3b]">
          Upload and manage your resume for personalized interview practice
        </p>
      </motion.div>

      {/* Resume Upload/Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-[#407BBF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-[#407BBF]" />
          </div>

          <h2 className="text-xl font-bold text-[#1E2B3A] mb-4">
            Upload Your Resume
          </h2>

          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Upload your resume to get personalized interview questions and feedback based on your experience and skills.
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6 hover:border-[#407BBF]/50 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your resume here, or
            </p>
            <button className="text-[#407BBF] font-medium hover:text-[#407BBF]/80 transition-colors">
              browse files
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Supports PDF, DOC, DOCX (max 5MB)
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="flex items-center px-6 py-3 bg-[#407BBF] text-white rounded-lg font-medium hover:bg-[#407BBF]/90 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
            </button>
            <button className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <Edit3 className="w-5 h-5 mr-2" />
              Create New
            </button>
          </div>
        </div>
      </motion.div>

      {/* Resume Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-[#1E2B3A] mb-4">
            Resume Best Practices
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Keep it concise and relevant to the job you&apos;re applying for
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use action verbs and quantify your achievements
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Include relevant keywords from the job description
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Ensure consistent formatting and no typos
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-[#1E2B3A] mb-4">
            How We Use Your Resume
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Generate personalized interview questions
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Match you with relevant job positions
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Provide targeted feedback on your responses
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#407BBF] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Track your improvement over time
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}