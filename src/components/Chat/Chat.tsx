import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Pusher from 'pusher-js';
import PropTypes from 'prop-types'
import styles from "./Chat.module.css"
import { Message, Channel, User } from '@prisma/client';

interface ChatProps {
  channel: Channel|null
  user: Omit<User, "password">|null
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {

    if(props.channel) {

      // Start listening via pusher
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.PUSHER_cluster!,
      });

      const channel = pusher.subscribe(props.channel.id)

      channel.bind("MESSAGE_EVENT", (data:Message) => {
        setMessages([...messages, data])
      })
  
    
    // stop listening when chat closed
    return () => {
      if(props.channel)
        pusher.unsubscribe(props.channel.id)
      }
  }
  }, [messages, props.channel, props.channel?.id])
  
  return (
    <Fragment>
      <div>Chat</div>
      {messages.map((message) => {
        return (
          <p key={message.id}>
          {message.text}
          </p>
        )
      })}
    </Fragment>
  )
}


export default Chat