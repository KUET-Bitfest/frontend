"use client"
import { AgoraVideoPlayer } from "agora-rtc-react";

export default function VideoPlayer(props) {
  const { users, tracks } = props;

  return (
    <div className="flex gap-4 w-full justify-center px-4">
      <div className="w-3/4 max-w-4xl">
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          className="h-[600px] rounded-lg"
        />
      </div>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <div key={user.uid} className="w-3/4 max-w-4xl">
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  className="h-[600px] rounded-lg"
                />
              </div>
            );
          } else return null;
        })}
    </div>
  );
}