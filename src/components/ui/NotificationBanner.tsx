import React, { useEffect, useState } from 'react';
import axios from '@/api';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Bell } from 'lucide-react';

const NotificationBanner = () => {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    axios.get('/notifications')
      .then(res => {
        const unread = res.data.find(n => !n.read);
        if (unread) setLatest(unread);
      })
      .catch(err => {
        console.error("Failed to fetch notifications", err);
      });
  }, []);

  if (!latest) return null;

  return (
    <Alert className="mb-4 border-l-4 border-yellow-400 bg-yellow-50">
      <Bell className="h-5 w-5 text-yellow-600" />
      <AlertTitle>Update</AlertTitle>
      <AlertDescription>{latest.message}</AlertDescription>
    </Alert>
  );
};

export default NotificationBanner;