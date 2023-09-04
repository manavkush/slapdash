import { authOptions } from "@/src/lib/auth"
import { TypeSession } from "@/src/types/types"
import { getChannelsForUser } from "@/src/utils/dbUtils"
import { Channel } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"

const getAllChannels = async () => {
    const session: TypeSession|null = await getServerSession(authOptions)

    if(!session) {
        // Not signedIn
        return NextResponse.json({
            message: {
                error: "Authorization Error: Client not authenticated."
            }
        }, {status: 401})
    }

    try{
        const uid = session.user.id;
        let userChannels: Channel[] | undefined = [];
        userChannels = await getChannelsForUser(uid);
        return NextResponse.json({
            message: "Fetched channels for user from DB",
            data: {
                userChannels
            }
        }, {status: 200});
    } catch(error: any) {
        console.error("Error in getting all channels:", error);
    }
    return null;
}

export { getAllChannels as GET }