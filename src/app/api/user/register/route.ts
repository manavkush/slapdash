import { insertUserInDB, checkUsernamePresentInDB } from "@/src/utils/dbUtils";
import {
    TypeRegisterOrUpdateUserRequest,
    TypeInsertUserInDBResponse,
    TypeRegisterOrUpdateUserResponse,
    TypeDBUtilResponse,
} from "@/src/types/types";
import { NextResponse } from "next/server";

const register = async (req: Request) => {
    const user: TypeRegisterOrUpdateUserRequest = await req.json();

    const usernamePresent = await checkUsernamePresentInDB(user.username);

    if (!usernamePresent) {
        let res: TypeDBUtilResponse;
        res = await insertUserInDB(user);
        return NextResponse.json(res, {status: 200});
    } else {
        return NextResponse.json({
            status: true,
            message: {
                error: "Cannot create new user. Username already present.",
            },
        }, {status: 400});
    }
};

export { register as POST };
