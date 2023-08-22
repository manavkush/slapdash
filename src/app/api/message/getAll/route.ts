import { authOptions } from '@/src/lib/auth';
import { pusherSendMessage } from '@/src/lib/pusher';
import { addMessageToDb, getMessageForChannel, getUserRoleFromDB } from '@/src/utils/dbUtils';
import { TypeAddMessageToDb, TypeSession } from '@/src/types/types';
import { getServerSession } from 'next-auth/next';
import { NextResponse, NextRequest } from 'next/server'
import { Message } from '@prisma/client';

const getAllMessages = async (req: Request) => {
    console.info("Request recieved at /api/message/getAll")
    const session: TypeSession|null = await getServerSession(authOptions)

    if(!session) {
        // Not signedIn
        return NextResponse.json({
            message: {
                error: "Authorization Error: Client not authenticated."
            }
        }, {status: 401})
    }
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get("channelId")
    console.log(channelId)
    
    // check if the user is allowed to access the channel
    
    try {
        const uid = session.user.id;
        let channelMessages:Message[] = []
        if(getUserRoleFromDB(uid, channelId!) != null){
            channelMessages = await getMessageForChannel(channelId!);
        } else{
            console.error("Error user unauthorized");
            return NextResponse.json({
                message: {
                    error: "Authorization Error: Client not authorized to access api route."
                }
            }, {status: 401})
        }
        return NextResponse.json({
            message: "Fetched message from Channel in DB",
            data: {
                channelMessages
            }
        }, {status: 200});
    } catch(error: any) {
        console.error("Error in getting all messages:", error);
    }
    return null;
 }

 export { getAllMessages as GET }