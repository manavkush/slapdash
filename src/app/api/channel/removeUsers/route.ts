import { NextRequest, NextResponse } from "next/server";
import {TypeSession, channelPermissions} from "@/src/types/types"
import { getUserRoleFromDB } from "@/src/utils/dbUtils";
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth/next";
const removeUsers = async (req:NextRequest) => {
  
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
}

export {removeUsers as POST}
