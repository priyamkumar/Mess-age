import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div>
      <LoginForm />
    </div>
  );
}
