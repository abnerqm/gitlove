import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { checkBackend } from "../services/api";

type NavItem = "dashboard" | "project" | "github" | "history" | "settings";

function Dashboard({
  onGitHub,
}: {
  onGitHub: () => void;
}) {
  const [backendStatus, setBackendStatus] = useState<
  "checking" | "online" | "offline"
>("checking");

useEffect(() => {
  checkBackend()
    .then(() => setBackendStatus("online"))
    .catch(() => setBackendStatus("offline"));
}, []);

  const [activeItem, setActiveItem] = useState<NavItem>("dashboard");
  const [instruction, setInstruction] = useState("");

  const handleAnalyze = () => {
    if (!instruction.trim()) {
      return;
    }

    alert(`GITLOVE analizará:\n\n${instruction}`);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">G</div>
          <span>GITLOVE</span>
        </div>

        <nav className="navigation">
          <button
            className={activeItem === "dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveItem("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={activeItem === "project" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveItem("project")}
          >
            <span>◈</span>
            Project
          </button>

          <button
            className={activeItem === "github" ? "nav-item active" : "nav-item"}
            onClick={onGitHub}
          >
            <span>◉</span>
            GitHub
          </button>

          <button
            className={activeItem === "history" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveItem("history")}
          >
            <span>↻</span>
            History
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className={
              activeItem === "settings" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActiveItem("settings")}
          >
            <span>⚙</span>
            Settings
          </button>

          <div className="license-card">
            <div className="license-dot" />
            <div>
              <strong>PRO ACTIVE</strong>
              <span>Demo license</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="page-label">WORKSPACE</p>
            <h1>Good afternoon</h1>
          </div>

          <div className="connection-status">
            <span
              className={
                backendStatus === "online"
                  ? "backend-online"
                  : backendStatus === "offline"
                    ? "backend-offline"
                    : "backend-checking"
             }
            />
            {backendStatus === "online"
              ? "GITLOVE backend online"
              : backendStatus === "offline"
                ? "GITLOVE backend offline"
                : "Checking backend..."}
          </div>
        </header>

        <section className="project-card">
          <div className="project-info">
            <div className="project-icon">◆</div>

            <div>
              <p className="section-label">CURRENT PROJECT</p>
              <h2>my-lovable-project</h2>

              <div className="project-meta">
                <span>GitHub</span>
                <span>•</span>
                <span>main</span>
              </div>
            </div>
          </div>

          <button className="change-project">Change</button>
        </section>

        <section className="ai-section">
          <div className="ai-heading">
            <div>
              <p className="section-label">AI CODING AGENT</p>
              <h2>What do you want to change?</h2>
              <p>
                Describe the change in natural language. GITLOVE will analyze
                your project and propose the necessary modifications.
              </p>
            </div>
          </div>

          <div className="prompt-box">
            <textarea
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              placeholder="Example: Add dark mode to the dashboard..."
            />

            <div className="prompt-footer">
              <span>GITLOVE will review the code before making changes.</span>

              <button onClick={handleAnalyze}>
                Analyze change
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <div className="quick-card">
            <span className="quick-icon">✦</span>
            <div>
              <strong>Fix an error</strong>
              <p>Find and repair a problem in your project.</p>
            </div>
          </div>

          <div className="quick-card">
            <span className="quick-icon">◌</span>
            <div>
              <strong>Make responsive</strong>
              <p>Improve your layout for mobile devices.</p>
            </div>
          </div>

          <div className="quick-card">
            <span className="quick-icon">+</span>
            <div>
              <strong>Add a feature</strong>
              <p>Describe a new functionality for your app.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;