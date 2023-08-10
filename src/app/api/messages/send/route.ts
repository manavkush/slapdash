import { authOptions } from '@/src/lib/auth';
import { pusherSendMessage } from '@/src/lib/pusher';
import { addMessageToDb } from '@/src/utils/dbUtils';
import { TypeAddMessageToDb, TypeSession } from '@/src/utils/types';
import { getServerSession } from 'next-auth/next';
import { NextResponse, NextRequest } from 'next/server'

const addMessage = async (req: Request, res: Response) => {
    const session: TypeSession|null = await getServerSession(authOptions)
    console.log("Session: ", session)

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
        const response = await addMessageToDb(messageObject,uid)

        const {status, data, message} = response
        if (!status) {
            throw Error(response.message)
        }
        // TODO: Needs testing
        pusherSendMessage(messageObject.channelId, response.data.message)

    } catch(error: any) {
        console.log("Error:", error);
    }
 }

 export { addMessage as POST }