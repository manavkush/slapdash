'use client';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import styles from './page.module.css'
import { Button, Input } from 'reactstrap'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { TypeSession, TypeUtilResponse } from '../types/types';
import { authOptions } from '../lib/auth';
import ChatSidebar from '../components/ChatSidebar/ChatSidebar';
import Chat from '../components/Chat/Chat';
import { createContext } from 'react';
import { useGlobalContext } from "../context/index"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Channel, Message } from '@prisma/client';


export default function Home() {
  const { data: session, status } = useSession();
  const { user, channel, setUser, setChannel } = useGlobalContext();
  const [userChannels, setUserChannels] = useState<Channel[]>([])

  useEffect(() => {
    setUser(session?.user)
  }, [session?.user, setUser])

  // This function fetches all the channels for a given user.
  const fetchChannels = async () => {
    const response = await fetch("/api/channel/getAll?" + new URLSearchParams({ uid: user?.uid! }));
    const channelsFromDB: TypeUtilResponse = await response.json();
    const channelsObj: { userChannels: Channel[] } = channelsFromDB.data
    return channelsObj
  }

  const queryClient = useQueryClient();
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
    return <div className={styles.home}>
      <p>Dashboard<br />
        You&apos;re not Signed In<br />
        <Link href="/login"> Click here </Link> login </p>
    </div>
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
