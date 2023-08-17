import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Pusher from 'pusher-js';
import PropTypes from 'prop-types'
import styles from "./Chat.module.css"
import { Message, Channel, User } from '@prisma/client';
import { pusherClient, pusherSendMessage } from '@/src/lib/pusher';
import { MESSAGE_EVENT } from '@/src/lib/stringConstants';
import { channel } from 'diagnostics_channel';

interface ChatProps {
  channel: Channel|null
  user: Omit<User, "password">|null
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageToSend, setMessageToSend] = useState("")

  const handleSubmit = async (e:Event) => {
    e.preventDefault();
    const sendMessageResponse = await pusherSendMessage(props.channel?.id!, {
      id: "random_id",
      text: messageToSend,
      channelId: props.channel?.id!,
      fromUserId: props.user?.uid!,
      creationTimestamp: new Date()
    })
    console.log(sendMessageResponse)
    // const response = await fetch("/api/pusher", {
    //   method: "POST",
    //   body: JSON.stringify({message: messageToSend, uid: props?.user?.uid}),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const body = await response.json()
    // console.log(body)
    setMessageToSend("")
  };

  useEffect(() => {
    if(props.channel) {
      const channel = pusherClient.subscribe(props.channel.id)
      console.log("Channel:", channel)

      channel.bind(MESSAGE_EVENT, (data:Message) => {
        setMessages([...messages, data])
      })
      console.log("Channel bound", channel)
    }

    return () => {
      if(props.channel)
        pusherClient.unsubscribe(props.channel.id)
    }
  }, [messages, props.channel, props.channel?.id])
  
  return (
    <div className='Chat-wrapper'>
      <div>Chat</div>
      {messages.map((message) => {
        return (
          <p key={message.id}>
          {message.text}
          </p>
        )
      })}
      <form>
        <input type="text" value={messageToSend} onChange={(e) => {setMessageToSend(e.target.value)}} />
        <button>Send</button>
      </form>
    </div>
  )
}


export default Chat