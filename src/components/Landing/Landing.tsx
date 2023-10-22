import styles from "./Landing.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TypeAnimation } from "react-type-animation"

const Landing = () => {
  const router = useRouter()
  return (
    <div className={styles.landing}>
      <div className={styles.landing__left}>
        <TypeAnimation
          cursor={true}
          sequence={[
            "Welcome to Slapdash",
            2000,
            "A realtime Chat Application",
            2000,
          ]}
          wrapper="h1"
          speed={10}
          style={{ color: "#fff" }}
          repeat={Infinity}
        />
        <br/>
        <p>
          <button
            type="button"
            onClick={() => {
              console.log("Redirecting to login")
              router.push("/login")
            }}> Sign in </button> to get started
        </p>
      </div>
      <div className={styles.landing__right}>
        <Image
          src="/undraw_text2.svg"
          alt="Landing Image"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}

export default Landing;
