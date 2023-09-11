"use client"
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const Navbar: React.FC = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const user = session?.user?.id;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
    };

    const handleLogout = async() => {
        try {
          signOut({ callbackUrl: 'http://localhost:3000/login' })
        } catch(error: any) {
          console.log(error)
        }
    }

    return (
        <nav className={`${styles.navbar} ${isMobileMenuOpen ? styles.open : ''}`}>
            <div className={styles.logo}>
                <Link className={styles.link} href="/">
                    Slapdash
                </Link>
            </div>
            <div className={styles.links}>
                <Link className={`${styles.link} ${isMobileMenuOpen ? styles.open : ''}`} href="/">
                    Dashboard
                </Link>
                {user==null ?
                    <Link className={styles.link} href="/login">
                    Login
                    </Link> :
                    <Link className={styles.link} href='' onClick={handleLogout}>
                    Logout
                    </Link>
                }
                
                <Link className={styles.link} href="/register">
                    Sign Up
                </Link>
                <Link className={styles.link} href="/team">
                    Team
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
