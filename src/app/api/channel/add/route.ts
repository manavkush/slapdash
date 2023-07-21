import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from "next/server";
import { TypeAddChannelUserRequest, TypeSession, ADMIN_PERMISSION } from "@/src/utils/types";
import { addUserChannelConfigToDB, createNewChannelInDB } from "@/src/utils/dbUtils";

const addUser = async (req: Request, res: Response) => {

    const session: TypeSession|null = await getServerSession(authOptions)
    console.log("Session: ", session)

    if(!session) {
        // Not signedIn
        return NextResponse.json({
            status: 401,
            message: {
                error: "Authorization Error: Client not authorized to access api route."
            }
        })
    }
    
    const channelSettings:TypeAddChannelUserRequest = await req.json()
    const {channelName, users} = channelSettings

    try {
        // Create channel
        const {status, channelId, message} = await createNewChannelInDB(channelName)
        
        if (status && channelId) {
            /* 
                * Channel creation done
                * Now adding the users to the channel left
            */

            const uid = session.user.id
            addUserChannelConfigToDB({channelId: channelId!, uid: uid, permission: ADMIN_PERMISSION})
            
            users?.forEach(({permission, uid}) => {
                addUserChannelConfigToDB({channelId: channelId!, uid: uid, permission: permission})
            });
        }
        
    } catch (error: any) {
        console.log("ERROR:", error)
    }
}

export {addUser as GET, addUser as POST}