import { authOptions } from "@/src/lib/auth";
import { checkUsernamePresentInDB, updateUserInfoInDB } from "@/src/utils/dbUtils";
import { TypeSession, TypeUpdateUserRequest } from "@/src/utils/types";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { title } from "process";

export async function POST(req: Request) {
    // TODO: Add update user info logic
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

    const updatedUser = updateUserInfoInDB(newUserData, uid)
    
    return NextResponse.json(updatedUser, { status: 201 });
}
