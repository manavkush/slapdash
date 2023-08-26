import React, { useEffect, useState } from 'react'
import { Message } from '@prisma/client'
import { useGlobalContext } from '@/src/context'
import { pusherClient } from '@/src/lib/pusher'
import { MESSAGE_EVENT } from '@/src/lib/stringConstants'

const ChatHistory = (props: {messages: Message[]}) => {

    const [messages, setMessages] = useState<Message[]>([])
    const {channel, user} = useGlobalContext()
    
    useEffect(() => {
        if(channel) {
          const pusherChannel = pusherClient.subscribe(channel.id)
          // console.log("pusherChannel:", pusherChannel)
    
          pusherChannel.bind(MESSAGE_EVENT, (data:Message) => {
            setMessages([...messages, data])
          })
          // console.log("Pusher Channel bound", pusherChannel)
          // console.log("Messages: ", messages)
        }
    
        return () => {
          if(channel)
            pusherClient.unsubscribe(channel.id)
        }
    }, [messages, channel, channel?.id])

  return (
    <div>
        <p>ChatHistory</p>
        {props.messages.map((message) => {
            return (
            <p key={message.id}>
            {message.text}
            </p>
            )
        })}
    </div>
  )
}

export default ChatHistory
