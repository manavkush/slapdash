"use client"
import Link from 'next/link';
import styles from './Navbar.module.css';
import { Fragment, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import router from 'next/router';
import { useGlobalContext } from '@/src/context';

const Navbar: React.FC = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {user} = useGlobalContext()

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
    };

    const handleLogoutClick = async () => {
        try {
          signOut({ callbackUrl: 'http://localhost:3000/login' })
        } catch(error: any) {
          console.log(error)
        }
    }
    
    const AuthLinks = () => {
        if (user == null) {
            return <Fragment>
                <Link className={styles.link} href="/login">
                    Login
                </Link>
                <Link className={styles.link} href="/register">
                    Sign Up
                </Link>
            </Fragment>
        } else {
            return <Link className={styles.link} href="#" onClick={handleLogoutClick}>
                Logout
            </Link>
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
                <AuthLinks />
                <Link className={styles.link} href="/team">
                    Team
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
