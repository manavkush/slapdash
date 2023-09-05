'use client';
import { useEffect } from 'react';
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
import {useGlobalContext} from "../context/index"
import { useQuery, useQueryClient } from '@tanstack/react-query';

// import Navbar from '../components/Navbar/Navbar';

export default function Home() {
  const {data: session, status} = useSession();
  const {user, channel, setUser, setChannel} = useGlobalContext();

  useEffect(() => {
    setUser(session?.user?.id)
  }, [])

  const fetchChannels = async () => {
    const response = await fetch("/api/channel/getAll?" + new URLSearchParams({uid: user?.uid!}));
    const channelsFromDB:TypeUtilResponse = await response.json();
    return channelsFromDB.data
  }
  
  const queryClient = useQueryClient();
  const channelQuery = useQuery({
    queryKey: ["channels"],
    queryFn: fetchChannels,
    enabled: !!user
  })

  if (channelQuery.status == "error") {
    return <pre>{JSON.stringify(channelQuery.error)}</pre>
  }
  if (channelQuery.status == "loading") {
    return <div>Loading</div>
  }
  
  return status == "authenticated" ? (
    <div style={{color:"white"}} className={styles.home}>
      <ChatSidebar channels={channelQuery.data.userChannels}/>
      <Chat user={user} channel={channel} />
    </div>
  ) : (
    <div style={{color:"white"}} className={styles.home}>
      Dashboard
    </div>
  )
}
