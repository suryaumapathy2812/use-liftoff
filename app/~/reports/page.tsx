"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Brain, MessageCircle, BookOpen, TrendingUp, AlertTriangle, ChevronRight, FileText, BarChart3, Calendar, Building2, Clock, Award } from "lucide-react";
import attendedInterviews from "@/data/attended-interviews.json";


function getPerformanceColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getPerformanceBg(score: number) {
  if (score >= 80) return 'bg-green-50 border-green-200';
  if (score >= 70) return 'bg-blue-50 border-blue-200';
  if (score >= 60) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
}

function getInterviewTypeLabel(type: string) {
  const types: { [key: string]: string } = {
    'hr': 'HR Round',
    'coding': 'Coding',
    'system-design': 'System Design',
    'problem-solving': 'Problem Solving',
    'domain-specific': 'Domain Specific',
    'aptitude': 'Aptitude',
    'case-study': 'Case Study'
  };
  return types[type] || type;
}

export default function InterviewReportsPage() {
  const interviews = attendedInterviews.attendedInterviews;

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#1E2B3A] mb-4">
              Interview Reports
            </h1>
            <p className="text-lg text-[#1a2b3b]">
              View your interview performance history and detailed reports
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FileText className="w-8 h-8 text-[#407BBF] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#1E2B3A]">{interviews.length}</div>
              <div className="text-sm text-[#1a2b3b]">Total Interviews</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#1E2B3A]">
                {Math.round(interviews.reduce((acc, int) => acc + int.overallScore, 0) / interviews.length)}%
              </div>
              <div className="text-sm text-[#1a2b3b]">Average Score</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#1E2B3A]">
                {interviews.filter(int => int.overallScore >= 80).length}
              </div>
              <div className="text-sm text-[#1a2b3b]">Excellent Scores</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#1E2B3A]">
                {Math.round(interviews.reduce((acc, int) => acc + int.duration, 0) / 3600)}h
              </div>
              <div className="text-sm text-[#1a2b3b]">Total Practice</div>
            </div>
          </div>
        </motion.div>

        {/* Interview List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-xl font-bold text-[#1E2B3A] mb-6">Recent Interviews</h2>

          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/~/reports/${interview.id}`}>
                  <div className={`border-2 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${getPerformanceBg(interview.overallScore)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-[#407BBF]/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-[#407BBF]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#1E2B3A]">{interview.company}</h3>
                            <p className="text-[#1a2b3b]">{interview.role}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(interview.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{Math.round(interview.duration / 60)} min</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>{getInterviewTypeLabel(interview.interviewType)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#1a2b3b]">
                            <span className="text-gray-400">by</span>
                            <span>{interview.interviewer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className={`text-3xl font-bold mb-1 ${getPerformanceColor(interview.overallScore)}`}>
                          {interview.overallScore}%
                        </div>
                        <div className={`text-sm font-medium ${getPerformanceColor(interview.overallScore)}`}>
                          {interview.performance}
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-[#407BBF] font-medium">
                            View Report
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}