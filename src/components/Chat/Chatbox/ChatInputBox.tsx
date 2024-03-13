import { Fragment, useState } from "react"
import styles from "./ChatInputBox.module.css"

export interface ChatInputBoxProps {
  messageSendHandle: (message: string) => {}
}

export const ChatInputBox = (props: ChatInputBoxProps) => {
  const [messageToSend, setMessageToSend] = useState("")

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    if (messageToSend === "") 
      return

    props.messageSendHandle(messageToSend)
    setMessageToSend("")
  }

  return (
    <form className="flex gap-4 p-2 bottom-0">
      <div className="w-4/5 h-16 min-w-[75%]">
        <input type="text" className="w-full rounded-md pl-2 h-16" value={messageToSend} onChange={(e) => { setMessageToSend(e.target.value) }} />
      </div>
      <div className="w-1/5 scroll-p-0 flex-grow" >
        <button  onClick={handleSubmit} className="h-16 bg-[#092635] rounded-lg px-2 w-full">Send</button>
      </div>
    </form>
  )
}
