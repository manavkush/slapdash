import {insertUserInDB} from "@/src/utils/dbUtils";
import {TypeRegisterOrUpdateUserRequest, TypeInsertUserInDBResponse} from "@/src/utils/types";
import {NextResponse} from "next/server";

const register = async (user: TypeRegisterOrUpdateUserRequest) => {
    let res: TypeInsertUserInDBResponse;
    res = await insertUserInDB(user);
    return NextResponse.json(res);
}

export {register as POST}