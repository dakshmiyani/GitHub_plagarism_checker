require("dotenv").config();

// start BullMQ worker
require("./src/workers/plagiarismWorker");

console.log("Worker started and waiting for jobs...");