"use client"
import { Channel, User } from '@prisma/client';
import React, { useState } from 'react';
import { createContext } from 'react';

type userDataType = {
    name: string,
    id: string
}
type channelDataType = {
    id: string,
    channelName: string
}

interface GlobalContextProps {
    user: userDataType | null,
    channel: Channel | null,
    setUser: (user: userDataType | null) => void,
    setChannel: (channel: channelDataType | null) => void
}

export const GlobalContext = createContext<GlobalContextProps>({
    user: null,
    channel: null,
    setUser: () => {},
    setChannel: () => {}
})

export const GlobalContextProvider = (props: {children: React.ReactNode}) => {
    const [user, setUser] = useState<null | userDataType>(null)
    const [channel, setChannel] = useState<null | channelDataType>({
        id: "fc340e14-372b-11ee-be56-0242ac120002",
        channelName: "test channel"
    })

    return <GlobalContext.Provider value={{
        user: user,
        channel: channel,
        setUser: setUser,
        setChannel: setChannel
    }}>
        {props.children}
    </GlobalContext.Provider>
}
