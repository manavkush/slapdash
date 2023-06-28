import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = async () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link className={styles.link} href="/">
                    Logo
                </Link>
            </div>
            <div className={styles.links}>
                <Link className={styles.link} href="/">
                    Dashboard
                </Link>
                <Link className={styles.link} href="/">
                    Login
                </Link>
                <Link className={styles.link} href="/">
                    Team
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
