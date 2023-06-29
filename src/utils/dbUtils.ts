import { PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { profile } from "console";

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
export const checkUserPresentInDB = async (username: string) => {
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
export const insertUserInDB = async (user: User) => {
    const userPresent = await checkUserPresentInDB(user.userName)
    
    let res: TypeInsertUserInDB

    if (userPresent) {
        res = {
            status: false,
            message: "Insert Failed. Username not available"
        }
        return res
    }

    const password = await hash(user.password, 12)
    await prisma.user.create({
        data: {
            name: user.name,
            profilePic: user.profilePic,
            userName: user.userName,
            bio: user.bio,
            password: password
        }
    })

    res = {
        status: true,
        message: "Inserted user into DB."
    }
    return res
}
