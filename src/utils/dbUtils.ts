import { Channel, PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { profile } from "console";
import { TypeAddChannelRequest, TypeAddChannelResponse, TypeInsertUserInDBResponse, TypeRegisterOrUpdateUserRequest } from "./types";

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
export const checkUsernamePresentInDB = async (username: string): Promise<boolean> => {

    const user = await prisma.user.findFirst({
        where: {
            userName: username
        }
    })

    return !!user;
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


export const insertUserInDB = async (user: TypeRegisterOrUpdateUserRequest):Promise<TypeInsertUserInDBResponse> => {
    
    let res: TypeInsertUserInDBResponse
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
    } catch(error:any) {
        res = {
            status: false,
            message: "Insert Failed. " + error.message,
        }
    }

    return res
}

export const createNewChannelInDB = async (channel:TypeAddChannelRequest): Promise<TypeAddChannelResponse> => {
    let res: TypeAddChannelResponse
    try{
        const newChannel: Channel = await prisma.channel.create({
            data: {
                channelName: channel.channelName
            }
        })
        res = {
            status: true,
            message: "Channel created successfully",
            channelId: newChannel.id,
            channelName: newChannel.channelName
        }
    } catch(error:any){
        res={
            status:false,
            message: "Channel creation failed: " + error.message
        }
    }
    return res
}

interface TypeAddUserChannelConfigToDB {
    uid: string,
    channelId: string,
    permission: string,
}
export const addUserChannelConfigToDB = async ({uid, channelId, permission} : TypeAddUserChannelConfigToDB) => {
    try {
        const channelUserConfig = await prisma.channelUserConfig.upsert({
            create: {
                uid: uid,
                channelId: channelId,
                permission: permission
            },
            update: {

            },
            where: {
                uid: uid,
                channelId: channelId
            }
        })
        
    } catch (error: any) {
        
    }
}