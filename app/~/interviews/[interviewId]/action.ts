"use server";

import { EgressClient, RoomServiceClient, EncodedFileOutput, EncodedFileType } from "livekit-server-sdk";
import type { CreateOptions, S3Upload } from "livekit-server-sdk";
import { redirect } from "next/navigation";
import jobDescriptions from "../../../../data/job-descriptions.json";

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// AWS S3 environment variables
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
const AWS_S3_REGION = process.env.AWS_S3_REGION;
const AWS_S3_ACCESS_KEY = process.env.AWS_S3_ACCESS_KEY;
const AWS_S3_SECRET_KEY = process.env.AWS_S3_SECRET_KEY;
const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT_URL;

type CreateInterviewSessionProps = {
  jobId: string;
  interviewRound: string;
  sessionId: string;
  enableRecording?: boolean;
};

export async function createInterviewSession(props: CreateInterviewSessionProps) {
  console.log("Creating interview session:", props);

  try {
    if (LIVEKIT_URL === undefined) {
      throw new Error("LIVEKIT_URL is not defined");
    }
    if (API_KEY === undefined) {
      throw new Error("LIVEKIT_API_KEY is not defined");
    }
    if (API_SECRET === undefined) {
      throw new Error("LIVEKIT_API_SECRET is not defined");
    }

    // Find the job description
    const selectedJob = jobDescriptions.jobDescriptions.find(job => job.id === props.jobId);
    if (!selectedJob) {
      throw new Error("Job description not found");
    }

    // Convert JD to agent format
    const agent = {
      name: `${selectedJob.company.replace(/\s+/g, '_')}_${props.interviewRound}_Interviewer`,
      display_name: `${selectedJob.company} - ${props.interviewRound.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Interviewer`,
      description: JSON.stringify({
        job: {
          id: selectedJob.id,
          company: selectedJob.company,
          role: selectedJob.role,
          location: selectedJob.location,
          experience: selectedJob.experience,
          salary: selectedJob.salary,
          skills: selectedJob.skills,
          jobType: selectedJob.jobType,
          postedDate: selectedJob.postedDate,
          description: selectedJob.description
        },
        interviewType: props.interviewRound,
        instructions: getInterviewInstructions(props.interviewRound, selectedJob)
      }),
      type: "interview",
      level: getInterviewLevel(props.interviewRound),
      specialty: getSpecialty(props.interviewRound, selectedJob),
      gender: "neutral",
      duration: getInterviewDuration(props.interviewRound),
      avatar: "/avatars/interviewer.png"
    };

    const room_name = props.sessionId;
    const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);

    const roomOptions: CreateOptions = {
      name: room_name,
      emptyTimeout: 300, // Room will be deleted after 5 minutes of inactivity
      metadata: JSON.stringify(agent), // Store agent metadata in room metadata
      maxParticipants: 2, // Limit to 2 participants (1 agent + 1 candidate)
    };

    // Create the room
    const room = await roomService.createRoom(roomOptions);

    // Start recording if enabled
    let egressInfo: any = null;
    if (props.enableRecording ?? true) {
      try {
        const egressClient = new EgressClient(LIVEKIT_URL, API_KEY, API_SECRET);

        // Configure S3/MinIO upload
        const s3Config: Partial<S3Upload> = {
          bucket: AWS_S3_BUCKET!,
          region: AWS_S3_REGION || "us-east-1",
          accessKey: AWS_S3_ACCESS_KEY!,
          secret: AWS_S3_SECRET_KEY!,
          endpoint: AWS_S3_ENDPOINT!, // For MinIO
          forcePathStyle: true, // Required for MinIO
        };

        egressInfo = await egressClient.startRoomCompositeEgress(
          room_name,
          {
            file: new EncodedFileOutput({
              fileType: EncodedFileType.MP4,
              filepath: `interviews/${room_name}/session.mp4`,
              output: {
                case: 's3',
                value: s3Config,
              },
            }),
          },
          {
            layout: "grid",
            audioOnly: false,
          }
        );

        console.log("Interview recording started:", egressInfo.egressId);
      } catch (egressError) {
        console.error("Failed to start interview recording:", egressError);
        // Don't fail room creation if recording fails
      }
    }

    console.log("Interview session created:", room);
    console.log("Agent configuration:", agent);
    console.log("Egress Info:", egressInfo);

    return {
      sid: room.sid,
      name: room.name,
      metadata: room.metadata,
      createdAt: room.creationTime,
      emptyTimeout: room.emptyTimeout,
      agent: agent,
      egressId: egressInfo?.egressId,
    };
  } catch (error) {
    console.error("Failed to create interview session:", error);
    // Redirect to error page or handle error appropriately
    redirect("/error");
  }
}

