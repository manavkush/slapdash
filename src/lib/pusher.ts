import PusherServer from "pusher";
import PusherClient from "pusher-js"
import { MESSAGE_EVENT } from "./stringConstants";
import { Message } from "@prisma/client";

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.cluster!,
    useTLS: true
})

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.cluster!
})

export const pusherSendMessage = (channelId: string, message: Message) => {
    pusherServer.trigger(channelId, MESSAGE_EVENT, {

    })
}