import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "@mui/material";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "./ChatLogics";

export default function BasicMenu({markAsRead}) {
  const { user, notification, setNotification, setSelectedChat } = ChatState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={notification.length} color="primary">
          <NotificationsIcon className="cursor-pointer" />
        </Badge>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {notification.length ? (
          notification.map((noti) => {
            return (
              <MenuItem
                key={noti._id}
                onClick={() => {
                  markAsRead(noti.chat)
                  setSelectedChat(noti.chat);
                  setNotification(notification.filter((n) => n !== noti));
                  handleClose();
                }}
              >
                {noti.chat.isGroupChat
                  ? `New Message in ${noti.chat.chatName}`
                  : noti.chat.users && noti.chat.users.length >= 2 && user
                  ? `New Message from ${getSender(user, noti.chat.users)}`
                  : "New Message"}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem>No new Notifications</MenuItem>
        )}
      </Menu>
    </div>
  );
}
