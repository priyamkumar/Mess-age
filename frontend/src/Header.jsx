import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SideDrawer from "./SideDrawer";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../Context/ChatProvider";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BasicMenu from "./Menu";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./main";

export default function Header({markAsRead}) {
  const { user, setUser, notification, setNotification } = ChatState();
  const navigateTo = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigateTo("/");
  };

  const fetchNotifications = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${server}/api/message/unseen`, config);
      setNotification(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{ backgroundColor: "white", color: "black" }}
        position="static"
      >
        <Toolbar sx={{ position: "relative" }}>
          {/* Left section */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <SideDrawer />
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
            >
              {/* Optional Icon */}
            </IconButton>
          </Box>

          {/* Center title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", sm: "block" },
            }}
          >
            Mess-age
          </Typography>

          {/* Right section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginLeft: "auto",
            }}
          >
            <BasicMenu markAsRead={markAsRead}/>
            <ProfileModal user={user} />
            <Button onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
