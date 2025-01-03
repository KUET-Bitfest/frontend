import { useState } from "react";
import { useClient } from "./AgoraSettings";
import { BsMic, BsMicMute, BsCameraVideoOff, BsCameraVideo } from 'react-icons/bs'
import { RxExit } from 'react-icons/rx'
import { useRouter } from "next/navigation";
import { Button } from "../ui/components/button";


export default function VideoControls(props) {
  const router = useRouter()
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    router.back()
  };

  return (
    <div className="flex w-full space-x-4 justify-center items-center">
      <div className="">
        <Button
          color={trackState.audio ? "primary" : "secondary"}
          onClick={() => mute("audio") }
        >
          {trackState.audio ? <BsMic /> : <BsMicMute />}
        </Button>
      </div>
      <div>
        <Button
          color={trackState.video ? "primary" : "secondary"}
          onClick={() => mute("video")}
        >
          {trackState.video ? <BsCameraVideo /> : <BsCameraVideoOff />}
        </Button>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          onClick={() => leaveChannel()}
        >
          Leave
          <RxExit />
        </Button>
      </div>
    </div>
  );
}