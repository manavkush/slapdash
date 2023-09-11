import React, { useEffect, useState } from 'react'
import { Message } from '@prisma/client'
import styles from "./ChatHistory.module.css"

const ChatHistory = (props: {messages: Message[]}) => {

  return (
    <div className={styles.chatHistory}>
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
