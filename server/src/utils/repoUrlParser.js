

function parseRepoUrl(url) {
  const cleanUrl = url.replace(".git", "");
  const parts = cleanUrl.split("/");

  const owner = parts[3];
  const repo = parts[4];

  return { owner, repo };
}

module.exports = parseRepoUrl;