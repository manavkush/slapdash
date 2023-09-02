import PusherServer from "pusher";
import PusherClient from "pusher-js"
import { MESSAGE_EVENT } from "./stringConstants";
import { Message } from "@prisma/client";

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
})

// PusherClient.logToConsole = true;

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    userAuthentication: {
        endpoint: "/api/pusher/user-auth",
        transport: "ajax"
    },
    channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax"
    }
})
// cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!

export const pusherSendMessage = async (channelId: string, message: Message) => {
    const pusherSendMessageResponse = await pusherServer.trigger(channelId, MESSAGE_EVENT, {
        message
    })
    return pusherSendMessageResponse
}
