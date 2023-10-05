import React, { useEffect, useState, memo, useRef } from 'react'
import { Message, Channel, User } from '@prisma/client';
import { pusherClient} from '@/src/lib/pusher';
import { MESSAGE_EVENT } from '@/src/lib/stringConstants';
import { ChatInputBox } from './Chatbox/ChatInputBox';
import ChatHistory from './ChatHistory/ChatHistory';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TypeUserGlobalContext, TypeUtilResponse, messageWithUserType } from '@/src/types/types';

interface ChatProps {
  channel: Channel|null
  user: TypeUserGlobalContext|null
}

const Chat = (props: ChatProps) => {
  const [messages, setMessages] = useState<messageWithUserType[]>([])
  const [isInit, setIsInit] = useState(false)
  
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

  // Set the messages initially after the react query execution
  useEffect(() => {
    if(messagesQuery.status == 'success') {
      console.log("MessageQuery.data", messagesQuery.data)
      const newMessages = messagesQuery.data.channelMessages.map((message: messageWithUserGlobalContext) => {
        return {
          ...message,
          date: message.creationTimestamp.toString()
        }
      })
      // messages.current = newMessages
      setMessages([...newMessages])
      setIsInit(true)
     
    }
  }, [messagesQuery.status, messagesQuery.data])


  // For non initialization 
  useEffect(() => {

    if (!isInit) {
      return;
    }

    const pusherChannel = pusherClient.subscribe(props.channel!.id)
    pusherChannel.bind(MESSAGE_EVENT, (data: {message: Message, user: TypeUserGlobalContext}) => {
      console.log(`Caught Message Event: ${JSON.stringify(data.message)}`)
      console.log(data.user)
      const user = data.user
      const newMessage = {...data.message, user}
      setMessages((prevMessages) => [...prevMessages, newMessage])
    })

    return () => {
      console.log("Unsubscribing from pusher Channel")
      pusherChannel.unbind(MESSAGE_EVENT)
      messagesQuery.refetch()
    }
  }, [isInit, messagesQuery, props.channel])


  if (messagesQuery.status == "error") {
    return <pre>{JSON.stringify(messagesQuery.error)}</pre>
  }
  if (messagesQuery.status == "loading") {
    return <div>Loading</div>
  }
  

  if(props.channel) {
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
        channelId: props.channel?.id,
        user: props.user,
      })
    }

    const routeResponse = await fetch("/api/message/send", fetchOptions)
    console.log("DB Response", routeResponse)

  }
 
  return (
    <div className='Chat-wrapper w-full'>
      <ChatHistory messages={messages}/>
      <ChatInputBox messageSendHandle={sendMessageHandler} />
    </div>
  )
}


export default Chat
