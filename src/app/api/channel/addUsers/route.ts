import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { TypeAddChannelUserRequest, TypeSession, channelPermissions } from "@/src/types/types";
import { setUserRoleInDB, createNewChannelInDB, getUserRoleFromDB } from "@/src/utils/dbUtils";

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

    const {channelId, users} = await req.json();
    const userRole = await getUserRoleFromDB(session.user.id, channelId);
    
    // Check if user is admin (Only admins are allowed to add users)
    if (userRole != channelPermissions.ADMIN_PERMISSION) {
        return NextResponse.json({
            message: {
                error: "Authorization Error: Client not authorized to access api route."
            }
        }, {status: 401})
    }

    try {
        // set the role for the list of users
        users.forEach(async (uidAndPermission: {uid: string, permission: channelPermissions})=> {
            const {uid, permission} = uidAndPermission
            const {status, data, message} = await setUserRoleInDB({channelId: channelId, uid: uid, permission: permission })
            if (!status) {
                return NextResponse.json({
                    message: {
                        error: "Unable to add user to channel."
                    }
                })
            } 
        });
        return NextResponse.json({
            message: "Added users to Channel in DB",
        }, {status: 200})
    } catch (error: any) {
        console.error("Unable to add users to channel", error)
        return NextResponse.json({
            message: "Error in adding users to channel"
        }, {status: 500})
    }
}

export {addChannel as POST}