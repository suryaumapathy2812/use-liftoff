"use server";

import { CreateOptions, EgressClient, EncodedFileOutput, EncodedFileType, RoomEgress, RoomServiceClient, S3Upload } from "livekit-server-sdk";
import { redirect } from "next/navigation";

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// ... existing environment variables ...
const AWS_BUCKET = process.env.AWS_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT_URL;

type CreateRoomProps = {
  agent: {
    name: string;
    display_name: string;
    description: string;
    type: string;
    level: string;
    specialty: string;
    gender: string;
    duration: number;
    avatar: string;
  };
  type: string;
  timestamp: string;
  enableRecording?: boolean;
};

export async function createRoom(props: CreateRoomProps) {
  console.log(props);

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

    const room_name = `${props.type}-${props.agent.name
      }-${crypto.randomUUID()}`;

    const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);


    const roomOptions: CreateOptions = {
      name: room_name,
      emptyTimeout: 120, // Room will be deleted after 2 minutes of inactivity
      metadata: JSON.stringify(props.agent), // Store agent metadata in room metadata
      maxParticipants: 2, // Limit to 2 participants (1 agent + 1 user)
    };

    // Create or get the room explicitly (rooms auto-create on first join, but explicit creation allows setting metadata)
    const room = await roomService.createRoom(roomOptions);

    // start recording if enabled

    let egressInfo = null;
    if (props.enableRecording ?? true) {
      try {
        const egressClient = new EgressClient(LIVEKIT_URL, API_KEY, API_SECRET);

        // Configure S3/MinIO upload
        const s3Config: Partial<S3Upload> = {
          bucket: AWS_BUCKET!,
          region: AWS_REGION || "us-east-1",
          accessKey: AWS_ACCESS_KEY!,
          secret: AWS_SECRET_KEY!,
          endpoint: AWS_ENDPOINT!, // For MinIO
          forcePathStyle: true, // Required for MinIO
        };

        egressInfo = await egressClient.startRoomCompositeEgress(
          room_name,
          {
            file: new EncodedFileOutput({
              fileType: EncodedFileType.MP4,
              filepath: `${room_name}/session.mp4`,
              output: {
                case: 's3',
                value: s3Config,
              },
            }),
          },
          {
            layout: "grid",
            audioOnly: true,
          }
        );

        console.log("Recording started:", egressInfo.egressId);
      } catch (egressError) {
        console.error("Failed to start recording:", egressError);
        // Don't fail room creation if recording fails
      }
    }

    console.log("Room created:", room);
    console.log("Egress Info:", egressInfo);

    return {
      sid: room.sid,
      name: room.name,
      metadata: room.metadata,
      createdAt: room.creationTime,
      emptyTimeout: room.emptyTimeout,
    };
  } catch (error) {
    console.log(error);
    // Redirect to error page or handle error appropriately
    redirect("/error");
  }
}
