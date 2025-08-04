"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { gradient } from "@/components/Gradient";

export default function SessionComplete() {
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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="w-20 h-20 rounded-full bg-[#407BBF] flex items-center justify-center mb-8"
        >
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="text-4xl md:text-6xl font-extrabold text-[#1E2B3A] text-center mb-4"
        >
          Session Complete!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="text-lg md:text-xl text-[#1a2b3b] text-center mb-8 max-w-2xl"
        >
          Great job on completing your practice session! Every conversation helps you build confidence and improve your communication skills.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.5,
            ease: [0.165, 0.84, 0.44, 1],
          }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/demo"
            className="group rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:bg-[#2a3a4d] no-underline active:scale-95 scale-100 duration-75"
            style={{
              boxShadow:
                "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
            }}
          >
            Start Another Session
            <svg
              className="w-5 h-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.75 6.75L19.25 12L13.75 17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12H4.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            href="/"
            className="group rounded-full px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
            style={{
              boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
            }}
          >
            Back to Home
          </Link>
        </motion.div>


      </main>

      <canvas
        id="gradient-canvas"
        className="fixed top-0 left-0 w-full h-full z-0"
      ></canvas>
    </div>
  );
}