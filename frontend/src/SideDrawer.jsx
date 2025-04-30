import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { Input, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import Loader from "./Loader";
import { server } from "./main";

export default function SideDrawer() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const { setSelectedChat, user, chats, setChats } = ChatState();
  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };
  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const handleClose = () => {
    toggleDrawer(false);
    setSearchData([]);
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Enter name or email of the user.");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${server}/api/user?search=${search}`, config);
      setSearchData(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error");
      console.log(error);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${server}/api/chat`,
        {
          userId,
        },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoadingChat(false);
      setSelectedChat(data);
      toggleDrawer(false);
    } catch (error) {
      console.log(error);
      setLoadingChat(false);
    }
  };

  const DrawerList = (
    <>
      <Box sx={{ width: 250, padding: 2 }} role="presentation">
        <Typography>Search User</Typography>
        <div className="flex gap-3 mt-2">
          <Input placeholder="Search" onChange={handleInput} />
          <Button variant="contained" onClick={handleSearch}>
            Go
          </Button>
        </div>
      </Box>
    </>
  );

  return (
    <div>
      <Button onClick={() => toggleDrawer(true)}>
        <SearchIcon /> Search User
      </Button>
      <Drawer open={open} onClose={handleClose}>
        {DrawerList}
        {loading ? (
          <ChatLoading />
        ) : (
          searchData.map((u) => (
            <UserListItem
              key={u._id}
              user={u}
              handleFunction={() => accessChat(u._id)}
            />
          ))
        )}
        {loadingChat && <Loader />}
      </Drawer>
    </div>
  );
}
