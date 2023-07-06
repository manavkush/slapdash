"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import styles from "./page.module.css";
import { Button } from "reactstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter()
  const { register, handleSubmit, formState } = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema)
  });
  const {errors} = formState


  const submitData:SubmitHandler<FormSchema> = async (data: FormSchema) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        callbackUrl:"/",
        username: data.username,
        password: data.password
      })
  
      if (!res?.error) {
        router.push("/")
      } else {
        console.log("Errors: ", res.error)
      }
    } catch(error: any) {
      console.log(error)
    }
  };
  
  
  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeading}>Login to Your Account</div>
        <div className={styles.formWrapper}>
          <div className={styles.loginForm}>
            <form onSubmit={handleSubmit(submitData)} >
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
                  type="password"
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
