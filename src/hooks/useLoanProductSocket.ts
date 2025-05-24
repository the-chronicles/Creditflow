// src/hooks/useLoanProductSocket.ts
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useLoanProductSocket = (onDeleted: (id: string) => void) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("https://cash-flow-be.onrender.com", {
      auth: { token },
    });

    socket.on("loan-product:deleted", ({ id }) => {
      onDeleted(id);
    });

    return () => {
      socket.disconnect(); // clean disconnect on unmount
    };
  }, [onDeleted]);
};
