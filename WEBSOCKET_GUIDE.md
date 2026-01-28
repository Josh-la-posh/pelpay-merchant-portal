# WebSocket Integration Guide

## Overview
This document explains the WebSocket integration in the Pelpay Merchant Portal dashboard for real-time updates.

## Setup

### 1. Dependencies
The following package has been installed:
```bash
npm install socket.io-client
```

### 2. Environment Configuration
Add the WebSocket URL to your `.env` file:
```env
VITE_WEBSOCKET_URL=https://glassmerchant-api.pelpay.ng
```

## Implementation

### Custom Hook: `useWebSocket`
Location: `src/services/hooks/useWebSocket.jsx`

This hook manages WebSocket connections with automatic reconnection and event handling.

**Features:**
- Automatic connection and reconnection
- Event subscription/unsubscription
- Room joining/leaving
- Event emission
- Connection state management

**Usage:**
```javascript
import useWebSocket from "@/services/hooks/useWebSocket";

const { on, off, emit, joinRoom, leaveRoom, socket } = useWebSocket(url, options);
```

**Parameters:**
- `url` (string): WebSocket server URL
- `options` (object): Socket.io client options (optional)
  - `auth`: Authentication object (e.g., `{ token: 'your-token' }`)
  - `transports`: Transport methods (default: `['websocket', 'polling']`)
  - `reconnection`: Enable auto-reconnection (default: `true`)
  - `reconnectionDelay`: Delay between reconnection attempts (default: `1000ms`)
  - `reconnectionAttempts`: Maximum reconnection attempts (default: `5`)

**Methods:**
- `on(event, callback)`: Subscribe to an event
- `off(event, callback)`: Unsubscribe from an event
- `emit(event, data)`: Send data to server
- `joinRoom(room)`: Join a specific room
- `leaveRoom(room)`: Leave a specific room

### Dashboard Integration
Location: `src/pages/authenticated/Dashboard/Dashboard.jsx`

The dashboard uses WebSocket to receive real-time updates for:
- Dashboard metrics (lumpsum, graph, analytics)
- Transactions (new and updates)
- Compliance status changes

## Event Listeners

### 1. Dashboard Updates
**Event:** `dashboard:update`
**Triggered when:** Dashboard metrics change (transactions, revenue, etc.)
**Action:** Refreshes lumpsum, graph, and analytics data

```javascript
on('dashboard:update', (data) => {
  console.log('Dashboard update received:', data);
  loadData();
  loadTransactions();
});
```

### 2. Transaction Updates
**Events:** 
- `transaction:new` - New transaction created
- `transaction:update` - Existing transaction updated

**Action:** Refreshes transaction list

```javascript
on('transaction:new', (data) => {
  console.log('New transaction:', data);
  loadTransactions();
});

on('transaction:update', (data) => {
  console.log('Transaction updated:', data);
  loadTransactions();
});
```

### 3. Compliance Updates
**Event:** `compliance:update`
**Triggered when:** Compliance status changes (pending → under_review → approved/rejected)
**Data format:**
```json
{
  "requestSuccessful": true,
  "responseData": {
    "merchantCode": "MOH4f30bd6",
    "status": "approved",
    "progress": 7,
    "reviewedBy": "Admin",
    "reviewedAt": "2025-12-09T10:30:00Z",
    "verificationComment": "All documents verified"
  }
}
```

**Action:** Updates local compliance status and potentially triggers UI changes

```javascript
on('compliance:update', (data) => {
  console.log('Compliance update:', data);
  if (data.status) {
    localStorage.setItem('complianceStatus', data.status);
    // Optionally dispatch Redux action to update compliance state
  }
});
```

## Room-based Updates

The dashboard joins a merchant-specific room for targeted updates:

```javascript
joinRoom(`merchant:${merchantCode}`);
```

This ensures that each merchant only receives updates relevant to their account.

## Server-Side Events (Backend Implementation)

The backend should emit the following events:

### 1. Dashboard Update
```javascript
// When transaction is completed or metrics change
io.to(`merchant:${merchantCode}`).emit('dashboard:update', {
  merchantCode,
  timestamp: new Date(),
  metrics: {
    totalRevenue: 150000,
    transactionCount: 45,
    successRate: 98.5
  }
});
```

### 2. Transaction Events
```javascript
// New transaction
io.to(`merchant:${merchantCode}`).emit('transaction:new', {
  transactionId: 'TXN123',
  amount: 5000,
  currency: 'NGN',
  status: 'pending',
  timestamp: new Date()
});

// Transaction update
io.to(`merchant:${merchantCode}`).emit('transaction:update', {
  transactionId: 'TXN123',
  status: 'successful',
  timestamp: new Date()
});
```

### 3. Compliance Update
```javascript
// Compliance status change
io.to(`merchant:${merchantCode}`).emit('compliance:update', {
  merchantCode,
  status: 'approved',
  progress: 7,
  reviewedBy: 'Admin',
  reviewedAt: new Date(),
  verificationComment: 'All documents verified'
});
```

## Testing

### Local Testing
1. Ensure your backend WebSocket server is running
2. Update `.env` with the correct WebSocket URL
3. Open the dashboard
4. Check browser console for connection logs:
   - "WebSocket connected: [socket-id]"
   - "Joined WebSocket room: merchant:[merchantCode]"

### Testing Events
You can test event reception using the browser console:
```javascript
// The socket instance is available in the Dashboard component
// You can emit test events from your backend or use a WebSocket testing tool
```

## Troubleshooting

### Connection Issues
1. **Check WebSocket URL**: Ensure `VITE_WEBSOCKET_URL` is correct in `.env`
2. **Check CORS**: Backend must allow WebSocket connections from your domain
3. **Check Authentication**: Ensure valid access token is being sent

### Event Not Firing
1. **Verify Room Join**: Check console for "Joined WebSocket room" message
2. **Check Backend Emission**: Ensure backend is emitting to correct room
3. **Check Event Names**: Event names must match exactly (case-sensitive)

### Performance Considerations
- Events are only processed when the dashboard is mounted
- Cleanup functions properly remove event listeners when component unmounts
- Reconnection is automatic with exponential backoff

## Security

### Authentication
The WebSocket connection authenticates using the access token:
```javascript
const { on, off, emit, joinRoom } = useWebSocket(wsUrl, {
  auth: {
    token: auth?.data?.accessToken,
  },
});
```

### Best Practices
1. Always validate data received from WebSocket events
2. Implement rate limiting on the backend
3. Use secure WebSocket (WSS) in production
4. Validate merchant authorization before emitting to rooms

## Future Enhancements

Potential additions:
- Toast notifications for real-time updates
- Sound alerts for critical events
- Visual indicators for live data updates
- Connection status indicator in UI
- Manual reconnection button
- Event history/log viewer
