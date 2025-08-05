"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Brain, MessageCircle, BookOpen, TrendingUp, AlertTriangle, ChevronRight, FileText, BarChart3, Calendar, Building2, Clock, Award } from "lucide-react";
import attendedInterviews from "../../../../data/attended-interviews.json";

// Feedback Section Component
function FeedbackSection({ 
  icon: Icon, 
  title, 
  insights, 
  accentColor = "#407BBF" 
}: { 
  icon: any;
  title: string;
  insights: string[];
  accentColor?: string;
}) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-gray-600" />
        <h4 className="text-sm font-semibold text-[#1E2B3A]">{title}</h4>
      </div>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <div 
              className="w-1 h-4 rounded-full mt-0.5 flex-shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-xs text-[#1a2b3b] leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Radial Progress Chart Component
function RadialChart({ value, size = 120, strokeWidth = 8, label }: { 
  value: number; 
  size?: number; 
  strokeWidth?: number; 
  label: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#407BBF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#1E2B3A]">{value}%</span>
        </div>
      </div>
      <p className="text-sm text-[#1a2b3b] mt-2 text-center">{label}</p>
    </div>
  );
}

// Radar Chart Component (simplified version)
function RadarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;
  
  // Generate points for the polygon
  const points = data.map((value, index) => {
    const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Generate grid circles
  const gridCircles = [20, 40, 60, 80].map(r => (
    <circle
      key={r}
      cx={center}
      cy={center}
      r={r}
      fill="none"
      stroke="#E5E7EB"
      strokeWidth="1"
    />
  ));

  // Generate axis lines
  const axisLines = labels.map((_, index) => {
    const angle = (index / labels.length) * 2 * Math.PI - Math.PI / 2;
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    return (
      <line
        key={index}
        x1={center}
        y1={center}
        x2={x}
        y2={y}
        stroke="#E5E7EB"
        strokeWidth="1"
      />
    );
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {gridCircles}
        {axisLines}
        <motion.polygon
          points={points}
          fill="rgba(64, 123, 191, 0.3)"
          stroke="#407BBF"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#407BBF] rounded-full"></div>
            <span className="text-sm text-[#1a2b3b]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
                <Link href={`/~/interview/reports/${interview.id}`}>
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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/~/interview">
            <button className="rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#2a3a4d] no-underline gap-x-2 active:scale-95 scale-100 duration-75">
              Take New Interview
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>

          <Link href="/~">
            <button className="rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 no-underline gap-x-2 active:scale-95 scale-100 duration-75">
              Back to Categories
            </button>
          </Link>
      </div>
    </div>
  );
}