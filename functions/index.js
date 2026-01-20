const functions = require("firebase-functions");
const express = require("express");

const app = express();
app.use(express.json());

// Test route
app.get("/health", (req, res) => {
  res.send("Backend is working");
});

// Export the API
exports.api = functions.https.onRequest(app);
