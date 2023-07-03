"use client"
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useState } from 'react';

const Navbar: React.FC = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
    };

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
                <Link className={styles.link} href="/login">
                    Login
                </Link>
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
