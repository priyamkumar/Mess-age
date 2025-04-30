import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import React from "react";

export default function UserListItem({ user, handleFunction }) {
  return (
    <>
      <ListItem className="cursor-pointer" onClick={handleFunction}>
        <ListItemAvatar>
          <Avatar>
            <img src={"/Profile.png"} alt="Profile" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={`${user.name}`} secondary={`${user.email}`} />
      </ListItem>
    </>
  );
}
