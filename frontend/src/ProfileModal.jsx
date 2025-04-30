import { useState } from "react";
import { Mail, X, Calendar } from "lucide-react";
import { Button } from "@mui/material";

export default function ProfileModal({user}) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="flex-col items-center">
      <Button
        onClick={openModal}
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
       Profile
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden relative">
            <button
              onClick={closeModal}
              className="cursor-pointer absolute top-2 right-2 text-white hover:text-gray-700"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div className="bg-blue-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <img
                  src={"/Profile.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-white"
                />
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-500" />
                  <span>Joined {user.createdAt.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
