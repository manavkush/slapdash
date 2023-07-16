import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { TypeAddChannelUserRequest } from "@/src/utils/types";

const addUser = async (req: Request, res: Response) => {
    const session = await getServerSession(authOptions)

    if(!session) {
        return NextResponse.json({
            status: 401,
            message: {
                error: "Authorization Error: Client not authorized to access api route."
            }
        })
    }
    // now the client is logged in

    const channelSettings:TypeAddChannelUserRequest = await req.json()
    //createChannel call
    //addUserToChannel call
}