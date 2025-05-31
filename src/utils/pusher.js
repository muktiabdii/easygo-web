import Pusher from "pusher-js";

let pusherInstance = null;

export const getPusherInstance = () => {
  if (!pusherInstance) {
    pusherInstance = new Pusher("32588f418620179a285a", {
      cluster: "ap1",
      encrypted: true,
    });
    console.log("Pusher initialized:", pusherInstance);
  }
  return pusherInstance;
};