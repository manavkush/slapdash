'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import styles from './page.module.css'
import { Button, Input } from 'reactstrap'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar/Navbar';

export default function Home() {
  return (
    <>
    <Navbar />
    <div className={styles.loginContainer}>
      <div className={styles.loginHeading}>Login to Your Account</div>
      <div className={styles.formWrapper}>
        <div className={styles.loginForm}>
          <div className={styles.username}>
            <Input 
              className={styles.usernameInput}
              type="text"
              name="username"
              placeholder="username" />
          </div>
          <div className={styles.password}>
              <Input 
              className={styles.passwordInput}
              type="text"
              name="password"
              placeholder="password" />
          </div>
          <div >
            <Button className={styles.loginButton}>
              Login to Your Account <FontAwesomeIcon className='fa-shake' icon={faArrowRight}></FontAwesomeIcon>
            </Button>
          </div>
          <p>Don&apos;t have a account? Register Now!</p>
        </div>
        <div className='d-flex'>
        <div className={styles.vr}></div>
      </div>

        <div className={styles.externalLogin}>
          <div className={styles.loginGoogle}>
            <Button>
            <FontAwesomeIcon className={`${styles.faIcon} fa-bounce`} icon={faGoogle}></FontAwesomeIcon>  Login with Google 
            </Button>
          </div>
          <div className={styles.loginFacebook}>
            <Button>
            <FontAwesomeIcon className={`${styles.faIcon} fa-bounce`} icon={faFacebook}></FontAwesomeIcon>  Login with Facebook
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.forgotPassword}>Forgot Password</div>
    </div>
    </>
  )
}
