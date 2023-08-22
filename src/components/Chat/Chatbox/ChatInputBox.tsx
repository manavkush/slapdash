import { useState } from "react"

export interface ChatInputBoxProps {
  messageSendHandle: (message:string) => {}
}

export const ChatInputBox = (props: ChatInputBoxProps) => {
  const [messageToSend, setMessageToSend] = useState("")

  const handleSubmit = () => {
    props.messageSendHandle(messageToSend)
  }

  return (
    <form>
        <input type="text" value={messageToSend} onChange={(e) => {setMessageToSend(e.target.value)}} />
        <button onClick={handleSubmit}>Send</button>
    </form>
  )
}
