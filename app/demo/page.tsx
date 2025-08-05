"use client";

import { AnimatePresence, motion } from "motion/react";
import { RadioGroup } from "@headlessui/react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import agentData from "../../data/agents.json";
import { createRoom } from "./action";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Type labels for display
const typeLabels = {
  interview: {
    name: "Interview",
    description: "Practice technical and behavioral interviews",
  },
  presentation: {
    name: "Presentation Skills",
    description: "Improve your public speaking and presentation abilities",
  },
  english_speaking: {
    name: "English Speaking",
    description: "Practice conversational English for various scenarios",
  },
  general: {
    name: "General Purpose",
    description: "Practice various communication and debate skills",
  },
};

export default function DemoPage() {
  const [selectedType, setSelectedType] = useState("interview");
  const [selectedAgent, setSelectedAgent] = useState(
    agentData.agents.find((a) => a.type === "interview")!
  );
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Group agents by type
  const agentsByType = useMemo(() => {
    const grouped = agentData.agents.reduce((acc, agent) => {
      if (!acc[agent.type]) {
        acc[agent.type] = [];
      }
      (acc[agent.type] ?? []).push(agent);
      return acc;
    }, {} as Record<string, typeof agentData.agents>);
    return grouped;
  }, []);

  // Get unique types for category selection
  const availableTypes = Object.keys(agentsByType);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      // Create room with agent metadata
      const agentMetadata = {
        agent: selectedAgent,
        type: selectedType,
        timestamp: new Date().toISOString(),
      };

      const room = await createRoom(agentMetadata);
      router.push(`/room?id=${room?.name}`);
    } catch (error) {
      console.error("Failed to start session:", error);
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    const firstAgent = agentsByType[type]?.[0];
    if (firstAgent) {
      setSelectedAgent(firstAgent);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FCFCFC]">
      <div className="w-full max-w-lg mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              key="step-1"
              transition={{
                duration: 0.75,
                ease: [0.165, 0.84, 0.44, 1],
              }}
            >
              <h2 className="text-4xl font-bold text-[#1E2B3A]">
                Select a category
              </h2>
              <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                Choose what you want to practice - interviews,
                presentations, or conversations.
              </p>
              <div>
                <RadioGroup
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  <RadioGroup.Label className="sr-only">
                    Category
                  </RadioGroup.Label>
                  <div className="space-y-4">
                    {availableTypes.map((type) => (
                      <RadioGroup.Option
                        key={type}
                        value={type}
                        className={({ checked, active }) =>
                          classNames(
                            checked
                              ? "border-[#1E2B3A] ring-2 ring-[#1E2B3A]/10"
                              : "border-gray-300",
                            active
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "",
                            "relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between"
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label
                                  as="span"
                                  className="font-medium text-gray-900"
                                >
                                  {typeLabels[
                                    type as keyof typeof typeLabels
                                  ]?.name || type}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className="text-gray-500"
                                >
                                  <span className="block sm:inline">
                                    {typeLabels[
                                      type as keyof typeof typeLabels
                                    ]?.description ||
                                      "Practice and improve your skills"}
                                  </span>
                                </RadioGroup.Description>
                              </span>
                            </span>
                            {checked ? (
                              <div className="shrink-0 flex items-center">
                                <CheckIcon className="h-6 w-6" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-8 flex gap-4 justify-between">
                <Link href="/">
                  <button
                    className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 no-underline gap-x-2 active:scale-95 scale-100 duration-75"
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
                    Back
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setStep(2);
                  }}
                  className="ml-auto group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline gap-x-2 active:scale-95 scale-100 duration-75"
                  style={{
                    boxShadow:
                      "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  Continue
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              key="step-2"
              transition={{
                duration: 0.65,
                ease: [0.165, 0.84, 0.44, 1],
              }}
            >
              <h2 className="text-4xl font-bold text-[#1E2B3A]">
                Choose your agent
              </h2>
              <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                Select the perfect practice partner for your{" "}
                {typeLabels[
                  selectedType as keyof typeof typeLabels
                ]?.name.toLowerCase() || selectedType}{" "}
                session.
              </p>
              <div>
                <RadioGroup
                  value={selectedAgent}
                  onChange={setSelectedAgent}
                >
                  <RadioGroup.Label className="sr-only">
                    Agent
                  </RadioGroup.Label>
                  <div className="space-y-4">
                    {agentsByType[selectedType]?.map((agent) => (
                      <RadioGroup.Option
                        key={agent.name}
                        value={agent}
                        className={({ checked, active }) =>
                          classNames(
                            checked
                              ? "border-[#1E2B3A] ring-2 ring-[#1E2B3A]/10"
                              : "border-gray-300",
                            active
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "",
                            "relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between"
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label
                                  as="span"
                                  className="font-medium text-gray-900"
                                >
                                  {agent.display_name}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className="text-gray-500"
                                >
                                  <span className="block sm:inline">
                                    {agent.specialty} • {agent.duration} min
                                  </span>
                                </RadioGroup.Description>
                              </span>
                            </span>
                            {checked ? (
                              <div className="shrink-0 flex items-center">
                                <CheckIcon className="h-6 w-6" />
                              </div>
                            ) : null}
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-8 flex gap-4 justify-between">
                <button
                  onClick={() => {
                    setStep(1);
                  }}
                  disabled={isLoading}
                  className={classNames(
                    "group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 no-underline gap-x-2 active:scale-95 scale-100 duration-75",
                    isLoading
                      ? "cursor-not-allowed opacity-50"
                      : "bg-white hover:bg-gray-50"
                  )}
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
                  Back
                </button>
                <button
                  onClick={handleStartSession}
                  disabled={isLoading}
                  className={classNames(
                    "group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center text-white no-underline gap-x-2 active:scale-95 scale-100 duration-75",
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#1E2B3A] hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247]"
                  )}
                  style={{
                    boxShadow:
                      "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Starting...</span>
                    </>
                  ) : (
                    <>
                      Start Session ({selectedAgent.duration} min)
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#1E2B3A" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
