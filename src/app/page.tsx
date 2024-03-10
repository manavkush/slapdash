'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { useSession } from 'next-auth/react';
import { TypeUtilResponse } from '../types/types';
import ChatSidebar from '../components/ChatSidebar/ChatSidebar';
import Chat from '../components/Chat/Chat';
import { useGlobalContext } from "../context/index"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Channel } from '@prisma/client';
import Dashboard from '../components/Landing/Landing';


export default function Home() {
  const { data: session, status } = useSession();
  const { user, channel, setUser } = useGlobalContext();
  const [userChannels, setUserChannels] = useState<Channel[]>([])

  useEffect(() => {
    if (session && session.user != null) {
      setUser(session?.user!)
    }
  }, [session, session?.user, setUser])

  // This function fetches all the channels for a given user.
  const fetchChannels = async () => {
    const response = await fetch("/api/channel/getAll?" + new URLSearchParams({ uid: user?.id! }));
    const channelsFromDB: TypeUtilResponse = await response.json();
    const channelsObj: { userChannels: Channel[] } = channelsFromDB.data
    return channelsObj
  }

  // using queryClient is important for reactQuery (even if it's not used as per warning)
  useQueryClient();
  const channelQuery = useQuery({
    queryKey: ["channels"],
    queryFn: fetchChannels,
    enabled: !!user
  })

  useEffect(() => {
    if (channelQuery.status == "success") {
      console.log("Setting Channels after query.")
      const userChannelsFromDb: Channel[] = channelQuery.data.userChannels
      setUserChannels(userChannelsFromDb)
    }
  }, [channelQuery.status, channelQuery.data?.userChannels])

  // Early return for when the user is not signed in
  if (status != "authenticated") {
    return <Dashboard />
  }

  if (channelQuery.status == "error") {
    return <pre className={styles.home}>{JSON.stringify(channelQuery.error)}</pre>
  }
  if (channelQuery.status == "loading" ) {
    return <div className={styles.home}></div>
  }

  return <div className={styles.home}>
    <ChatSidebar channels={userChannels} />
    <Chat user={user} channel={channel} />
  </div>
}
