import styles from "./ChatSidebar.module.css"
import ServerBar from "./ServerBar/ServerBar"
import ChannelBar from "./ChannelBar/ChannelBar"

export default function ChatSidebar() {
  return (
    <div className="bg-blue-500 w-1/4 h-screen max-w-[15rem]">
        <ChannelBar />
    </div>
  );
}