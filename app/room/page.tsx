"use client";

import {
  ControlBar,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track, RoomEvent } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function RoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams!.get("id");
  const username = "user";

  console.log("Room ID:", roomId);

  const [roomInstance] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  useEffect(() => {
    let mounted = true;
    
    // Set up room event listeners
    const handleDisconnected = () => {
      console.log("Room disconnected, redirecting to completion page...");
      router.push("/session-complete");
    };

    const handleParticipantDisconnected = () => {
      // Check if we're the only participant left
      if (roomInstance.numParticipants === 0) {
        console.log("All other participants left, ending session...");
        router.push("/session-complete");
      }
    };

    // Add event listeners
    roomInstance.on(RoomEvent.Disconnected, handleDisconnected);
    roomInstance.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    (async () => {
      try {
        const resp = await fetch(
          `/api/token?room=${roomId}&username=${username}`
        );
        const data = await resp.json();
        console.log("Room connection data:", data);

        if (!mounted) return;
        if (data.participantToken) {
          await roomInstance.connect(data.serverUrl, data.participantToken);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
      // Remove event listeners
      roomInstance.off(RoomEvent.Disconnected, handleDisconnected);
      roomInstance.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      roomInstance.disconnect();
    };
  }, [roomId, roomInstance, router]);

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: "100dvh" }}>
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div
      style={{
        height: "calc(100vh - var(--lk-control-bar-height))",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "10px",
        padding: "10px",
      }}
    >
      {tracks.map((trackRef) => (
        <div
          key={trackRef.participant.identity}
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {trackRef.publication && (
            <video
              ref={(el) => {
                if (el && trackRef.publication?.track) {
                  trackRef.publication.track.attach(el);
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              autoPlay
              playsInline
            />
          )}
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              color: "white",
              fontSize: "12px",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {trackRef.participant.identity}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomContent />
    </Suspense>
  );
}
