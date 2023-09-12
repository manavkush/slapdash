import { Message, User } from '@prisma/client'
import React, { Fragment } from 'react'
import styles from "./ChatMessage.module.css"

const ChatMessage = (props: {message: Message, user: null | Omit<User, "password">, key: string|null}) => {
  const user = props.user
  const message = props.message

  if (user == null) {
    return <Fragment></Fragment>
  }
  console.log("DEBUG: ", user)

  return (
    <div key={message.id} className={styles.chatMessage}>
      <p className={styles.chatMessageUser}>{message.fromUserId}</p><br/>
      <p className={styles.chatMessageText}>{message.text}</p>
    </div>
  )
}

export default ChatMessage
