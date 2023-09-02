import { pusherServer } from "@/src/lib/pusher";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const userAuth = async (req: Request) => {

  const session = await getServerSession();
  // @ts-ignore
  const socketId = req.body?.socket_id;
  // @ts-ignore
  const channel = req.body?.channel_name;
  const uid = session?.user.id!;
  const userData = {
    id: uid,
    name: session?.user.name,
  };
  const authUser = pusherServer.authenticateUser(socketId, userData);

  return NextResponse.json(authUser)
}

export {userAuth as POST}
