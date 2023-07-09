interface ChannelUserConfig {
    channelId: string;
    uid: string;
    permission: string;
    lastSeenTimeStamp: Date;
}

export interface FilteredUser {
    uid: string;
    name: string;
    username: string;
    config: ChannelUserConfig[]
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

export interface TypeRegisterOrUpdateUserRequest {
    username: string;
    name: string;
    password: string;
    bio?: string;
    profilePic?: string;
}

export interface TypeRegisterOrUpdateUserResponse {
    status: boolean,
    message?: {
        error?: string
    }
}

export interface TypeInsertUserInDBResponse {
    status: boolean,
    message?: string
}

export interface TypeCheckUsernamePresentResponse {
    isUsernamePresent: boolean,
    message?: string
}