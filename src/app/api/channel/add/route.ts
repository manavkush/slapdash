import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { decode, getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from "next/server";
import { TypeAddChannelUserRequest } from "@/src/utils/types";
import { addUserChannelConfigToDB, createNewChannelInDB } from "@/src/utils/dbUtils";

const addUser = async (req: Request, res: Response) => {
    // console.log(authOptions)
    const session = await getServerSession(authOptions)
    
    // const sessionToken = req.cookies['next-auth.session-token'];
    const sessionToken = req.headers.get('next-auth.session-token')
    console.log(sessionToken)

    const decoded = await decode({
        token: sessionToken!,
        secret: process.env.NEXTAUTH_SECRET!,
    });
    console.log(decoded)

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

    // const token = await getToken({ req, secret:process.env.NEXTAUTH_SECRET })
    // console.log(token)

    try {
        const createNewChannelInDBRequestResponse = await createNewChannelInDB(channelSettings.channelName)

    } catch (error) {
        
    }
    //createChannel call
    //addUserToChannel call
}

export {addUser as GET, addUser as POST}