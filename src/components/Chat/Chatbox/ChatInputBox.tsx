import { Fragment, useState } from "react"

export interface ChatInputBoxProps {
  messageSendHandle: (message:string) => {}
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
    <form className="px-1">
      <input type="text" value={messageToSend} onChange={(e) => {setMessageToSend(e.target.value)}} className="text-black px-1"/>
      <button onClick={handleSubmit}>Send</button>
    </form>
  )
}
