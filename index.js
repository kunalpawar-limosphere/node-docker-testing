// Simple Express server for Docker testing
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
	message: 'Hello from node-docker-testing!',
	environment: process.env.NODE_ENV || 'development',
	port: port
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

