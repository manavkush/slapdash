import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Pusher from 'pusher-js';
import PropTypes from 'prop-types'
import styles from "./Chat.module.css"
import { Message, Channel, User } from '@prisma/client';
import { pusherClient } from '@/src/lib/pusher';
import { MESSAGE_EVENT } from '@/src/lib/stringConstants';

interface ChatProps {
  channel: Channel|null
  user: Omit<User, "password">|null
}

const Chat = (props: ChatProps) => {
  //TODO: initialize the messages of the channel
  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => {
    
    if(props.channel) {
      const channel = pusherClient.subscribe(props.channel.id)

      channel.bind(MESSAGE_EVENT, (data:Message) => {
        setMessages([...messages, data])
      })
  
    }

    return () => {
      // if(props.channel)
      //   pusherClient.unsubscribe(props.channel.id)
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


export default Chat;