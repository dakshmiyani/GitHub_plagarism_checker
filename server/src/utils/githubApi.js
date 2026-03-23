const axios = require("axios");
const { GITHUB_TOKEN } = require("../../constants");

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    'User-Agent': 'RepoLens-Security-Engine/1.0'
  }
});

const token = GITHUB_TOKEN ? GITHUB_TOKEN.trim() : null;

if (token && (token.startsWith("gh") || token.startsWith("github_pat_"))) {
  const authPrefix = token.startsWith("github_pat_") ? "Bearer" : "token";
  githubApi.defaults.headers.common["Authorization"] = `${authPrefix} ${token}`;
  console.log(`GitHub API: Using ${authPrefix} token (${token.substring(0, 10)}...)`);
} else {
  console.log("GitHub API: No valid token found, using unauthenticated requests.");
}

module.exports = githubApi;