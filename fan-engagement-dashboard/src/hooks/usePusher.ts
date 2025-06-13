// src/hooks/usePusher.ts
import { useEffect } from "react";
import Pusher from "pusher-js";

interface Message {
  id: number;
  conversation_id: number;
  sender: "fan" | "chatter";
  content: string;
  created_at: string;
}

const usePusher = (
  conversationId: number | null,
  onMessage: (message: Message) => void
) => {
  useEffect(() => {
    if (!conversationId) return;

    // Enable pusher logging for debugging
    Pusher.logToConsole = true;

    const pusher = new Pusher("6d9ad28838603c0b57ae", {
      cluster: "ap1",
      forceTLS: true,
    });

    const channelName = `conversation.${conversationId}`;
    console.log(`Subscribing to channel: ${channelName}`);
    
    const channel = pusher.subscribe(channelName);

    // Handle connection events
    pusher.connection.bind('connected', () => {
      console.log('Pusher connected');
    });

    pusher.connection.bind('error', (err: any) => {
      console.error('Pusher connection error:', err);
    });

    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`Successfully subscribed to ${channelName}`);
    });

    channel.bind('pusher:subscription_error', (err: any) => {
      console.error(`Subscription error for ${channelName}:`, err);
    });

    const handler = (data: { message: Message }) => {
      console.log('Received message:', data);
      onMessage(data.message);
    };

    // Use the event name based on your Laravel setup
    // Option 1: If you use broadcastAs() returning 'MessageSent'
    channel.bind("MessageSent", handler);
    
    // Option 2: If you use default Laravel naming (comment out above and use this)
    // channel.bind("message.sent", handler);

    return () => {
      console.log(`Cleaning up subscription to ${channelName}`);
      channel.unbind("MessageSent", handler);
      // channel.unbind("message.sent", handler); // Use this if using option 2
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [conversationId, onMessage]);
};

export default usePusher;