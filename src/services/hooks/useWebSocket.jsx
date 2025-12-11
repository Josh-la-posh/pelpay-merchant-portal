import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

const useWebSocket = (url) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // --------------------------
  // INITIAL CONNECTION
  // --------------------------
  useEffect(() => {
    if (!url) return;

    const socket = io(url, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
      // timeout: 8000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ WebSocket connection failed:", error.message);
      setIsConnected(false);
      // DO NOT FORCE DISCONNECT — allow reconnection attempts
    });

    socket.on("error", (err) => {
      console.error("❌ WebSocket error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        setIsConnected(false);
      }
    };
  }, [url]);

  // -----------------------------------
  // EMITTER: JOIN ROOM (Corrected API)
  // -----------------------------------
  const joinRoom = useCallback((payload) => {
    // if (!socketRef.current?.connected) return;

    console.log("Joining room with payload:", payload);
    socketRef.current.emit("join_room", payload);
  }, []);

  const fetchAnalysis = useCallback((payload, token) => {
    // if (!socketRef.current?.connected) return;

    const enhancedPayload = {
      ...payload,
      token: token, // Include the auth token so backend can use it for API requests
    };

    console.log("Fetching analysis:", enhancedPayload);
    socketRef.current.emit("fetch_analysis", enhancedPayload);
  }, []);

  const on = useCallback((event, callback) => {
    if (socketRef.current) socketRef.current.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    if (socketRef.current) socketRef.current.off(event, callback);
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("⚠️ Cannot emit, socket not connected.");
    }
  }, []);

  return { socket: socketRef.current, on, off, emit, joinRoom, fetchAnalysis, isConnected };
};

export default useWebSocket;
