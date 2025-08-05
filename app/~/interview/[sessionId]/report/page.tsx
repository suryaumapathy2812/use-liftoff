"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Brain, MessageCircle, BookOpen, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";
import mockReport from "@/data/mock-interview-report.json";


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
  const [activeTab, setActiveTab] = useState('behavioral');

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Simplified Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-blue-100 text-sm mb-2">
                {new Date(report.timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-3xl font-bold mb-6">Interview Performance Report</h1>
              
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-1">{report.performanceScore.overall}%</div>
                  <div className="text-blue-100 text-sm">Overall Score</div>
                </div>
                <div className="w-px h-16 bg-blue-400"></div>
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-1">
                    {report.performanceScore.overall >= 80 ? 'Excellent' : 
                     report.performanceScore.overall >= 70 ? 'Good' :
                     report.performanceScore.overall >= 60 ? 'Satisfactory' : 'Needs Improvement'}
                  </div>
                  <div className="text-blue-100 text-sm">Performance Level</div>
                </div>
              </div>
              
              <p className="text-blue-100 max-w-2xl mx-auto">
                You performed better than <span className="font-semibold text-white">{report.performanceScore.overall}%</span> of candidates 
                in your {report.session.duration / 60}-minute session with {report.interviewer.name}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Performance Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-[#1E2B3A] mb-6">Performance Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Behavioral Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain size={20} className="text-[#6366F1]" />
                <h3 className="text-lg font-semibold text-[#1E2B3A]">Behavioral</h3>
                <span className="ml-auto text-2xl font-bold text-[#6366F1]">{report.behavioralAnalysis.emotionalState.overall}%</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(report.behavioralAnalysis.emotionalState)
                  .filter(([key]) => key !== 'overall')
                  .map(([emotion, value]) => (
                    <div key={emotion} className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-xs text-gray-600 capitalize mb-1">{emotion}</div>
                      <div className="text-lg font-bold text-[#6366F1]">{value}%</div>
                    </div>
                  ))}
              </div>
              
              <div className="space-y-2">
                {report.behavioralAnalysis.insights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#6366F1] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-xs text-[#1a2b3b] leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Analysis */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={20} className="text-[#10B981]" />
                <h3 className="text-lg font-semibold text-[#1E2B3A]">Communication</h3>
                <span className="ml-auto text-2xl font-bold text-[#10B981]">{report.speechAnalysis.overallAverage}%</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Speaking</div>
                  <div className="text-lg font-bold text-[#10B981]">{report.speechAnalysis.speaking.overall}%</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Listening</div>
                  <div className="text-lg font-bold text-[#10B981]">{report.speechAnalysis.listening.overall}%</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Clarity</div>
                  <div className="text-lg font-bold text-[#10B981]">{report.speechAnalysis.speaking.clarityScore}%</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Proficiency</div>
                  <div className="text-lg font-bold text-[#10B981]">{report.speechAnalysis.proficiency.overall}%</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {report.speechAnalysis.insights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-xs text-[#1a2b3b] leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Knowledge */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-[#8B5CF6]" />
                <h3 className="text-lg font-semibold text-[#1E2B3A]">Field Knowledge</h3>
                <span className="ml-auto text-2xl font-bold text-[#8B5CF6]">
                  {Math.round((report.fieldKnowledgeEvaluation.understanding + 
                               report.fieldKnowledgeEvaluation.applying + 
                               report.fieldKnowledgeEvaluation.analyzing) / 3)}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Understanding</div>
                  <div className="text-lg font-bold text-[#8B5CF6]">{report.fieldKnowledgeEvaluation.understanding}%</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Applying</div>
                  <div className="text-lg font-bold text-[#8B5CF6]">{report.fieldKnowledgeEvaluation.applying}%</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg col-span-2">
                  <div className="text-xs text-gray-600 mb-1">Analyzing</div>
                  <div className="text-lg font-bold text-[#8B5CF6]">{report.fieldKnowledgeEvaluation.analyzing}%</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {report.fieldKnowledgeEvaluation.insights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-xs text-[#1a2b3b] leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Insights Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-[#1E2B3A] mb-6">Detailed Insights</h2>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('behavioral')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'behavioral' 
                  ? 'text-[#6366F1] border-b-2 border-[#6366F1]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain size={16} />
                Behavioral
              </div>
            </button>
            <button
              onClick={() => setActiveTab('speech')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'speech' 
                  ? 'text-[#10B981] border-b-2 border-[#10B981]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={16} />
                Communication
              </div>
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'knowledge' 
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                Field Knowledge
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'behavioral' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Object.entries(report.behavioralAnalysis.emotionalState)
                    .filter(([key]) => key !== 'overall')
                    .map(([emotion, value]) => (
                      <div key={emotion} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 capitalize mb-1">{emotion}</div>
                        <div className="text-lg font-bold text-[#6366F1]">{value}%</div>
                      </div>
                    ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-[#1E2B3A] mb-3">Key Observations</h4>
                  <div className="space-y-3">
                    {report.behavioralAnalysis.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <ChevronRight size={16} className="text-[#6366F1] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#1a2b3b]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'speech' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Speaking Skills</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Clarity</span>
                        <span className="font-medium">{report.speechAnalysis.speaking.clarityScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pace</span>
                        <span className="font-medium">{report.speechAnalysis.speaking.paceScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume</span>
                        <span className="font-medium">{report.speechAnalysis.speaking.volumeConsistency}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Listening Skills</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span className="font-medium">{report.speechAnalysis.listening.responseTime}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comprehension</span>
                        <span className="font-medium">{report.speechAnalysis.listening.comprehension}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Follow-up</span>
                        <span className="font-medium">{report.speechAnalysis.listening.followUpQuestions}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Language Proficiency</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Vocabulary</span>
                        <span className="font-medium">{report.speechAnalysis.proficiency.vocabularyRange}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Grammar</span>
                        <span className="font-medium">{report.speechAnalysis.proficiency.grammarAccuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Terms</span>
                        <span className="font-medium">{report.speechAnalysis.proficiency.technicalTerminology}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-[#1E2B3A] mb-3">Communication Insights</h4>
                  <div className="space-y-3">
                    {report.speechAnalysis.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <ChevronRight size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#1a2b3b]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'knowledge' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="mb-6">
                  <RadarChart 
                    data={[
                      report.fieldKnowledgeEvaluation.understanding,
                      report.fieldKnowledgeEvaluation.applying,
                      report.fieldKnowledgeEvaluation.analyzing
                    ]}
                    labels={['Understanding', 'Applying', 'Analyzing']}
                  />
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-[#1E2B3A] mb-3">Technical Assessment</h4>
                  <div className="space-y-3">
                    {report.fieldKnowledgeEvaluation.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <ChevronRight size={16} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#1a2b3b]">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Interview Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-[#1E2B3A] mb-6">Interview Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                What You Did Well
              </h3>
              <ul className="space-y-2">
                {report.reportSummary.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-[#1a2b3b] pl-4 border-l-2 border-green-200 flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
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
                Areas for Growth
              </h3>
              <ul className="space-y-2">
                {report.reportSummary.areasForImprovement.map((area, index) => (
                  <li key={index} className="text-sm text-[#1a2b3b] pl-4 border-l-2 border-orange-200 flex items-start">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#1E2B3A] mb-3">Overall Assessment</h3>
            <p className="text-[#1a2b3b] leading-relaxed">{report.reportSummary.overallFeedback}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1E2B3A] mb-3">Our Recommendation</h3>
            <p className="text-[#1a2b3b] leading-relaxed">{report.reportSummary.recommendation}</p>
          </div>
        </motion.div>

        {/* Action Plan */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-[#1E2B3A] mb-6">Your Development Roadmap</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.reportSummary.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-[#F8F9FA] rounded-lg hover:shadow-sm transition-shadow">
                <div className="w-6 h-6 bg-[#407BBF] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-[#1a2b3b]">{step}</p>
              </div>
            ))}
          </div>
        </motion.div> */}

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