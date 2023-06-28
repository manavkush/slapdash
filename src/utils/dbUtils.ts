import { PrismaClient, User, Channel, ChannelConfig } from "@prisma/client";
import {hash} from "bcrypt";

const prisma = new PrismaClient();

interface TypeCheckUserPresentInDB {
    isAuthenticated : boolean,
    message: string,
    data: object|null
}
export async function authenticateUser(username: string, password: string){
    const passwordHashed = await hash(password,12);
    const user = await prisma.user.findFirst({
        where : {
            userName : username,
            password: passwordHashed
        },
    })
    
    let res:TypeCheckUserPresentInDB
    if(user !== null) {
        res = {
            isAuthenticated: true,
            message: "User authenticated",
            data: {
                uid: user.uid
            }
        }
        return res;
    }else{
        res = {
            isAuthenticated: false,
            message: "Invalid user",
            data: null
        }
        return res;
    }
}


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


interface TypeInsertUserInDB {
    inserted : boolean,
    message: string
}
export const insertUserInDB = async (user: User) => {
    const userPresent = await checkUserPresentInDB(user.userName)
    let res: TypeInsertUserInDB
    if (userPresent) {
        res = {
            inserted: false,
            message: "Insert Failed. Username not available"
        }
        return res
    }
    
    const password = hash(user.password, 12)
    // TODO: Need to add functionality to insert user in the DB

    await prisma.user.upsert({
        create: {
            uid: user.uid,
            userName: user.userName,
            password: user.password,
            bio: user.bio,
            profilePic: user.profilePic,
            channelId: [],
            channels: new Channel(),
            channelConfig: new ChannelConfig()
        },
        where: {
            uid: undefined,
            userName: undefined
        },
        update: {}
    })

    res = {
        inserted: true,
        message: "Inserted user into DB."
    }
    return res
}
