import React, { useEffect, useRef, useState } from 'react'
import { Message } from '@prisma/client'
import styles from "./ChatHistory.module.css"

const ChatHistory = (props: { messages: Message[] }) => {
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
        return (
          <p key={message.id}>
            {message.text}
          </p>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatHistory
