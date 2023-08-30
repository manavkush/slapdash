import { authOptions } from '@/src/lib/auth';
import { pusherSendMessage } from '@/src/lib/pusher';
import { addMessageToDb } from '@/src/utils/dbUtils';
import { TypeAddMessageToDb, TypeSession } from '@/src/types/types';
import { getServerSession } from 'next-auth/next';
import { NextResponse, NextRequest } from 'next/server'

const addMessage = async (req: Request) => {
    console.log("Add message request recieved")
    const session: TypeSession|null = await getServerSession(authOptions)

    if(!session) {
        // Not signedIn
        return NextResponse.json({
            message: {
                error: "Authorization Error: Client not authorized to access api route."
            }
        }, {status: 401})
    }
    
    try {
        const uid = session.user.id;
        const messageObject:TypeAddMessageToDb = await req.json()
        console.log("INFO: Message Object:", messageObject)

        const response = await addMessageToDb(messageObject,uid)

        console.log("INFO: addMessageToDb Response: ", response.data?.message)

        const {status} = response
        if (!status) {
            throw Error(response.message)
        }
        try {
            const pusherSendMessageResponse = await pusherSendMessage(messageObject.channelId, response.data?.message)
            if (pusherSendMessageResponse.ok) {
                return NextResponse.json({
                    message: "Sent Message Request Completed"
                }, {status: 200}) 
            }
            return NextResponse.json({
                message: "Failed in Sending Message Request.",
            }, {status: pusherSendMessageResponse.status})
        } catch (error: any) {
            throw(error)
        }

    } catch(error: any) {
        console.log("Error:", error);
        return NextResponse.json({
            message: "Error in Send Message. Error: " + error
        }, {status: 500})
    }
}

 export { addMessage as POST }
