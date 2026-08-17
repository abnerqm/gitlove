import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import GitHub from "./pages/GitHub";
import "./App.css";

type Page = "dashboard" | "github";

function App() {
  const [activated, setActivated] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState<Page>("dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("github") === "connected") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const activate = () => {
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode === "GL-DEMO-2026") {
      setMessage("✓ GITLOVE activado correctamente");

      setTimeout(() => {
        setActivated(true);
      }, 500);

      return;
    }

    if (!normalizedCode) {
      setMessage("Introduce tu código de activación.");
      return;
    }

    setMessage("Código no válido.");
  };

  if (activated) {
    if (page === "github") {
      return <GitHub />;
    }

    return <Dashboard onGitHub={() => setPage("github")} />;
  }

  return (
    <main className="app">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="card">
        <div className="logo">
          <div className="logo-mark">G</div>
          <span>GITLOVE</span>
        </div>

        <p className="eyebrow">AI CODING WORKSPACE</p>

        <h1>Mi primera app GITLOVE</h1>

        <button style={{ marginBottom: "1.5rem" }} onClick={() => alert("¡Hola!")}>
          Hola
        </button>

        <p className="description">
          Build, modify and improve your project using an AI coding agent
          connected to your GitHub repository.
        </p>

        <div className="form">
          <label htmlFor="activation-code">Activation code</label>

          <input
            id="activation-code"
            type="text"
            placeholder="GL-XXXX-XXXX-XXXX"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                activate();
              }
            }}
          />

          <button onClick={activate}>Activate GITLOVE</button>

          {message && (
            <div
              className={`message ${
                message.startsWith("✓") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="security">
          <span className="security-icon">✓</span>
          <span>Secure GitHub connection</span>
        </div>

        <div className="footer">
          <span>GITLOVE</span>
          <span>v0.1.0</span>
        </div>
      </section>
    </main>
  );
}

export default App;