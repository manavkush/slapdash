'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import styles from './page.module.css'
import { Button, Input } from 'reactstrap'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { TypeSession } from '../utils/types';
import { authOptions } from '../lib/auth';
// import Navbar from '../components/Navbar/Navbar';

export default function Home() {
  const session = useSession();
  

  return session.data !== undefined ? (
    <div style={{color:"white"}} className={styles.home}>
      Dashboard SignedIn
    </div>
  ) : (
    <div style={{color:"white"}} className={styles.home}>
      Dashboard
    </div>
  )
}
