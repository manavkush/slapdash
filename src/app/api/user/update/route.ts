import { authOptions } from "@/src/lib/auth";
import { updateUserInfoInDB } from "@/src/utils/dbUtils";
import { TypeSession, TypeUpdateUserRequest, TypeUtilResponse } from "@/src/utils/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { title } from "process";

async function updateUser (req: Request) {
    const session: TypeSession|null = await getServerSession(authOptions)
    
    if(!session) {
      // Not signedIn
      return NextResponse.json({
          message: {
              error: "Authorization Error: Client not authorized to access api route."
          }
      }, {status: 401})
    }
    try {
        const uid = session.user.id
        const newUserData: TypeUpdateUserRequest = await req.json();
    
        const updateUserInfo = updateUserInfoInDB(newUserData, uid)
        // TODO : Add the different response for the case where the query returns false state
        
        return NextResponse.json(updateUserInfo, { status: 201 });
    } catch(error: any) {
        console.error("Unable to update user. Error: ", error)
        return NextResponse.json({
            status: 501
        })
    } 
}

export {updateUser as POST}