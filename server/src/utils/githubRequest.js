const github = require("./githubApi");

async function githubRequest(method, url, configOrData = null, retries = 3) {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      let config = { method, url };
      
      if (method.toLowerCase() === "get") {
        if (configOrData) {
          // If it's a config object (for params), merge it
          config = { ...config, ...configOrData };
        }
      } else {
        if (configOrData) config.data = configOrData;
      }
      
      const res = await github(config);
      return res;
    } catch (err) {
      lastError = err;
      
      // Determine the full URL for logging
      const fullUrl = err.config && err.config.url ? err.config.url : url;
      const params = err.config && err.config.params ? `?${new URLSearchParams(err.config.params).toString()}` : "";
      const displayUrl = fullUrl + params;

      // If rate limited, wait and retry
      if (err.response && err.response.status === 403 && err.response.data.message.includes("rate limit")) {
        const isSearch = displayUrl.includes("/search/");
        const baseWait = isSearch ? 10000 : 2000; 
        const waitTime = Math.pow(2, i) * baseWait; 
        console.log(`Rate limit hit on ${displayUrl}, waiting ${waitTime}ms (retry ${i+1}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (!err.response || err.response.status < 500) {
        throw err;
      }
      
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}

module.exports = {
  get: (url, config, retries = 3) => githubRequest("get", url, config, retries),
  post: (url, data, retries = 3) => githubRequest("post", url, data, retries)
};
