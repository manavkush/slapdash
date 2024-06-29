import { For } from "solid-js"

function ChatSidebarItem(props: { item: any }) {
  return <div class="flex flex-row">
    <div>{props.item.image}</div>
    <div>{props.item.name}</div>
  </div>
}

export const ChatSidebar = (props: any) => {
  const chatList: Array<any> = props.chatList
  return <div class="flex-initial w-1/4">
    <div class="chat-controls"></div>
    <div class="chat-list">
      <For each={chatList} fallback={<div>Chat Item</div>}>
        {(item) => (
          <ChatSidebarItem item={item} />
        )}
      </For>
    </div>
  </div>
}
