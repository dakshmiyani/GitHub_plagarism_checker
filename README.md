# 🔭 RepoLens - GitHub Plagiarism & Analytics Engine

RepoLens is a powerful, production-grade tool designed to analyze GitHub repositories for code similarity and provide deep insights into repository health, tech stack distribution, and contributor activity. Featuring a stunning cyberpunk-themed dashboard, RepoLens offers both visual excellence and technical rigor.

---

## 🚀 Quick Start for Beginners

Follow these steps to get RepoLens running on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Git**
- **Redis** (Required for the plagiarism check queue)
- **PostgreSQL** (Or a Neon/Supabase database URL)

---

### 2. Installation & Setup

#### **Step A: Clone the Repository**
```bash
git clone https://github.com/dakshmiyani/GitHub_plagarism_checker.git
cd GitHub_plagarism_checker
```

#### **Step B: Backend (Server) Setup**
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a file named `.env` in the `server` directory.
   - Copy and paste the following template into your `.env` file:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/repolens
     PORT=3000
     JWT_SECRET_KEY=your_super_secret_jwt_key_here
     GITHUB_TOKEN=your_github_personal_access_token_here
     REDIS_HOST=127.0.0.1
     REDIS_PORT=6379
     ```
   - *Note: Replace the placeholder values with your actual database URL and GitHub Token.*

#### **How to get a GitHub Token (Recommended: Fine-Grained)**
For maximum security, use a **Fine-Grained Personal Access Token**:
1. Go to [Settings > Developer Settings > Personal Access Tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta).
2. Click **Generate new token**.
3. Name your token (e.g., `RepoLens-Scanner`).
4. **Repository access**: Select "All repositories" (public only) or specific ones you want to analyze.
5. **Permissions**:
   - **Contents**: Read-only (Required for structural plagiarism checks).
   - **Metadata**: Read-only (Required for basic repo info and analytics).
6. Click **Generate token** and copy it into your `.env` file.
4. Run Database Migrations:
   ```bash
   npm run migrate:latest
   ```

#### **Step C: Frontend (Client) Setup**
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

### 3. Running the Application

To handle the full workload (Analytics + Plagiarism), you need to run **three** processes. Open three separate terminal tabs:

#### **Terminal 1: The Backend API**
Starts the server that handles analytics and database operations.
```bash
cd server
npm run dev
```

#### **Terminal 2: The Plagiarism Worker** (CRITICAL)
Processes the background plagiarism check jobs. Without this, your scans will stay "WAITING".
```bash
cd server
npm run dev:worker
```
*Tip: You can use `npm run dev:all` to run both the server and worker in one terminal.*

#### **Terminal 3: The Frontend**
```bash
cd client
npm run dev
```
Navigate to `http://localhost:5173` to see the app!

---

## 🏗️ System Architecture

RepoLens follows a decoupled, event-driven architecture designed for high availability and long-running analysis tasks:

1.  **The Nexus (Frontend)**: A React-based dashboard that initiates requests and polls for real-time updates.
2.  **The Orchestrator (API Server)**: Handles authentication, persistent storage (Postgres), and manages the **BullMQ** task queue.
3.  **The Processor (Background Worker)**: A dedicated Node.js service that performs heavy-duty GitHub API fetches and the core similarity calculations.
4.  **The Core (Similarity Engine)**: A specialized utility suite that uses code normalization, fingerprinting, and the **Winnowing algorithm** to find structural similarities between different codebases.

> [!TIP]
> **For a deep dive into the algorithms and code structure, see our [ARCHITECTURE.md](./ARCHITECTURE.md) guide.**

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, GSAP, TailwindCSS (for base structure), Recharts.
- **Backend**: Node.js, Express, BullMQ (Task Queue), Knex.js (Query Builder).
- **Database**: PostgreSQL (Persistence).
- **Caching/Queue**: Redis.

---

## 🔥 Key Features

- **Structural Similarity Detection**: Analyzes code structure, not just text, to find plagiarized logic even if variables are renamed.
- **Dynamic Analytics**: Real-time extraction of tech stack (%), commit frequency, and average gap time.
- **Interactive UI**: Glassmorphism cards, animated radar scans, and a responsive cyberpunk design.
- **Deep Dive Matches**: Side-by-side code comparison for high-similarity matches.

---

## ❓ Troubleshooting

- **Plagiarism Scan stuck on "WAITING"?**
  - Make sure your Redis server is running.
  - Ensure you started the worker with `npm run dev:worker`.
- **Analytics throwing 500 errors?**
  - Check your `GITHUB_TOKEN` in `server/.env`.
  - Ensure the repository you are analyzing is public.
- **Vite Import Errors?**
  - If you see `react-is` errors, run `npm install --legacy-peer-deps` in the client directory.

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---

**Developed with 💙 for RepoLens.**
