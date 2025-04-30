import { useState } from "react";
import { Users, X, Plus, Search } from "lucide-react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import toast from "react-hot-toast";

export default function GroupChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user, chats, setChats } = ChatState();
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
      !selectedUsers.find((selected) => selected._id === user._id)
  );

  const handleAddUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearch("");
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleCreateChat = async () => {
    if (groupName.trim() === "" || selectedUsers.length === 0) {
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast.success("New Group Created");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }

    setGroupName("");
    setSelectedUsers([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        New Group Chat <AddIcon />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Create Group Chat</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} className="cursor-pointer" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Group Name Input */}
          <div className="mb-6">
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter group name"
            />
          </div>

          {/* Selected Users */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Users ({selectedUsers.length})
            </label>
            <div className="flex flex-wrap gap-2 min-h-12">
              {selectedUsers.map((user) => (
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
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Search */}
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

            {/* User results */}
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

          {/* Create Button */}
          <button
            onClick={handleCreateChat}
            disabled={groupName.trim() === "" || selectedUsers.length === 0}
            className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2
              ${
                groupName.trim() === "" || selectedUsers.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            <Users size={20} />
            Create Group Chat
          </button>
        </div>
      </div>
    </div>
  );
}
