'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import styles from './page.module.css'
import { Button, Input } from 'reactstrap'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { TypeSession } from '../utils/types';
import { authOptions } from '../lib/auth';
import ChatSidebar from '../components/ChatSidebar/ChatSidebar';
import Chat from '../components/Chat/Chat';
import { createContext } from 'react';
import {useGlobalContext} from "../context/index"

// import Navbar from '../components/Navbar/Navbar';

export default function Home() {
  const {data: session, status} = useSession();

  const {user, channel, setUser, setChannel} = useGlobalContext();
  
  return status == "authenticated" ? (
    <div style={{color:"white"}} className={styles.home}>
      <ChatSidebar />
      <Chat user={user} channel={channel} />
    </div>
  ) : (
    <div style={{color:"white"}} className={styles.home}>
      Dashboard
    </div>
  )
}
