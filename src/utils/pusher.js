import Pusher from "pusher-js";

let pusherInstance = null;

export const getPusherInstance = () => {
  if (!pusherInstance) {
    Pusher.logToConsole = true;
    pusherInstance = new Pusher("32588f418620179a285a", {
      cluster: "ap1",
      encrypted: true,
    });
    console.log("Pusher instance created:", pusherInstance);
    pusherInstance.connection.bind("error", (err) => {
      console.error("Pusher connection error:", err);
    });
    pusherInstance.connection.bind("connected", () => {
      console.log("Pusher connected");
    });
    pusherInstance.connection.bind("disconnected", () => {
      console.log("Pusher disconnected");
    });
  }
  return pusherInstance;
};
