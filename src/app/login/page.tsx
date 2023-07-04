"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import styles from "./page.module.css";
import { Button, Input } from "reactstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import {z} from "zod"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Login() {
  const { register, handleSubmit } = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });

  const submitData = (data: FormSchema) => {
    console.log("*")
    console.log(data);
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeading}>Login to Your Account</div>
        <div className={styles.formWrapper}>
          <div className={styles.loginForm}>
            <form onSubmit={handleSubmit(submitData)}>
              <div className={styles.username}>
                <Input
                  className={styles.usernameInput}
                  type="text"
                  placeholder="username"
                  {...register("username")}
                />
              </div>
              <div className={styles.password}>
                <Input
                  className={styles.passwordInput}
                  type="text"
                  placeholder="password"
                  {...register("password")}
                />
              </div>

              <div onClick={handleSubmit(submitData)}>
              <Button className={styles.loginButton} >
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
