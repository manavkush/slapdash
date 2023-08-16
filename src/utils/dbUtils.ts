import { Channel, Message, PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { profile } from "console";
import {
    TypeAddMessageToDb,
    TypeAddUserChannelConfigToDB,
    TypeDBUtilResponse,
    TypeInsertUserInDBResponse,
    TypeRegisterOrUpdateUserRequest,
    TypeUpdateUserRequest,
    TypeUtilResponse,
} from "../types/types";

const prisma = new PrismaClient();


export async function authenticateUser(username: string, password: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                userName: username,
            },
        });
    
        if (!user) {
            return null;
        }
    
        const isPasswordCorrect = await compare(password, user.password);
    
        if (isPasswordCorrect) {
            return {
                id: user.uid,
                username: user.userName,
                name: user.name,
                bio: user.bio,
                profilePic: user.profilePic,
            };
        }
        return null;
    } catch (error) {
        console.error("Unable to authenticateUser. Error:", error)
    }
    return null;
}

// TODO: Make this return object instead of boolean
export const checkUsernamePresentInDB = async (
    username: string
): Promise<boolean> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                userName: username,
            },
        });
    
        return !!user;
    } catch(error) {
        console.error("Unable to check username present in DB. Error:", error);
    }
    return false;
};


export const getUserInfoFromDB = async (username: string):Promise<User|null> => {
    let res = null
    try {
        const user = await prisma.user.findFirst({
            where: {
                userName: username,
            },
        });
        if (user === null) {
            return null;
        } else {
            return user;
        }
    } catch (error: any) {
        console.error("Unable to get user info from DB. error:", error)
    }
    return res;
};


export const insertUserInDB = async (
    user: TypeRegisterOrUpdateUserRequest
): Promise<TypeDBUtilResponse> => {
    let res: TypeDBUtilResponse;
    try {
        const password = await hash(user.password, 12);
        await prisma.user.create({
            data: {
                name: user.name,
                profilePic: "",
                userName: user.username,
                bio: "",
                password: password,
            },
        });
        res = {
            status: true,
            message: "Inserted user into DB.",
        };
    } catch (error: any) {
        console.error("ERROR: Error in inserting user to DB.", error)
        res = {
            status: false,
            message: "Insert Failed. " + error.message,
        };
    }

    return res;
};


export const updateUserInfoInDB =async (newUserData:TypeUpdateUserRequest, uid: string):Promise<TypeUtilResponse> => {
    
    try {
        const isUsernameChanged = newUserData.userName
        if (isUsernameChanged) {
            const isNewUsernameAvailable = await checkUsernamePresentInDB(newUserData.userName!)
            if (!isNewUsernameAvailable) {
                console.error("ERROR: Cannot update the username as new username is already present")
                return {
                    status: 401,
                    message: "Username already present"
                }
            }
        }

        const updatedUser = await prisma.user.update({
            where: {
                uid: uid
            },
            data: {
                ...newUserData
            }
        })
        return {
            status: 200,
            message: "User info updated successfully",
            data: {
                user: updatedUser
            }
        }
    } catch (error) {
        console.error("ERROR: Error in updating userinfo.", error)
        return {
            status: 501,
            message: "Error in updating userinfo"
        }
    }
}


export const createNewChannelInDB = async (
    channelName: string
): Promise<TypeDBUtilResponse> => {
    let res: TypeDBUtilResponse;
    try {
        const newChannel: Channel = await prisma.channel.create({
            data: {
                channelName: channelName,
            },
        });
        res = {
            status: true,
            message: "Channel created successfully",
            data: {
                channelId: newChannel.id,
                channelName: newChannel.channelName,
            }
        };
    } catch (error: any) {
        res = {
            status: false,
            message: "Channel creation failed: " + error.message,
        };
    }
    return res;
};


// export const createNewChannelInDB2 = async (
//     channelName: string
// ): Promise<TypeAddChannelResponse> => {
//     let res: TypeAddChannelResponse;
//     try {
//         const newChannel: Channel = await prisma.channel.create({
//             data: {
//                 channelName: channelName,
//             },
//         });
//         res = {
//             status: true,
//             message: "Channel created successfully",
//             channelId: newChannel.id,
//             channelName: newChannel.channelName,
//         };
//     } catch (error: any) {
//         res = {
//             status: false,
//             message: "Channel creation failed: " + error.message,
//         };
//     }
//     return res;
// };


export const addUserChannelConfigToDB = async ({
    uid,
    channelId,
    permission,
}: TypeAddUserChannelConfigToDB): Promise<TypeDBUtilResponse> => {
    let res: TypeDBUtilResponse;
    try {
        const channelUserConfig = await prisma.channelUserConfig.upsert({
            create: {
                uid: uid,
                channelId: channelId,
                permission: permission,
            },
            where: {
                channelId_uid: {
                    channelId: channelId,
                    uid: uid,
                },
            },
            update: {
                permission: permission,
            },
        });
        res = {
            status: true,
            message: "channelUserConfig inserted to DB",
        };
    } catch (error: any) {
        res = {
            status: false,
            message: error.message,
        };
    }
    return res;
};


export const addMessageToDb = async (message: TypeAddMessageToDb, uid: string): Promise<TypeDBUtilResponse> => {
    let res: TypeDBUtilResponse;
    try{
        const addMessage = await prisma.message.create({
            data:{
                text: message.text,
                channelId: message.channelId,
                fromUserId: uid
            }
        })
        res = {
            status: true,
            message: "Message inserted to DB",
            data: {
                message: addMessage
            }
        };
    } catch (error: any){
        res = {
            status: false,
            message: error.message,
        };
    }
    return res;
}