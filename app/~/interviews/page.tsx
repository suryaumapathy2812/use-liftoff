"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import jobDescriptions from "../../../data/job-descriptions.json";
import { MapPin, Clock, Briefcase, Building2, ArrowRight, Search, Filter, X, Calendar, ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function InterviewsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Get unique values for filters
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(jobDescriptions.jobDescriptions.map(job => job.location)));
    return uniqueLocations.sort();
  }, []);

  const experienceLevels = useMemo(() => {
    const uniqueExperience = Array.from(new Set(jobDescriptions.jobDescriptions.map(job => job.experience)));
    return uniqueExperience.sort();
  }, []);

  const jobRoles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(jobDescriptions.jobDescriptions.map(job => job.role)));
    return uniqueRoles.sort();
  }, []);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobDescriptions.jobDescriptions.filter(job => {
      const matchesSearch = searchQuery === "" ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = selectedLocation === "" || job.location === selectedLocation;
      const matchesExperience = selectedExperience === "" || job.experience === selectedExperience;
      const matchesRole = selectedRole === "" || job.role === selectedRole;

      return matchesSearch && matchesLocation && matchesExperience && matchesRole;
    });
  }, [searchQuery, selectedLocation, selectedExperience, selectedRole]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedExperience("");
    setSelectedRole("");
  };

  const hasActiveFilters = searchQuery || selectedLocation || selectedExperience || selectedRole;

  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.165, 0.84, 0.44, 1] }}
      >
        <h1 className="text-4xl font-bold text-[#1E2B3A]">
          Choose a Position
        </h1>
        <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal mt-4">
          Select a job position to practice your interview skills with our AI interviewer.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.165, 0.84, 0.44, 1], delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by company, role, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1E2B3A]/10 focus:border-[#1E2B3A] transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#1E2B3A] rounded-full"></span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-600 hover:text-[#1E2B3A] transition-colors"
              >
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>

          <div className="text-[13px] text-gray-600">
            {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div
            className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-[13px] font-medium text-gray-900 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1E2B3A]/10 focus:border-[#1E2B3A] transition-colors"
                >
                  <option value="">All locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block text-[13px] font-medium text-gray-900 mb-2">
                  Experience Level
                </label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1E2B3A]/10 focus:border-[#1E2B3A] transition-colors"
                >
                  <option value="">All experience levels</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Job Role Filter */}
              <div>
                <label className="block text-[13px] font-medium text-gray-900 mb-2">
                  Job Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1E2B3A]/10 focus:border-[#1E2B3A] transition-colors"
                >
                  <option value="">All job roles</option>
                  {jobRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Job Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.165, 0.84, 0.44, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 cursor-pointer"
      >
        {filteredJobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E2B3A] mb-2">No positions found</h3>
            <p className="text-[13px] text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more positions.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[13px] font-medium text-[#1E2B3A] hover:text-[#1E2B3A]/80 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.165, 0.84, 0.44, 1] }}
              onClick={() => handleJobClick(job)}
              className="group bg-white rounded-lg border border-gray-300 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#1E2B3A] focus:outline-none cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center">
                  <span className="flex flex-col text-sm">
                    <span className="font-medium text-gray-900">
                      {job.company}
                    </span>
                    <span className="text-gray-500">
                      <span className="block sm:inline">
                        {job.role} • {job.location}
                      </span>
                    </span>
                  </span>
                </span>
              </div>

              <div className="mb-4">
                <p className="text-[13px] text-gray-600 mb-2">{job.experience}</p>
                <p className="text-[13px] font-medium text-[#1E2B3A]">{job.salary}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 4).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="text-[11px] px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>

            </motion.div>
          ))
        )}
      </motion.div>

      {/* Job Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[800px] md:w-[700px] sm:max-w-auto overflow-y-auto">
          {selectedJob && (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-[#1E2B3A]">
                  {selectedJob.company}
                </SheetTitle>
                <SheetDescription className="text-[14px] text-[#1a2b3b]">
                  {selectedJob.role}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Job Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{selectedJob.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[13px] font-medium text-[#1E2B3A]">
                    {selectedJob.salary}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1E2B3A] mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill: string, skillIndex: number) => (
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
                <div>
                  <h3 className="text-sm font-semibold text-[#1E2B3A] mb-3">Job Description</h3>
                  <div className="prose prose-sm max-w-none text-[#1a2b3b] leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h2: (props: any) => (
                          <h3 className="text-sm font-semibold text-[#1E2B3A] mt-4 mb-2 first:mt-0">
                            {props.children}
                          </h3>
                        ),
                        h3: (props: any) => (
                          <h4 className="text-sm font-semibold text-[#1E2B3A] mt-3 mb-2">
                            {props.children}
                          </h4>
                        ),
                        p: (props: any) => (
                          <p className="mb-3 text-[13px] text-[#1a2b3b]">
                            {props.children}
                          </p>
                        ),
                        ul: (props: any) => (
                          <ul className="mb-4 space-y-1">
                            {props.children}
                          </ul>
                        ),
                        li: (props: any) => (
                          <li className="ml-4 text-[13px] text-[#1a2b3b] list-disc">
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
                      {selectedJob.description}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsSheetOpen(false);
                      // Comment out the navigation for now
                      // router.push(`/~/interviews/${selectedJob.id}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1E2B3A] text-white rounded-lg text-[13px] font-medium hover:bg-[#1E2B3A]/90 transition-colors"
                  >
                    Start Interview
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}