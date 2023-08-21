import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { TypeAddChannelUserRequest, TypeSession, channelPermissions } from "@/src/types/types";
import { setUserRoleInDB, createNewChannelInDB } from "@/src/utils/dbUtils";

const addChannel = async (req: Request, res: Response) => {

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

    // TODO: Checking if the user is an admin ( to check if he can add someone)
    const {channelId} = await req.json();
    isUserAdmin(session.user.id, channelId)



    const channelSettings:TypeAddChannelUserRequest = await req.json()
    const {channelName, users} = channelSettings

    try {
        const {status, data, message} = await createNewChannelInDB(channelName)
        const channelId = data.channelId
        
        if (status && channelId) {
            const uid = session.user.id
            setUserRoleInDB({channelId: channelId!, uid: uid, permission: channelPermissions.ADMIN_PERMISSION})
            
            users?.forEach(({permission, uid}) => {
                setUserRoleInDB({channelId: channelId!, uid: uid, permission: permission})
            });
            
            return NextResponse.json({
                message: "Created New Channel In DB"
            }, {status: 200})
        }

        return NextResponse.json({
            message: message
        }, {status: 400})

    } catch (error: any) {
        console.error("Unable to create new channel in DB. Error:", error)
        return NextResponse.json({
            message: "Error in creating new channel"
        }, {status: 500})
    }
}

export {addChannel as POST}