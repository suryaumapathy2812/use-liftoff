"use client";

import {
  ControlBar,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track, RoomEvent } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();

  const sessionId = params.session;
  const username = "candidate";

  console.log("Session ID:", sessionId);

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
      console.log("Interview session ended, redirecting to report...");
      router.push(`/~/interview/${sessionId}/report`);
    };

    const handleParticipantDisconnected = () => {
      // Check if we're the only participant left or interviewer left
      if (roomInstance.numParticipants <= 1) {
        console.log("Interview ended, redirecting to report...");
        router.push(`/~/interview/${sessionId}/report`);
      }
    };

    // Add event listeners
    roomInstance.on(RoomEvent.Disconnected, handleDisconnected);
    roomInstance.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    (async () => {
      try {
        const resp = await fetch(
          `/api/token?room=${sessionId}&username=${username}`
        );
        const data = await resp.json();
        console.log("Interview session connection data:", data);

        if (!mounted) return;
        if (data.participantToken) {
          await roomInstance.connect(data.serverUrl, data.participantToken);
        }
      } catch (e) {
        console.error("Failed to connect to interview session:", e);
        // Redirect to report on connection failure
        router.push(`/interview/${sessionId}/report`);
      }
    })();

    return () => {
      mounted = false;
      // Remove event listeners
      roomInstance.off(RoomEvent.Disconnected, handleDisconnected);
      roomInstance.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
      roomInstance.disconnect();
    };
  }, [sessionId, roomInstance, router]);

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: "100dvh" }}>
        {/* Interview Session Header */}
        <div style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px"
        }}>
          Interview Session: {sessionId?.toString().slice(0, 8)}...
        </div>
        
        {/* End Session Button */}
        <button
          onClick={() => {
            roomInstance.disconnect();
            router.push(`/interview/${sessionId}/report`);
          }}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            backgroundColor: "#dc2626",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          End Interview
        </button>

        {/* Interview Video Conference */}
        <InterviewVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function InterviewVideoConference() {
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
            {trackRef.participant.identity === "candidate" ? "You" : trackRef.participant.identity}
          </div>
        </div>
      ))}
    </div>
  );
}