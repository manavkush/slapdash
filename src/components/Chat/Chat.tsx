import React, { useEffect, useState, memo } from 'react'
import { Message, Channel, User } from '@prisma/client';
import { pusherClient} from '@/src/lib/pusher';
import { MESSAGE_EVENT } from '@/src/lib/stringConstants';
import { ChatInputBox } from './Chatbox/ChatInputBox';
import ChatHistory from './ChatHistory/ChatHistory';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TypeUtilResponse } from '@/src/types/types';

interface ChatProps {
  channel: Channel|null
  user: Omit<User, "password">|null
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  
  const fetchMessages = async () => {
    const response = await fetch("/api/message/getAll?" + new URLSearchParams({channelId: props.channel!.id}));
    const messagesFromDB:TypeUtilResponse = await response.json();
    return messagesFromDB.data
  }
 
  const queryClient = useQueryClient();
  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages,
    enabled: !!props.channel
  })
 
  useEffect(() => {
    if(messagesQuery.status == 'success') {
      console.log("MessageQuery.data", messagesQuery.data)
      const newMessages = messagesQuery.data.channelMessages.map((message) => {
        return {
          ...message,
          date: message.creationTimestamp.toString()
        }
      })
      setMessages([...messages, ...newMessages])
    }
  }, [messagesQuery.status])

  if (messagesQuery.status == "error") {
    return <pre>{JSON.stringify(messagesQuery.error)}</pre>
  }
  if (messagesQuery.status == "loading") {
    return <div>Loading</div>
  }

  
  console.log("Messages: ", messages)
  if(props.channel) {
    const pusherChannel = pusherClient.subscribe(props.channel.id)
    
    pusherChannel.bind(MESSAGE_EVENT, (data:Message) => {
      console.log("Setting messages")
      setMessages([...messages, data])
    })
  }


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
    console.log("DB Response")
  }

  
  return (
    <div className='Chat-wrapper'>
      <div>Chat</div>
      <ChatHistory messages={messages}/>
      <ChatInputBox messageSendHandle={sendMessageHandler} />
    </div>
  )
}


export default memo(Chat)
