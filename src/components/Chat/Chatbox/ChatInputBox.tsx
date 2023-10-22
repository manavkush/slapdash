import { Fragment, useState } from "react"
import styles from "./ChatInputBox.module.css"

export interface ChatInputBoxProps {
  messageSendHandle: (message: string) => {}
}

export const ChatInputBox = (props: ChatInputBoxProps) => {
  const [messageToSend, setMessageToSend] = useState("")

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    console.log("Handle Submit called")
    props.messageSendHandle(messageToSend)
    setMessageToSend("")
  }

  return (
    <form className={styles.ChatInput}>
      <div className={styles.ChatInputFieldWrapper}>
        <input type="text" value={messageToSend} onChange={(e) => { setMessageToSend(e.target.value) }} className={styles.ChatInputField} />
      </div>
      <div className={styles.ChatInputButtonWrapper} >
        <button onClick={handleSubmit} className={styles.ChatInputButton}>Send</button>
      </div>
    </form>
  )
}
