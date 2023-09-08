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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
export default function ChatSidebar({ channels }: { channels: Channel[] }) {

  return (
    <div className="bg-cyan-500 w-1/4 h-screen max-w-[15rem]">
      <List>
        {channels.map((channel, idx) => <ListItem key={channel.id} disablePadding>
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




          // <ListItem disablePadding>
          //   <ListItemButton>
          //     <ListItemIcon>
          //     </ListItemIcon>
          //     <ListItemText primary="Inbox" />
          //   </ListItemButton>
          // </ListItem>
          // <ListItem disablePadding>
          //   <ListItemButton>
          //     <ListItemIcon>
          //     </ListItemIcon>
          //     <ListItemText primary="Drafts" />
          //   </ListItemButton>
          // </ListItem>
