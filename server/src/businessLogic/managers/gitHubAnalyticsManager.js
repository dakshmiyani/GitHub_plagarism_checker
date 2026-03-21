const githubApi = require("../../utils/githubApi");

class GithubAnalyticsManager {

  static parseRepoUrl(repoUrl) {
    // Remove .git suffix and any trailing slashes
    const cleanUrl = repoUrl.replace(/\.git$/, "").replace(/\/$/, "");
    
    // Split by slash and filter out empty strings
    const parts = cleanUrl.split("/").filter(p => p.length > 0);

    let owner, repo;

    // Handle formats:
    // 1. owner/repo
    // 2. github.com/owner/repo
    // 3. https://github.com/owner/repo
    
    if (parts.length >= 2) {
      // The last two segments are always owner and repo in standard GitHub URLs
      repo = parts[parts.length - 1];
      owner = parts[parts.length - 2];
    }

    if (!owner || !repo) {
      throw new Error("INVALID_GITHUB_URL");
    }

    return { owner, repo };
  }

  static async getRepoAnalytics(repoUrl) {
    try {
      const { owner, repo } = this.parseRepoUrl(repoUrl);

      const repoRes = await githubApi.get(`/repos/${owner}/${repo}`);
      const contributorsRes = await githubApi.get(`/repos/${owner}/${repo}/contributors`);
      const languagesRes = await githubApi.get(`/repos/${owner}/${repo}/languages`);
      const commitsRes = await githubApi.get(`/repos/${owner}/${repo}/commits`);

      const repoCreatedAt = repoRes.data.created_at;

      const contributors = (contributorsRes.data || []).map((c) => ({
        username: c.login,
        commits: c.contributions
      }));

      const numberOfContributors = contributors.length;

      // Tech Stack Percentages
      const techStackData = languagesRes.data || {};
      const totalBytes = Object.values(techStackData).reduce((sum, bytes) => sum + bytes, 0);
      
      const techStack = {};
      if (totalBytes > 0) {
        for (const [language, bytes] of Object.entries(techStackData)) {
          techStack[language] = ((bytes / totalBytes) * 100).toFixed(2) + "%";
        }
      }

      const commits = commitsRes.data || [];

      const commitsPerDay = {};
      const commitFrequency = [];
      let totalGapMs = 0;
      let gapCount = 0;

      // Helper function for HH:MM:SS format
      const formatDuration = (ms) => {
        if (typeof ms !== "number") return "N/A";
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };

      // Ensure commits are sorted by date (newest first, which is GitHub API default)
      commits.sort((a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date));

      commits.forEach((commit, index) => {
        const dateObj = new Date(commit.commit.author.date);
        const date = dateObj.toISOString().split("T")[0];

        if (!commitsPerDay[date]) {
          commitsPerDay[date] = 0;
        }
        commitsPerDay[date]++;

        let gapInMs = "N/A";
        // Calculate gap with the *previous* commit (which is at index + 1 since it's sorted newest first)
        if (index < commits.length - 1) {
          const prevDateObj = new Date(commits[index + 1].commit.author.date);
          gapInMs = dateObj - prevDateObj;
          totalGapMs += gapInMs;
          gapCount++;
        }

        commitFrequency.push({
          sha: commit.sha.substring(0, 7),
          date: commit.commit.author.date,
          message: commit.commit.message.split('\n')[0], // First line of message
          timeSincePreviousCommit: formatDuration(gapInMs)
        });
      });

      const totalCommits = commits.length;
      const averageGapInMs = gapCount > 0 ? (totalGapMs / gapCount) : 0;

      return {
        repository: `${owner}/${repo}`,
        repoCreatedAt,
        numberOfContributors,
        contributors,
        techStack,
        commitsPerDay,
        totalCommits,
        averageCommitGapTime: formatDuration(averageGapInMs),
        commitHistory: commitFrequency
      };

    } catch (err) {
      throw new Error(`Failed to fetch GitHub analytics: ${err.message}`);
    }
  }
}

module.exports = GithubAnalyticsManager;