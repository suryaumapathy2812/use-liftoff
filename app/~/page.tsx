"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { gradient } from "@/components/Gradient";
import categoriesData from "../../data/categories.json";

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

export default function CategoriesPage() {
  useEffect(() => {
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col relative bg-[#F2F3F5] font-inter overflow-hidden">
      <svg
        style={{ filter: "contrast(125%) brightness(110%)" }}
        className="fixed z-[1] w-full h-full opacity-[35%]"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".7"
            numOctaves="3"
            stitchTiles="stitch"
          ></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)"></rect>
      </svg>

      <main className="flex flex-col justify-center items-center h-screen static md:fixed w-screen overflow-hidden z-[100] px-4 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.95,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1E2B3A] mb-4">
            Choose Your Practice
          </h1>
          <p className="text-lg md:text-xl text-[#1a2b3b] max-w-2xl">
            Select the skill you want to develop with our AI-powered practice sessions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {categoriesData.categories.map((category, index) => {
            const IconComponent = iconComponents[category.icon as keyof typeof iconComponents];
            const isActive = category.status === "active";
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.75,
                  ease: [0.165, 0.84, 0.44, 1],
                }}
              >
                {isActive ? (
                  <Link href={category.route}>
                    <div className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#407BBF]/20 cursor-pointer">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#407BBF]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#407BBF]/20 transition-colors">
                          <IconComponent className="w-8 h-8 text-[#407BBF]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1E2B3A] mb-3">
                          {category.name}
                        </h3>
                        <p className="text-[#1a2b3b] leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative bg-white/50 rounded-xl p-8 shadow-lg border border-gray-100 opacity-75">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <IconComponent className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-600 mb-3">
                        {category.name}
                      </h3>
                      <p className="text-gray-500 leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12"
        >
          <Link
            href="/"
            className="group rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 no-underline gap-x-2 active:scale-95 scale-100 duration-75"
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
            Back to Home
          </Link>
        </motion.div>
      </main>

      <div
        className="fixed top-0 right-0 w-[80%] md:w-1/2 h-screen bg-[#1F2B3A]/20"
        style={{
          clipPath:
            "polygon(100px 0,100% 0,calc(100% + 225px) 100%, 480px 100%)",
        }}
      ></div>

      <canvas
        id="gradient-canvas"
        className="fixed top-0 left-0 w-full h-full z-0"
      ></canvas>
    </div>
  );
}