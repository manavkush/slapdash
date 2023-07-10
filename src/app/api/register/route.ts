import {insertUserInDB, checkUsernamePresentInDB} from "@/src/utils/dbUtils";
import {
    TypeRegisterOrUpdateUserRequest,
    TypeInsertUserInDBResponse,
    TypeRegisterOrUpdateUserResponse
} from "@/src/utils/types";
import {NextResponse} from "next/server";

const register = async (req: Request) => {

    const user:TypeRegisterOrUpdateUserRequest = await req.json()
    const {username} = user

    const usernamePresent = await checkUsernamePresentInDB(user.username)

    if (!usernamePresent) {
        let res: TypeInsertUserInDBResponse;
        res = await insertUserInDB(user);
        return NextResponse.json(res);
    } else {
        return NextResponse.json({
            status: true,
            message: {
                error: "Cannot create new user. Username already present."
            }
        })
    }
}

export {register as POST}