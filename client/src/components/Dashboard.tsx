import { createResource } from "solid-js";
import { ChatSidebar } from "./ChatSidebar";
import { createSignal } from "solid-js";
import { ChatWindow } from "./ChatWindow";

const [chatList] = createResource(fetchChats)
const [currentChat, setCurrentChat] = createSignal<null | string>(null)

async function fetchChats() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chats`, {
    credentials: 'include'
  })
  const responseJson = await response.json()
  if (responseJson.error == "1") {
    return null
  }

  return responseJson
}

export function Dashboard() {
  return <div class="flex flex-row w-full h-full">
    <ChatSidebar chatList={chatList} />
    <ChatWindow currentChat={currentChat} setCurrentChat={setCurrentChat} />
  </div>
}
