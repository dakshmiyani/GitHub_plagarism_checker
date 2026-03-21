require("dotenv").config();
const { Queue } = require("bullmq");
const connection = require("../src/config/redis");

const clearQueue = async () => {
  const queue = new Queue("plagiarism-check", { connection });

  try {
    console.log("Stopping any active processes and clearing queue...");
    
    // Drain all jobs across all states
    await queue.drain(true);
    
    // Obliterate the queue completely (resets ID to 1)
    // Note: This works best if workers are stopped, but force:true helps.
    await queue.obliterate({ force: true });
    
    console.log("✅ Queue 'plagiarism-check' has been cleared and reset. Next job will start from ID 1.");
  } catch (err) {
    console.error("❌ Failed to clear queue:", err.message);
  } finally {
    await queue.close();
    process.exit(0);
  }
};

clearQueue();
