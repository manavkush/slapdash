"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import styles from "./page.module.css";
import { Button } from "reactstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type FormSchema = z.input<typeof formSchema>;

export default function Login() {
  const { register, handleSubmit, formState } = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema)
  });
  
  const {errors} = formState

  const submitData:SubmitHandler<FormSchema> = (data: FormSchema) => {
    console.log(data)
  };
  
  
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeading}>Login to Your Account</div>
        <div className={styles.formWrapper}>
          <div className={styles.loginForm}>
            <form onSubmit={handleSubmit(submitData)}>
              <div className={styles.username}>
                <input
                  className={styles.usernameInput}
                  type="text"
                  placeholder="username"
                  {...register('username')}
                />
              </div>
              <div className={styles.password}>
                <input
                  className={styles.passwordInput}
                  type="text"
                  placeholder="password"
                  {...register('password')}
                />
              </div>
              <div>
                <Button className={styles.loginButton}>
                  Login to Your Account
                  <FontAwesomeIcon
                    className="fa-shake"
                    icon={faArrowRight}
                  ></FontAwesomeIcon>
                </Button>
              </div>
            </form>
            <p>Don&apos;t have a account? Register Now!</p>
          </div>
          <div className="d-flex">
            <div className={styles.vr}></div>
          </div>

          <div className={styles.externalLogin}>
            <div className={styles.loginGoogle}>
              <Button>
                <FontAwesomeIcon
                  className={`${styles.faIcon} fa-bounce`}
                  icon={faGoogle}
                ></FontAwesomeIcon>{" "}
                Login with Google
              </Button>
            </div>
            <div className={styles.loginFacebook}>
              <Button>
                <FontAwesomeIcon
                  className={`${styles.faIcon} fa-bounce`}
                  icon={faFacebook}
                ></FontAwesomeIcon>{" "}
                Login with Facebook
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.forgotPassword}>Forgot Password</div>
      </div>
    </>
  );
}
