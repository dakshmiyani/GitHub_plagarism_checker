const { Queue } = require("bullmq");
const connection = require("../config/redis");

const plagiarismQueue = new Queue("plagiarism-check", {
  connection
});

module.exports = plagiarismQueue;