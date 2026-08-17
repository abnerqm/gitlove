import { useState } from "react";
import "./App.css";

function App() {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const handleHolaClick = () => {
    setCount((prev) => prev + 1);
    setGreeting("¡Hola! 👋 ¡Bienvenido a tu primera app creada con GITLOVE!");
  };

  return (
    <main className="app-container">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <section className="card">
        <div className="logo">
          <div className="logo-mark">G</div>
          <span>GITLOVE</span>
        </div>

        <h1>Mi primera app GITLOVE</h1>

        <p className="description">
          ¡Felicidades! Esta es tu primera aplicación creada con el agente AI de GITLOVE.
        </p>

        <div className="action-area">
          <button className="hola-btn" onClick={handleHolaClick}>
            Hola
          </button>

          {greeting && (
            <div className="greeting-card">
              <p>{greeting}</p>
              {count > 1 && (
                <span className="click-counter">
                  Has hecho clic en "Hola" {count} veces 🎉
                </span>
              )}
            </div>
          )}
        </div>

        <div className="footer">
          <span>GITLOVE Workspace</span>
          <span>v0.1.0</span>
        </div>
      </section>
    </main>
  );
}

export default App;
