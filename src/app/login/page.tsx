"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Button } from "reactstrap";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.error('Incorrect username or password. Check again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("Errors: ", res.error)
      }
    } catch(error: any) {
      console.log(error)
    }
  };
  
  
  return (
    <>
      <div className="bg-[#1D1D1F] min-h-screen">
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
        <div className="login-heading text-[#FFF] text-center text-2xl font-medium pt-20 sm:text-4xl">Login to Your Account</div>
        <div className="login-container flex flex-col w-full m-auto pt-4 lg:flex-row lg:pt-10 lg:pb-10">
          <div className="login-form-container flex flex-col w-3/4 sm:w-1/2 m-auto">
            <form className="login-form w-full lg:w-3/5 flex flex-col justify-evenly gap-4 m-auto" onSubmit={handleSubmit(submitData)} >
              <input
                className="h-16 p-4 bg-[#222] rounded-lg text-white"
                type="text"
                placeholder="Username"
                {...register('username')}
              />
              <input
                className="h-16 p-4 bg-[#222] rounded-lg text-white"
                type="password"
                placeholder="Password"
                {...register('password')}
              />
              <button className="login-btn flex justify-between p-4 w-full h-16 text-center bg-gradient-to-r from-[#A9A5FD] to-[#EBD75D] rounded-lg items-center">
                Login to Your Account
                <FontAwesomeIcon
                  className="fa-shake"
                  icon={faArrowRight}
                ></FontAwesomeIcon>
              </button>
            </form>
            <div className="text-white w-full text-center h-16 flex">
              <p className="m-auto">Don&apos;t have a account? <button onClick={() => {router.push("/register")}} >Register Now!</button></p>
            </div>
          </div>

          <div className="vertical-line d-flex">
            <div className="bg-gray-400 w-[1px]"></div>
          </div>

          <div className="ext-login-container rounded-s w-3/4 sm:w-1/2 flex flex-col h-full text-[#fff] text-center m-auto gap-4">
            <div className="ext-login-btn google-btn flex rounded-lg w-full m-auto bg-[#222122] text-2xl text-white font-medium lg:w-3/5 h-16">
              <button className="bg-[#222122] flex text-lg text-center w-4/5 justify-evenly m-auto">
                <FontAwesomeIcon
                  className="fa-bounce mb-auto mt-auto mr-4 ml-4"
                  icon={faGoogle}
                ></FontAwesomeIcon>{" "}
                <p className="m-auto">
                Login with Google
                </p>
              </button>
            </div>
            <div className="ext-login-btn facebook-btn flex rounded-lg w-full m-auto bg-[#222122] text-2xl text-white font-medium lg:w-3/5 h-16">
              <button className="bg-[#222122] flex text-lg text-center w-4/5 justify-between m-auto">
                <FontAwesomeIcon
                  className="fa-bounce mb-auto mt-auto mr-4 ml-4"
                  icon={faFacebook}
                ></FontAwesomeIcon>{" "}
                <p className="m-auto">
                Login with Facebook
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="forgot-passowrd text-white text-center text-l p-4">Forgot Password</div>
      </div>
    </>
  );
}
