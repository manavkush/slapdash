import styles from "./ChatSidebar.module.css"
import ServerBar from "./ServerBar/ServerBar"
import ChannelBar from "./ChannelBar/ChannelBar"
// import { Tab } from '@headlessui/react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Channel } from "@prisma/client";
import { useGlobalContext } from "@/src/context";


export default function ChatSidebar({ channels }: { channels: Channel[] }) {
  const {setChannel} = useGlobalContext()
  return (
    <div className="bg-cyan-500 w-1/4 h-screen max-w-[15rem]">
      <List>
        {channels.map((channel, idx) => <ListItem key={channel.id} disablePadding onClick={() => {setChannel(channel); console.log(`Setting Channel: ${channel}`)}} >
          <ListItemButton>
            <ListItemIcon>
            </ListItemIcon>
            <ListItemText primary={channel.channelName} />
          </ListItemButton>
        </ListItem>
        )}
      </List>
    </div>
  );
}

