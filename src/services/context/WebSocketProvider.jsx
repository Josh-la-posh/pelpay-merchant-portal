import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import { updateRealtimeAnalytics, setConnectionStatus } from "@/redux/slices/realtimeSlice";

const WebSocketContext = createContext(null);

export const useGlobalWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useGlobalWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({ children, defaultInterval = "Daily" }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [currentInterval, setCurrentInterval] = useState(defaultInterval);
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const { env } = useSelector((state) => state.env);

  const merchant = auth?.merchant;
  const merchantCode = merchant?.merchantCode;
  const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;

  // Initialize socket connection
  useEffect(() => {
    if (!wsUrl) return;

    const socket = io(wsUrl, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setHasJoinedRoom(false); // Reset so we rejoin on reconnect
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      setHasJoinedRoom(false);
      dispatch(setConnectionStatus(false));
    });

    socket.on("connect_error", (error) => {
      setIsConnected(false);
    });

    // socket.on("error", (err) => {
    //   console.error("Global WebSocket error:", err);
    // });

    // Listen for analytics events globally
    socket.on("analytics", (data) => {
      dispatch(updateRealtimeAnalytics(data));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        setIsConnected(false);
        setHasJoinedRoom(false);
      }
    };
  }, [wsUrl, dispatch]);

  // Join room once when connected and merchant is available
  useEffect(() => {
    if (!socketRef.current || !isConnected || !merchantCode || hasJoinedRoom) return;

    console.log("🚪 Joining room globally:", merchantCode, "with interval:", currentInterval);
    socketRef.current.emit("join_room", {
      room_id: merchantCode,
      env: env === "Live" ? "Live" : "Test",
      intervals: currentInterval,
    });

    setHasJoinedRoom(true);
    dispatch(setConnectionStatus(true));
  }, [isConnected, merchantCode, hasJoinedRoom, env, currentInterval, dispatch]);

  // Re-join room when env changes
  useEffect(() => {
    if (!socketRef.current || !isConnected || !merchantCode) return;

    console.log("🔄 Re-joining room due to env change:", env, "with interval:", currentInterval);
    socketRef.current.emit("join_room", {
      room_id: merchantCode,
      intervals: currentInterval,
      env: env === "Live" ? "Live" : "Test",
    });
  }, [env, isConnected, merchantCode, currentInterval]);

  // Update interval and re-fetch
  const updateInterval = useCallback((newInterval) => {
    setCurrentInterval(newInterval);
    
    // Re-join room with new interval
    if (socketRef.current && isConnected && merchantCode) {
      console.log("🔄 Updating interval to:", newInterval);
      socketRef.current.emit("join_room", {
        room_id: merchantCode,
        env: env === "Live" ? "Live" : "Test",
        intervals: newInterval,
      });
    }
  }, [isConnected, merchantCode, env]);

  const fetchAnalysis = useCallback((payload) => {
    if (!socketRef.current) {
      console.warn("Cannot fetch analysis, socket not initialized.");
      return;
    }

    console.log("Fetching analysis:", payload);
    socketRef.current.emit("fetch-analysis", payload);
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

  const value = {
    socket: socketRef.current,
    isConnected,
    hasJoinedRoom,
    fetchAnalysis,
    on,
    off,
    emit,
    merchantCode,
    env,
    currentInterval,
    updateInterval,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultInterval: PropTypes.string,
};