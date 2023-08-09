import { authOptions } from '@/src/lib/auth';
import { addMessageToDb } from '@/src/utils/dbUtils';
import { TypeSession } from '@/src/utils/types';
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
        const message = await req.json()
        const response = await addMessageToDb(message,uid)
        //TODO: add publish to channel

    } catch(error: any) {
        console.log("Error:", error);
    }
 }

 export { addMessage as POST }