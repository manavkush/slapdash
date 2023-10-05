import React, { useEffect, useRef} from 'react'
import { Message, User } from '@prisma/client'
import styles from "./ChatHistory.module.css"
import ChatMessage from './ChatMessage/ChatMessage'
import { TypeUserGlobalContext, messageWithUserType } from '@/src/types/types'

const ChatHistory = (props: { messages: messageWithUserType[]}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [props.messages])

  return (
    <div className={styles.chatHistory}>
      {props.messages.map((message) => {
        return <ChatMessage message={message} key={message.id}/>
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatHistory
