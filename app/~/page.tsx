"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import categoriesData from "../../data/categories.json";
import { MessageSquare, BarChart3, FileText, Calendar, TrendingUp, Clock } from "lucide-react";

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect x="2" y="7" width="20" height="13" rx="1" />
    </svg>
  );
}

function PresentationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function MicrophoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

const iconComponents = {
  briefcase: BriefcaseIcon,
  presentation: PresentationIcon,
  microphone: MicrophoneIcon,
};

export default function DashboardPage() {
  const activeCategory = categoriesData.categories.find(cat => cat.status === "active");
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.165, 0.84, 0.44, 1] }}
      >
        <h1 className="text-4xl font-bold text-[#1E2B3A]">
          Welcome to your Dashboard
        </h1>
        <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mt-4">
          Track your interview progress and improve your skills with personalized practice sessions.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-[#1E2B3A]">12</p>
            </div>
            <MessageSquare className="h-8 w-8 text-[#407BBF]" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-[#1E2B3A]">3</p>
            </div>
            <Calendar className="h-8 w-8 text-[#407BBF]" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-[#1E2B3A]">8.2</p>
            </div>
            <TrendingUp className="h-8 w-8 text-[#407BBF]" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practice Time</p>
              <p className="text-2xl font-bold text-[#1E2B3A]">24h</p>
            </div>
            <Clock className="h-8 w-8 text-[#407BBF]" />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Practice Categories */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
          <h2 className="text-xl font-bold text-[#1E2B3A] mb-6">Practice Categories</h2>
          <div className="space-y-4">
            {categoriesData.categories.map((category, index) => {
              const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
              const isActive = category.status === "active";
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {isActive ? (
                    <Link href={category.route}>
                      <div className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-[#407BBF]/20 hover:bg-[#407BBF]/5 transition-all duration-200 cursor-pointer">
                        <div className="w-10 h-10 bg-[#407BBF]/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#407BBF]/20 transition-colors">
                          <IconComponent className="w-5 h-5 text-[#407BBF]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1E2B3A]">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center p-4 rounded-lg border border-gray-200 opacity-60">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <IconComponent className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-600">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-[#1E2B3A] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/~/interviews"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-[#407BBF] mr-3" />
                  <span className="font-medium text-[#1E2B3A]">Start New Interview</span>
                </div>
                <span className="text-gray-400 group-hover:text-[#407BBF] transition-colors">→</span>
              </Link>
              
              <Link
                href="/~/reports"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-[#407BBF] mr-3" />
                  <span className="font-medium text-[#1E2B3A]">View Reports</span>
                </div>
                <span className="text-gray-400 group-hover:text-[#407BBF] transition-colors">→</span>
              </Link>
              
              <Link
                href="/~/resume"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-[#407BBF] mr-3" />
                  <span className="font-medium text-[#1E2B3A]">Update Resume</span>
                </div>
                <span className="text-gray-400 group-hover:text-[#407BBF] transition-colors">→</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-[#407BBF] to-[#407BBF]/80 rounded-xl p-6 text-white shadow-lg"
          >
            <h3 className="text-lg font-bold mb-2">Ready for your next interview?</h3>
            <p className="text-white/90 mb-4 text-sm">
              Practice with our AI interviewer and get instant feedback
            </p>
            {activeCategory && (
              <Link
                href={activeCategory.route}
                className="inline-flex items-center px-4 py-2 bg-white text-[#407BBF] rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Start Practice Session
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}