import { Liveblocks } from "@liveblocks/node";
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: "sk_dev_GrAsvWxSKaQ34ljizUiTOSKMsffPbumd6391q8qiTlOHqU0V8rQZ-ZXQf6Fykrva",
});

export async function POST(request) {
  // Create a session for the current user
  const session = liveblocks.prepareSession(
    "user-" + Math.random().toString(36).substr(2, 9),
    {
      userInfo: {
        name: "Anonymous" + Math.floor(Math.random() * 100),
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
      },
    }
  );

  // Give access to the room
  const { room } = await request.json();
  session.allow(room, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new NextResponse(body, { status });
} 