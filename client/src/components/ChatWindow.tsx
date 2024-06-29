import { Accessor, Setter } from "solid-js";

interface propsType { currentChat: Accessor<null | string>, setCurrentChat: Setter<null | string> }

export function ChatWindow(props: propsType) {
  return <div class="w-3/4">
    Chat Window
  </div>
}
