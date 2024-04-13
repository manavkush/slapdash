import { authOptions } from "@/src/lib/auth";
import { pusherSendMessage } from "@/src/lib/pusher";
import { addMessageToDb } from "@/src/utils/dbUtils";
import { Message } from "@prisma/client";
import { TypeAddMessageToDb, TypeSession } from "@/src/types/types";
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { randomUUID } from "crypto";

const sendMessage = async (req: Request) => {
  const session: TypeSession | null = await getServerSession(authOptions);

  if (!session) {
    // Not signedIn
    return NextResponse.json(
      {
        message: {
          error:
            "Authorization Error: Client not authorized to access api route.",
        },
      },
      { status: 401 },
    );
  }

  try {
    const uid = session.user.id;
    const messageObject: TypeAddMessageToDb = await req.json();

    const pusherMessage: Message = {
      id: randomUUID(),
      channelId: messageObject.channelId,
      text: messageObject.text,
      fromUserId: uid,
      creationTimestamp: new Date(),
    };

    const pusherSendMessageResponse = await pusherSendMessage(
      messageObject.channelId,
      pusherMessage,
      { id: session.user.id, name: session.user.name! },
    );
    console.log("INFO: PUSHER SEND MESSAGE RESPONSE RECEIVED.");
    const response = await addMessageToDb(messageObject, uid);

    console.log("INFO: addMessageToDb Response: ", response.data?.message);

    const { status } = response;
    if (!status) {
      throw Error(response.message);
    }
    try {
      if (pusherSendMessageResponse.ok) {
        return NextResponse.json(
          {
            message: "S en Message Request Completed",
          },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          message: "Failed in Sending Message Requ est.",
        },
        { status: pusherSendMessageResponse.status },
      );
    } catch (error: any) {
      throw error;
    }
  } catch (error: any) {
    console.log("Error:", error);
    return NextResponse.json(
      {
        message: "E rror in Send Message. Error: " + error,
      },
      { status: 500 },
    );
  }
};

export { sendMessage as POST };
