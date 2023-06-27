// docker run --name some-redis -p 6379:6379 -d redis

// Use docker inspect and docker network ls to get info
// docker run -it --network host --rm redis redis-cli -h <container-ip>
// SET visitor_count 100
// GET visitor_count
// INCR visitor_count
// docker run --network host --name server  -d server

// Name:	redis-service.test.svc.cluster.local
// Address: 10.101.171.186

// Name:	backend-service.test.svc.cluster.local
// Address: 10.107.100.26

const express = require("express");
// const path = require("path");
const Redis = require("ioredis");

const app = express();

// Create a Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST, // Replace with the name of the Redis service
  port: 6379, // Replace with the Redis port if it's different
});

// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, "public")));

// Retrieve the visitor count from Redis
async function getAndIncrementVisitorCount() {
  try {
    const count = await redisClient.incr("visitor_count");
    return count;
  } catch (error) {
    console.error("Error retrieving visitor count:", error);
    throw error;
  }
}

// API endpoint to retrieve visitor count
app.get("/", async (req, res) => {
  try {
    const visitorCount = await getAndIncrementVisitorCount();
    res.json({ count: visitorCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve visitor count" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
