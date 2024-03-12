import styles from "./ChatSidebar.module.css"
import { Channel } from "@prisma/client";
import { useGlobalContext } from "@/src/context";
import { Card, List, ListItem } from "@material-tailwind/react";


export default function ChatSidebar({ channels }: { channels: Channel[] }) {
  const {setChannel} = useGlobalContext()
  return (
    <div className="bg-[#183D3D] w-1/3 min-h-screen max-w-[15rem]">
      <div className="channel-list-container p-2 h-16 flex items-center justify-center gap-4">
        {channels?.map((channel) => <div className="flex w-full h-full rounded-md items-center justify-center hover:bg-[#9EC8B9] bg-[#52a389] text-[#092635]" onClick={() => setChannel(channel)} key={channel.id}>
            {channel.channelName}
          </div>
        )} 
      </div>
    </div>
  );
}

