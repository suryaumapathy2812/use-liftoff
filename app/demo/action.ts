"use server";

import { CreateOptions, RoomServiceClient } from "livekit-server-sdk";
import { redirect } from "next/navigation";

// NOTE: you are expected to define the following environment variables in `.env.local`:
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

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

    const room_name = `${props.type}-${
      props.agent.name
    }-${crypto.randomUUID()}`;

    const roomService = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);

    const roomOptions: CreateOptions = {
      name: room_name,
      emptyTimeout: 120, // Room will be deleted after 2 minutes of inactivity
      metadata: JSON.stringify(props.agent), // Store agent metadata in room metadata
    };

    // Create or get the room explicitly (rooms auto-create on first join, but explicit creation allows setting metadata)
    const room = await roomService.createRoom(roomOptions);

    console.log("Room created:", room);

    return {
      sid: room.sid,
      name: room.name,
      metadata: room.metadata,
      createdAt: room.creationTime,
      emptyTimeout: room.emptyTimeout
    };
  } catch (error) {
    console.log(error);
    // Redirect to error page or handle error appropriately
    redirect("/error");
  }
}
