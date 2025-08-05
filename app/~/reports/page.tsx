"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Building2, Calendar, Award } from "lucide-react";
import attendedInterviews from "@/data/attended-interviews.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


function getPerformanceColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getStatusBadge(score: number) {
  if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
  if (score >= 70) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
  if (score >= 60) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
}

export default function InterviewReportsPage() {
  const interviews = attendedInterviews.attendedInterviews;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-[#1E2B3A] mb-2">
          Interview Reports
        </h1>
        <p className="text-lg text-[#1a2b3b]">
          View your interview performance history and detailed reports
        </p>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Performance Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview, index) => {
              const status = getStatusBadge(interview.overallScore);
              return (
                <motion.tr
                  key={interview.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#407BBF]/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#407BBF]" />
                      </div>
                      <span className="font-medium text-[#1E2B3A]">{interview.company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[#1a2b3b]">
                    {interview.role}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className={`w-4 h-4 ${getPerformanceColor(interview.overallScore)}`} />
                      <span className={`font-bold ${getPerformanceColor(interview.overallScore)}`}>
                        {interview.overallScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[#1a2b3b]">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(interview.date).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/~/reports/${interview.id}`}>
                      <button className="flex items-center gap-2 text-[#407BBF] hover:text-[#407BBF]/80 font-medium text-sm transition-colors">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </Link>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}