import { authOptions } from '@/src/lib/auth';
import { pusherSendMessage } from '@/src/lib/pusher';
import { addMessageToDb } from '@/src/utils/dbUtils';
import { TypeAddMessageToDb, TypeSession } from '@/src/types/types';
import { getServerSession } from 'next-auth/next';
import { NextResponse, NextRequest } from 'next/server'

const addMessage = async (req: Request) => {
    console.info("Request recieved at /api/message/getAll")
    const session: TypeSession|null = await getServerSession(authOptions)

    if(!session) {
        // Not signedIn
        return NextResponse.json({
            message: {
                error: "Authorization Error: Client not authorized to access api route."
            }
        }, {status: 401})
    } 
    // check if the user is allowed to access the channel
    
    try {
        const uid = session.user.id;
        

    } catch(error: any) {
        console.log("Error:", error);
    }
 }

 export { addMessage as GET }