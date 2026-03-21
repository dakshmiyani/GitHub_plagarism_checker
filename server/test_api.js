const axios = require("axios");

const BASE_URL = "http://localhost:3000/open/api/plagiarism";
const REPO_URL = "https://github.com/dakshmiyani/Movify-main.git";

async function testApi() {
    console.log(`1. Starting plagiarism check for ${REPO_URL}...`);
    try {
        const checkRes = await axios.post(`${BASE_URL}/check`, { repoUrl: REPO_URL });
        const jobId = checkRes.data.jobId;
        console.log(`   -> Success! Job ID: ${jobId}`);

        console.log(`2. Polling status for Job ID: ${jobId}...`);
        let completed = false;
        while (!completed) {
            const statusRes = await axios.get(`${BASE_URL}/job/${jobId}`);
            const { status, result } = statusRes.data;
            console.log(`   -> Current Status: ${status}`);

            if (status === "completed") {
                console.log(`\n3. Job COMPLETED!`);
                console.log(`   Results:`, JSON.stringify(result, null, 2));
                completed = true;
            } else if (status === "failed") {
                console.log(`\n3. Job FAILED!`);
                completed = true;
            } else {
                // Wait 5 seconds before next poll
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    } catch (err) {
        console.error(`ERROR:`, err.response ? err.response.data : err.message);
    }
}

testApi();
