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

export interface UserResponse {
    status: string;
    data: {
        user: FilteredUser;
    };
}

export interface UserLoginResponse {
    status: string;
    token: string;
}

export interface RegisterOrUpdateUserRequestType {
    username: string;
    name: string;
    password: string;
    bio?: string;
    profilePic?: string;
}