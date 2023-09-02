import { pusherClient, pusherServer } from "@/src/lib/pusher";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const route = async(req: Request) => {

  const session = await getServerSession();
  // @ts-ignore
  const socketId = req.body?.socket_id;
  // @ts-ignore
  const channel = req.body?.channel_name;
  const uid = session?.user.id!;
  const presenceData = {
    user_id: uid,
    name: session?.user.name,
  };
  const auth = pusherServer.authorizeChannel(socketId, channel, presenceData);
  return NextResponse.json(auth);
}

export {route as POST}
