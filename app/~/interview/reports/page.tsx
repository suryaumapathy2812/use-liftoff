"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import mockReport from "../../../../data/mock-interview-report.json";

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

export default function InterviewReportsPage() {
  const report = mockReport;

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
            Interview Report
          </h1>
          <p className="text-lg text-[#1a2b3b] mb-2">
            Session with {report.interviewer.name}
          </p>
          <p className="text-sm text-[#1a2b3b]">
            {new Date(report.timestamp).toLocaleDateString()} • {Math.floor(report.session.duration / 60)} minutes
          </p>
        </motion.div>

        {/* Performance Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-[#1E2B3A] mb-6 text-center">
            Candidate Performance Score
          </h2>
          <div className="flex justify-center mb-6">
            <RadialChart 
              value={report.performanceScore.overall} 
              size={150} 
              label="Overall Score"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(report.performanceScore.breakdown).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-[#407BBF] mb-1">{value}%</div>
                <div className="text-sm text-[#1a2b3b] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Behavioral Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-[#1E2B3A] mb-6">
              Behavioral Analysis
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1E2B3A] mb-4">Emotional State</h3>
              <div className="space-y-3">
                {Object.entries(report.behavioralAnalysis.emotionalState).filter(([key]) => key !== 'overall').map(([emotion, percentage]) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-sm text-[#1a2b3b] capitalize">{emotion}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-[#407BBF] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#1E2B3A] w-10">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <RadialChart 
                value={report.behavioralAnalysis.emotionalState.overall} 
                label="Overall Emotional State"
              />
            </div>
          </motion.div>

          {/* Speech Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-[#1E2B3A] mb-6">
              Speech Analysis
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-[#407BBF] mb-1">
                  {report.speechAnalysis.speaking.overall}%
                </div>
                <div className="text-sm text-[#1a2b3b]">Speaking</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#407BBF] mb-1">
                  {report.speechAnalysis.listening.overall}%
                </div>
                <div className="text-sm text-[#1a2b3b]">Listening</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#407BBF] mb-1">
                  {report.speechAnalysis.proficiency.overall}%
                </div>
                <div className="text-sm text-[#1a2b3b]">Proficiency</div>
              </div>
            </div>

            <div className="flex justify-center">
              <RadialChart 
                value={report.speechAnalysis.overallAverage} 
                label="Overall Speech Score"
              />
            </div>
          </motion.div>
        </div>

        {/* Field Knowledge Evaluation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 ClassName="text-2xl font-bold text-[#1E2B3A] mb-6 text-center">
            Field Knowledge Evaluation
          </h2>
          <div className="flex justify-center">
            <RadarChart 
              data={[
                report.fieldKnowledgeEvaluation.understanding,
                report.fieldKnowledgeEvaluation.applying,
                report.fieldKnowledgeEvaluation.analyzing
              ]}
              labels={['Understanding', 'Applying', 'Analyzing']}
            />
          </div>
        </motion.div>

        {/* Report Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-[#1E2B3A] mb-6">
            Report Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Strengths
              </h3>
              <ul className="space-y-2">
                {report.reportSummary.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-[#1a2b3b] pl-4 border-l-2 border-green-200">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {report.reportSummary.areasForImprovement.map((area, index) => (
                  <li key={index} className="text-sm text-[#1a2b3b] pl-4 border-l-2 border-orange-200">
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#1E2B3A] mb-3">Overall Feedback</h3>
            <p className="text-[#1a2b3b] leading-relaxed">{report.reportSummary.overallFeedback}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#1E2B3A] mb-3">Recommendation</h3>
            <p className="text-[#1a2b3b] leading-relaxed">{report.reportSummary.recommendation}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#1E2B3A] mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.reportSummary.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="w-6 h-6 bg-[#407BBF] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-[#1a2b3b]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/~/interview">
            <button className="rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#2a3a4d] no-underline gap-x-2 active:scale-95 scale-100 duration-75">
              Practice Again
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>

          <Link href="/~">
            <button className="rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 no-underline gap-x-2 active:scale-95 scale-100 duration-75">
              Back to Categories
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}