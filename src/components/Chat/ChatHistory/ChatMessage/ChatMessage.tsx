import React, { Fragment } from 'react'
import { TypeMessageWithBasicUser } from '@/src/types/types'

const ChatMessage = (props: { message: TypeMessageWithBasicUser }) => {
  const message = props.message
  const user = props.message.user

  if (user == null) {
    return <Fragment></Fragment>
  }
  console.log("DEBUG: ", user)

  return (
    <div className="p-1 w-full">
      <div key={message.id} className="bg-[#1B4242] p-1 rounded-lg">
        <p className="flex m-0 text-sm text-[#9EC8B9]">{message.user.name}</p>
        <p className="text-base">{message.text}</p>
      </div>
    </div>
  )
}

export default ChatMessage
