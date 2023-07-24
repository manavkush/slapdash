import { DefaultSession } from "next-auth";
import { User, ChannelUserConfig } from "@prisma/client";

export const ADMIN_PERMISSION = "admin";
export const READ_ONLY_PERMISSION = "read-only";
export const READ_WRITE_PERMISSION = "read-write";


// interface ChannelUserConfig2 {
//     channelId: string;
//     uid: string;
//     permission: string;
//     lastSeenTimeStamp: Date;
// }

export interface FilteredUser {
    uid: string;
    name: string;
    username: string;
    config: ChannelUserConfig[];
}

export interface TypeUserResponse {
    status: string;
    data: {
        user: FilteredUser;
    };
}

export interface TypeUserLoginResponse {
    status: string;
    token: string;
}

export type TypeUpdateUserRequest = Partial<Omit<User, "uid">>

export interface TypeRegisterOrUpdateUserRequest {
    username: string;
    name: string;
    password: string;
    bio?: string;
    profilePic?: string;
}

export interface TypeRegisterOrUpdateUserResponse {
    status: boolean;
    message?: {
        error?: string;
    };
}

export interface TypeInsertUserInDBResponse {
    status: boolean;
    message?: string;
}

export interface TypeCheckUsernamePresentResponse {
    isUsernamePresent: boolean;
    message?: string;
}

export interface TypeAddChannelUserRequest {
    channelName: string;
    users?: TypeUidAndChannelPermission[];
}

export interface TypeUidAndChannelPermission {
    uid: string;
    permission:
        | typeof READ_ONLY_PERMISSION
        | typeof READ_WRITE_PERMISSION
        | typeof ADMIN_PERMISSION;
}

export interface TypeAddChannelUserResponse {
    status: boolean;
    message?: string;
    channelId?: string;
    channelName?: string;
}

export interface TypeAddChannelResponse {
    status: boolean;
    message?: string;
    channelId?: string;
    channelName?: string;
}

export type TypeSession = DefaultSession & {
    user: {
        id: string;
    };
};
