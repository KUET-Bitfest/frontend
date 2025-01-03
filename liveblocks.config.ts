import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_dev_zvxQ7wkHbZ1euy0E2r8GWhYDYvt-iKZXQeja0KRgPAYFg-7KaADcbenlbnCfq4vB",
});

export const { RoomProvider, useRoom, useMyPresence, useUpdateMyPresence } = createRoomContext(client); 