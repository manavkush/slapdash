import { Channel, PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { profile } from "console";
import {
    TypeAddChannelResponse,
    TypeInsertUserInDBResponse,
    TypeRegisterOrUpdateUserRequest,
    TypeUpdateUserRequest,
} from "./types";

const prisma = new PrismaClient();

// TODO: Add a return type for the function
export async function authenticateUser(username: string, password: string) {
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
}

export const checkUsernamePresentInDB = async (
    username: string
): Promise<boolean> => {
    const user = await prisma.user.findFirst({
        where: {
            userName: username,
        },
    });

    return !!user;
};


export const getUserInfoFromDB = async (username: string):Promise<User|null> => {
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
};


export const insertUserInDB = async (
    user: TypeRegisterOrUpdateUserRequest
): Promise<TypeInsertUserInDBResponse> => {
    let res: TypeInsertUserInDBResponse;
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
        res = {
            status: false,
            message: "Insert Failed. " + error.message,
        };
    }

    return res;
};


export const updateUserInfoInDB =async (updatedUser:TypeUpdateUserRequest, uid: string) => {
    // TODO: check if the user needs to update the username, if yes, check if new username available
    
    // TODO: Make prisma call to update
}


export const createNewChannelInDB = async (
    channelName: string
): Promise<TypeAddChannelResponse> => {
    let res: TypeAddChannelResponse;
    try {
        const newChannel: Channel = await prisma.channel.create({
            data: {
                channelName: channelName,
            },
        });
        res = {
            status: true,
            message: "Channel created successfully",
            channelId: newChannel.id,
            channelName: newChannel.channelName,
        };
    } catch (error: any) {
        res = {
            status: false,
            message: "Channel creation failed: " + error.message,
        };
    }
    return res;
};

interface TypeAddUserChannelConfigToDB {
    uid: string;
    channelId: string;
    permission: string;
}

interface TypeAddUserChannelConfigToDBResponse {
    status: boolean;
    message: string;
}
export const addUserChannelConfigToDB = async ({
    uid,
    channelId,
    permission,
}: TypeAddUserChannelConfigToDB): Promise<TypeAddUserChannelConfigToDBResponse> => {
    let res: TypeAddUserChannelConfigToDBResponse;
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
