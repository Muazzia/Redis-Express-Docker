const express = require("express");
const { createClient } = require("redis");
// const fetch = require("node-fetch"); // Ensure you have node-fetch installed

const app = express();
const port = 3000;

// Create Redis client
const client = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

// Route to fetch data with Redis caching
app.get("/api", async (req, res) => {
  try {
    // Check Redis cache
    const cachedData = await client.get("data");
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Fetch from API if not in cache
    const response = await fetch("https://fakestoreapi.com/products");
    await new Promise((resolve) => setTimeout(() => resolve(), 2000));
    const data = await response.json();

    // Store in Redis with expiration (3600 seconds)
    await client.set("data", JSON.stringify(data), { EX: 3600 });

    res.json(data);
  } catch (err) {
    console.log(err, "err");
    res.status(500).send("Error fetching data");
  }
});

(async () => {
  // Connect Redis client

  await client.connect();
  console.log("Connected to Redis");

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
