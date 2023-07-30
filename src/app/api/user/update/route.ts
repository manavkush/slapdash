import { authOptions } from "@/src/lib/auth";
import { checkUsernamePresentInDB, updateUserInfoInDB } from "@/src/utils/dbUtils";
import { TypeSession, TypeUpdateUserRequest, TypeUtilResponse } from "@/src/utils/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { title } from "process";

async function updateUser(req: Request) {
    const session: TypeSession|null = await getServerSession(authOptions)
    
    if(!session) {
      // Not signedIn
      return NextResponse.json({
          status: 401,
          message: {
              error: "Authorization Error: Client not authorized to access api route."
          }
      }, {status: 401})
    }
    const uid = session.user.id
    const newUserData: TypeUpdateUserRequest = await req.json();

    const updateUserInfo = updateUserInfoInDB(newUserData, uid)
    
    return NextResponse.json(updateUserInfo, { status: 201 });
}

export {updateUser as POST}
