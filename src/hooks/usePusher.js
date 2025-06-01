import { useEffect, useRef } from "react";
import { getPusherInstance } from "../utils/pusher";

export const usePusher = (
  channelName,
  eventName,
  callback,
  dependencies = []
) => {
  const channelRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    if (
      typeof channelName !== "string" ||
      !channelName ||
      channelName.includes("undefined")
    ) {
      console.log(
        "Invalid or no channel name, skipping subscription:",
        channelName
      );
      return;
    }

    const pusher = getPusherInstance();
    console.log("Subscribing to channel:", channelName);
    channelRef.current = pusher.subscribe(channelName);

    channelRef.current.bind("pusher:subscription_succeeded", () => {
      if (isMounted.current) {
        console.log("Subscription succeeded:", channelName);
      }
    });

    channelRef.current.bind("pusher:subscription_error", (error) => {
      if (isMounted.current) {
        console.error("Subscription error:", { channel: channelName, error });
      }
    });

    channelRef.current.bind(eventName, (data) => {
      if (isMounted.current) {
        console.log(
          "Event received:",
          eventName,
          JSON.stringify(data, null, 2)
        );
        callback(data);
      }
    });

    // Monitor connection state
    pusher.connection.bind("disconnected", () => {
      if (isMounted.current) {
        console.warn("Pusher disconnected, attempting to reconnect...");
        pusher.connect();
      }
    });

    pusher.connection.bind("connected", () => {
      if (isMounted.current) {
        console.log("Pusher reconnected");
      }
    });

    return () => {
      isMounted.current = false;
      if (channelRef.current) {
        console.log("Unsubscribing from channel:", channelName);
        try {
          channelRef.current.unbind_all();
          pusher.unsubscribe(channelName);
        } catch (error) {
          console.error("Error during cleanup:", error);
        }
        channelRef.current = null;
      }
    };
  }, [channelName, eventName, ...dependencies]);

  return getPusherInstance();
};
