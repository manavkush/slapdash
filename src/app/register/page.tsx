"use client";
import { Button } from "reactstrap";
import styles from "./page.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    username: z.string(),
    name: z.string(),
    password: z.string(),
    confirmPassword: z.string()
  });
  
  type FormSchema = z.infer<typeof formSchema>;

export default function Register(){
    const { register, handleSubmit, formState } = useForm<FormSchema>({
        mode: "onSubmit",
        resolver: zodResolver(formSchema)
      });
      
      const {errors} = formState
    
      const submitData:SubmitHandler<FormSchema> = (data: FormSchema) => {
        console.log(data)
      };
    return(
        <>
            <div className={styles.registerContainer}>
                <div className={styles.registerHeading}>
                    Register
                </div>
                <form onSubmit={handleSubmit(submitData)} className={styles.registerForm}>
                    <div>
                        <input
                        className={styles.userInput}
                        type="text"
                        placeholder="username"
                        {...register('username')}
                        />
                    </div>
                    <div>
                        <input
                        className={styles.userInput}
                        type="text"
                        placeholder="name"
                        {...register('name')}
                        />
                    </div>
                    <div>
                        <input
                        className={styles.userInput}
                        type="text"
                        placeholder="password"
                        {...register('password')}
                        />
                    </div>
                    <div>
                        <input
                        className={styles.userInput}
                        type="text"
                        placeholder="confirm password"
                        {...register('confirmPassword')}
                        />
                    </div>
                    <div>
                        <Button className={styles.registerButton}>
                            Register
                        </Button>
                    </div>
                </form>
                <p>Already have an account? Signin Here!</p>
            </div>
        </>
    )
}