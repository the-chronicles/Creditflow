import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import axios from "@/api";
import clsx from "clsx";
import useNotificationsSocket from "@/hooks/useNotifications";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);


  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      console.log("Fetched notifications:", res.data);
      console.log("Current user ID:", localStorage.getItem("userId")); // Or however you store user ID
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };
useEffect(() => {
  fetchNotifications(); // load initially
}, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useNotificationsSocket((newNote) => {
  setNotifications((prev) => [newNote, ...prev]);
});


  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 text-xs font-bold rounded-full bg-red-500 text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto shadow-lg rounded-lg p-2">
        <h3 className="text-sm font-medium mb-2">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications</p>
        ) : (
          notifications.map((note) => (
            <div
              key={note._id}
              className={clsx(
                "p-3 rounded-md border text-sm mb-2",
                note.read ? "bg-muted" : "bg-yellow-50 border-yellow-300"
              )}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="text-sm">{note.message}</div>
                {!note.read && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => markAsRead(note._id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
