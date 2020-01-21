# Info

Normally, we use that plugin [y-webrtc](https://github.com/yjs/y-webrtc) to connect
via Webrtc and the public y-js signaling servers provided by the author. 
The issue is on page refresh the plugin creates a new peer ID, so the player
cannot use the old player IDS. It will appear, that it is a new player. Which 
we don't want.

the lastest version is using y-webrtc "^10.1.0"
