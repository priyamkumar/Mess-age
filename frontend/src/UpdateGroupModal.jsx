import { useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { Button } from "@mui/material";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupName, setGroupName] = useState(selectedChat.chatName);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState([]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setAllUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Error");
      console.log(error);
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedChat.users.find((selected) => selected._id === user._id)
  );

  const handleAddUser = async (addUser) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin can add someone.");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/add`,
        {
          chatId: selectedChat._id,
          userId: addUser._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error");
      console.log(error);
      setLoading(false);
    }
    setSearch("");
  };

  const handleRemoveUser = async (userId) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admin can remove someone.");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/remove`,
        {
          chatId: selectedChat._id,
          userId,
        },
        config
      );
      userId === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error");
      console.log(error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupName) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupName,
        },
        config
      );
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error("Error");
      console.log(error);
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Update Group Chat
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Update Group Chat</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} className="cursor-pointer" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter group name"
              />
              <button
                onClick={(e) => handleRename()}
                className="py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Members
            </label>
            <div className="flex flex-wrap gap-2 min-h-12">
              {selectedChat.users.filter((el) => el._id !== user._id).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{user.name}</span>
                  <button
                    onClick={() => handleRemoveUser(user._id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search users"
              />
            </div>

            {search && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleAddUser(user)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{user.name}</span>
                      </div>
                      <Plus size={18} className="text-blue-500" />
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => handleRemoveUser(user._id)}
            className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white"
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
}
