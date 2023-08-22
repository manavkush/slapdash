import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Pusher from 'pusher-js';
import PropTypes from 'prop-types'
import styles from "./Chat.module.css"
import { Message, Channel, User } from '@prisma/client';
import { pusherClient, pusherSendMessage } from '@/src/lib/pusher';
import { MESSAGE_EVENT } from '@/src/lib/stringConstants';
import { channel } from 'diagnostics_channel';
import { ChatInputBox } from './Chatbox/ChatInputBox';
import { headers } from 'next/dist/client/components/headers';
import ChatHistory from './ChatHistory/ChatHistory';
import { useQuery } from '@tanstack/react-query';

interface ChatProps {
  channel: Channel|null
  user: Omit<User, "password">|null
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const { isLoading, error, data } = useQuery({
    queryKey: ['chatData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then(
        (res) => res.json(),
      ),
  })
  
  const sendMessageHandler = async (messageText: string) => {
    console.log("Sending message using send Message handler")

    const fetchOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        text: messageText,
        channelId: props.channel?.id
      })
    }

    const dbResponse = await fetch("/api/message/send", fetchOptions)
    console.log(dbResponse)
  }

  useEffect(() => {
    if(props.channel) {
      const channel = pusherClient.subscribe(props.channel.id)
      // console.log("Channel:", channel)

      channel.bind(MESSAGE_EVENT, (data:Message) => {
        console.log("Setting messages")
        setMessages([...messages, data])
      })
      // console.log("Channel bound", channel)
    }

    return () => {
      if(props.channel)
        pusherClient.unsubscribe(props.channel.id)
    }
  }, [props.channel, props.channel?.id])
  
  return (
    <div className='Chat-wrapper'>
      <div>Chat</div>
      {/* <ChatHistory messages={messages}/> */}
      <ChatInputBox messageSendHandle={sendMessageHandler} />

        <ul>
        {messages.map(message => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </div>
  )
}


export default Chat