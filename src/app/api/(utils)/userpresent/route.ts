import {checkUsernamePresentInDB} from "@/src/utils/dbUtils"
import {NextResponse} from "next/server";

export async function POST(req:Request) {
    console.log("INFO: userpresent route called")

    const {username} = await req.json()
    const userPresent = await checkUsernamePresentInDB(username)
    const returnJSON = {
        isUserPresent: userPresent
    }
    return NextResponse.json({
        isUsernamePresent: userPresent
    })
}
