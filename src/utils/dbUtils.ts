import { PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { profile } from "console";
import { RegisterOrUpdateUserRequestType } from "./types";

const prisma = new PrismaClient();

// TODO: Add a return type for the function
export async function authenticateUser(username: string, password: string) {
    const user = await prisma.user.findFirst({
        where: {
            userName: username,
        },
    })

    if (!user) {
        return null;
    }

    const isPasswordCorrect = await compare(password, user.password)

    if (isPasswordCorrect) {
        return {
            id: user.uid,
            username: user.userName,
            name: user.name,
            bio: user.bio,
            profilePic: user.profilePic
        }
    }
    return null
}


// TODO: signup username availability
export const checkUserPresentInDB = async (username: string): Promise<boolean> => {
    const user = await prisma.user.findFirst({
        where: {
            userName: username
        }
    })
    if (user === null) {
        return false;
    } else {
        return true;
    }
}

// TODO: Add return type for the function
export const getUserInfoFromDB = async (username: string) => {
    const user = await prisma.user.findFirst({
        where: {
            userName: username
        }
    })
    if (user === null) {
        return null;
    } else {
        return user;
    }
}


interface TypeInsertUserInDB {
    status: boolean,
    message: string
}
// TODO: Add the type to the parameter instead of the user as 
// no id will be passed at the time of creating of the user 
// from the server
export const insertUserInDB = async (user: RegisterOrUpdateUserRequestType) => {
    
    let res: TypeInsertUserInDB
    try {
        const password = await hash(user.password, 12)
        await prisma.user.create({
            data: {
                name: user.name,
                profilePic: "",
                userName: user.username,
                bio: "",
                password: password
            }
        })
        res = {
            status: true,
            message: "Inserted user into DB."
        }
    } catch(e:any) {
        res = {
            status: false,
            message: "Insert Failed. " + e.message,
        }
    }

    

    
    return res
}
