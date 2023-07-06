"use client";
import { Button } from "reactstrap";
import styles from "./page.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkUserPresentInDB, insertUserInDB } from "@/src/utils/dbUtils";
import { RegisterOrUpdateUserRequestType } from "@/src/utils/types"
import { useRouter } from "next/router";

const formSchema = z.object({
  username: z.string().min(3, "Minimum length 3 required"),
  name: z.string().min(3, "Minimum length 3 required"),
  password: z.string().min(3, "Minimum length 3 required"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
}).refine(async (data) => await checkUserPresentInDB(data.username), {
    message: "Username unavailable",
    path: ["username"]
});

type FormSchema = z.infer<typeof formSchema>;

export default function Register() {
  // zod checking definition
  const { register, handleSubmit, formState } = useForm<FormSchema>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;
  const router = useRouter();

  const submitData: SubmitHandler<FormSchema> = async (data: FormSchema) => {
    const user:RegisterOrUpdateUserRequestType = {
        name: data.name,
        username: data.username,
        password: data.password
    }
    const res = await insertUserInDB(user);
    if (!res?.status) {
        router.push("/")
    } else {
        console.log("Errors: ", res.message)
    }
  };

  return (
    <>
      <div className={styles.registerContainer}>
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
