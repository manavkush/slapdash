import { Message, User } from '@prisma/client'
import React, { Fragment } from 'react'
import styles from "./ChatMessage.module.css"
import { TypeMessageWithBasicUser } from '@/src/types/types'

const ChatMessage = (props: { message: TypeMessageWithBasicUser }) => {
  const message = props.message
  const user = props.message.user

  if (user == null) {
    return <Fragment></Fragment>
  }
  console.log("DEBUG: ", user)

  return (
    <div className={styles.chatMessageWrapper}>
      <div key={message.id} className={styles.chatMessage}>
        <p className={styles.chatMessageUser}>{message.user.name}</p>
        <p className={styles.chatMessageText}>{message.text}</p>
      </div>
    </div>
  )
}

export default ChatMessage
