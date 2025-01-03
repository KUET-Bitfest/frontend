"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loading from "@/components/ui/components/loading";

export function Room({ children }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_zvxQ7wkHbZ1euy0E2r8GWhYDYvt-iKZXQeja0KRgPAYFg-7KaADcbenlbnCfq4vB"}>
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<Loading />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
