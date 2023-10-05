import styles from "./ChatSidebar.module.css"
import { Channel } from "@prisma/client";
import { useGlobalContext } from "@/src/context";
import { Card, List, ListItem } from "@material-tailwind/react";


export default function ChatSidebar({ channels }: { channels: Channel[] }) {
  const {setChannel} = useGlobalContext()
  return (
    <div className={styles.chatSidebar}>
      <Card className="bg-red-200 h-full rounded-none">
        <List>
          {channels?.map((channel) => <ListItem key={channel.id} onClick={() => setChannel(channel)}>
              {channel.channelName}
            </ListItem>
          )} 
        </List>
      </Card>
    </div>
  );
}