function getInterviewInstructions(interviewRound: string, job: any): string {
  const baseInstructions = `You are conducting a ${interviewRound.replace('-', ' ')} interview for the position of ${job.role} at ${job.company}.`;
  
  switch (interviewRound) {
    case "hr":
      return `${baseInstructions} Focus on behavioral questions, company culture fit, and the candidate's motivation. Ask about their background, why they're interested in this role, and situational questions using the STAR method. Be friendly but professional.`;
    
    case "coding":
      return `${baseInstructions} Conduct a coding interview focusing on programming challenges relevant to the required skills: ${job.skills.join(', ')}. Present coding problems, ask them to code solutions, and discuss time/space complexity. Be encouraging and provide hints if they get stuck.`;
    
    case "system-design":
      return `${baseInstructions} Focus on system architecture and scalability discussions. Present real-world system design problems relevant to the role. Discuss trade-offs, scalability, databases, and distributed systems. Encourage them to think out loud and draw diagrams.`;
    
    case "problem-solving":
      return `${baseInstructions} Present analytical and logical reasoning challenges. Focus on their problem-solving approach, critical thinking, and ability to break down complex problems. Ask follow-up questions about their reasoning process.`;
    
    case "domain-specific":
      return `${baseInstructions} Focus on role-specific technical knowledge related to ${job.skills.join(', ')}. Ask in-depth questions about technologies, frameworks, and best practices relevant to the position. Assess their practical experience and theoretical understanding.`;
    
    case "aptitude":
      return `${baseInstructions} Conduct quantitative and logical reasoning assessments. Present mathematical problems, logical puzzles, and analytical questions. Focus on their problem-solving speed and accuracy.`;
    
    case "case-study":
      return `${baseInstructions} Present business scenarios and strategic thinking challenges relevant to ${job.company}'s industry. Ask them to analyze business problems, propose solutions, and justify their recommendations. Focus on their business acumen and strategic thinking.`;
    
    default:
      return `${baseInstructions} Conduct a comprehensive interview covering both technical and behavioral aspects relevant to the role.`;
  }
}

function getInterviewLevel(interviewRound: string): string {
  switch (interviewRound) {
    case "hr":
      return "Senior";
    case "coding":
    case "system-design":
      return "Expert";
    case "problem-solving":
    case "aptitude":
      return "Advanced";
    case "domain-specific":
      return "Specialist";
    case "case-study":
      return "Senior";
    default:
      return "Senior";
  }
}

function getSpecialty(interviewRound: string, job: any): string {
  switch (interviewRound) {
    case "hr":
      return "HR & Behavioral";
    case "coding":
      return "Technical Coding";
    case "system-design":
      return "System Architecture";
    case "problem-solving":
      return "Problem Solving";
    case "domain-specific":
      return job.skills[0] || "Technical Domain";
    case "aptitude":
      return "Aptitude & Logic";
    case "case-study":
      return "Business Strategy";
    default:
      return "General Interview";
  }
}

function getInterviewDuration(interviewRound: string): number {
  switch (interviewRound) {
    case "hr":
      return 30;
    case "coding":
      return 60;
    case "system-design":
      return 45;
    case "problem-solving":
      return 45;
    case "domain-specific":
      return 60;
    case "aptitude":
      return 30;
    case "case-study":
      return 45;
    default:
      return 45;
  }
}