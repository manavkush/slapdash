import React, { useEffect, useRef} from 'react'
import { Message, User } from '@prisma/client'
import styles from "./ChatHistory.module.css"
import ChatMessage from './ChatMessage/ChatMessage'

const ChatHistory = (props: { messages: Message[], user: Omit<User, "password">|null}) => {
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
        return <ChatMessage user={props.user} message={message} key={message.id}/>
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatHistory
