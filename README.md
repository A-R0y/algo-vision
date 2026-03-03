# ALGO·VISION — Master Every Algorithm

An interactive Full-Stack Data Structures and Algorithms (DSA) visualizer built to help students and developers master complex logic through step-by-step animations and persistent progress tracking.

## 🛠️ Technical Ecosystem
* **Frontend:** React 18, Vite, Tailwind CSS, and Lucide React for a responsive, high-performance UI.
* **Backend:** Supabase (PostgreSQL) providing real-time data synchronization and secure user authentication.
* **Infrastructure:** Configured with environment-specific build pipelines for both local development and production environments.



## ✨ Core Features
* **Dynamic Visualizations:** Detailed animations for 20+ algorithms, including Sorting (Merge, Quick, Bubble), Searching, and Graph traversals (Dijkstra's, BFS/DFS).
* **User Progress Persistence:** Integrated "Mark as Completed" functionality that saves your learning journey directly to the database.
* **Complexity Analysis:** Real-time display of Time Complexity ($O(n \log n)$) and Space Complexity ($O(n)$) for every algorithm.
* **Secure Profiles:** Automatic profile generation for new users with protected data access.

## 🏗️ Engineering Highlights
* **Row Level Security (RLS):** Implemented strict PostgreSQL policies ensuring that user progress data is isolated and accessible only by the account owner.
* **State-Driven Animations:** Utilizes React state management to coordinate asynchronous animation frames with underlying algorithmic logic.
* **Database Normalization:** Optimized schema design featuring an `algorithm_progress` table with foreign key relationships to the global auth schema.



## 🚀 Local Development Setup
1.  **Clone the Repo:**
    `git clone https://github.com/A-R0y/algo-vision.git`
2.  **Install Dependencies:**
    `npm install`
3.  **Configure Environment:**
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  **Launch:**
    `npm run dev` (Access via `http://localhost:8080`)

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


---
**Note:** This project is currently optimized for local professional demonstration while the production deployment pipeline is being refined.
