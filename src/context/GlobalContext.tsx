import { Channel, User } from '@prisma/client';
import React, { useState } from 'react';
import { createContext } from 'react';

type userDataType = Omit<User,"password">

interface GlobalContextProps {
    user: userDataType | null,
    channel: Channel | null,
    setUser: (user: any) => void,
    setChannel: (channel: any) => void
}

export const GlobalContext = createContext<GlobalContextProps>({
    user: null,
    channel: null,
    setUser: () => {},
    setChannel: () => {}
})

export const GlobalContextProvider = (props: {children: React.ReactNode}) => {
    const [user, setUser] = useState(null)
    const [channel, setChannel] = useState(null)

    return <GlobalContext.Provider value={{
        user: user,
        channel: channel,
        setUser: setUser,
        setChannel: setChannel
    }}>
        {props.children}
    </GlobalContext.Provider>
}