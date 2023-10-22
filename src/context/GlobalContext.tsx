"use client"
import { Channel, User } from '@prisma/client';
import React, { useState } from 'react';
import { createContext } from 'react';
import { TypeChannelGlobalContext, TypeUserGlobalContext } from '../types/types';

interface GlobalContextProps {
    user: TypeUserGlobalContext | null,
    channel: Channel | null,
    setUser: (user: TypeUserGlobalContext | null) => void,
    setChannel: (channel: TypeChannelGlobalContext | null) => void
}

export const GlobalContext = createContext<GlobalContextProps>({
    user: null,
    channel: null,
    setUser: () => {},
    setChannel: () => {}
})

export const GlobalContextProvider = (props: {children: React.ReactNode}) => {
    const [user, setUser] = useState<null | TypeUserGlobalContext>(null)
    const [channel, setChannel] = useState<null | TypeChannelGlobalContext>({
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
