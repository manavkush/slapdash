"use client";
import { Button } from "reactstrap";
import styles from "./page.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {TypeRegisterOrUpdateUserRequest, TypeRegisterOrUpdateUserResponse} from "@/src/utils/types"
import { redirect } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formSchema = z.object({
  username: z.string().min(3, "Minimum length 3 required"),
  name: z.string().min(3, "Minimum length 3 required"),
  password: z.string().min(3, "Minimum length 3 required"),
  confirmPassword: z.string(),
}).refine((data) => { 
  if (data.confirmPassword !== data.password){
    toast.error('Passwords do not match. Please check again', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  return(data.password === data.confirmPassword)
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})
type FormSchema = z.infer<typeof formSchema>;

export default function Register() {

  const { register, handleSubmit, formState } = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const submitData: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const user:TypeRegisterOrUpdateUserRequest = {
        name: data.name,
        username: data.username,
        password: data.password
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(user)
    }

    const res:Response = await fetch("/api/register", options)
    const resObj:TypeRegisterOrUpdateUserResponse = await res.json()
    console.log(resObj)
    if (!resObj?.status) {
        redirect("/")
    } else {
      toast.error('Username already taken. Choose different username', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("Errors: ", resObj.message?.error)
    }
  };

  return (
    <>
      <div className={styles.registerContainer}>
        
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />
        <div className={styles.registerHeading}>Register</div>
        <form
          onSubmit={handleSubmit(submitData)}
          className={styles.registerForm}
        >
          <div>
            <input
              className={styles.userInput}
              type="text"
              placeholder="username"
              {...register("username")}
            />
          </div>
          <div>
            <input
              className={styles.userInput}
              type="text"
              placeholder="name"
              {...register("name")}
            />
          </div>
          <div>
            <input
              className={styles.userInput}
              type="password"
              placeholder="password"
              {...register("password")}
            />
          </div>
          <div>
            <input
              className={styles.userInput}
              type="password"
              placeholder="confirm password"
              {...register("confirmPassword")}
            />
          </div>
          <div>
            <Button type="submit" className={styles.registerButton}>Register</Button>
          </div>
        </form>
        <p>Already have an account? Signin Here!</p>
      </div>
    </>
  );
}
