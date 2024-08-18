const { PeerServer } = require('peer');
const express = require('express');
const { logger } = require('winston');
const app = express();

const PORT = process.env.PEER_PORT || 5004;
console.log("PORT",PORT);
const peerServer = PeerServer({ port: PORT, path: '/api/videocalls/userId', debug: true });




app.use(express.json());

// Log connection events
peerServer.on('connection', (client) => {
  console.log(`Client connected: ${client.id}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client disconnected: ${client.id}`);
});

peerServer.on('call', (call) => {
  console.log(`Call initiated from ${call.peer}`);
});

// app.listen(PORT, () => {
//   console.log(`PeerJS server running on port ${PORT}`);
// });

app.post('/api/videocalls/userId/log', (req, res) => {
    const { userId, action } = req.body;
    console.log(`Action: ${action}, User ID: ${userId}`);
    res.status(200).send('Log received');
  });

  console.log(`PeerJS server running on port ${PORT}`);