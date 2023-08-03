import styles from "./ChatSidebar.module.css"
import ServerBar from "./ServerBar/ServerBar"
import ChannelBar from "./ChannelBar/ChannelBar"

export default function ChatSidebar() {
  return (
    <div>
        <ServerBar />
        <ChannelBar />
    </div>
  );
}