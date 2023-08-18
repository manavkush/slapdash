import { useState } from "react"

export interface ChatboxProps {
  messageSendHandle: (message:string) => {}
}

export const Chatbox = (props: ChatboxProps) => {
  const [messageToSend, setMessageToSend] = useState("")

  const handleSubmit = (event: any) => {
    props.messageSendHandle(event.target.value)
  }

  return (
    <form>
        <input type="text" value={messageToSend} onChange={(e) => {setMessageToSend(e.target.value)}} />
        <button onClick={handleSubmit}>Send</button>
    </form>
  )
}
