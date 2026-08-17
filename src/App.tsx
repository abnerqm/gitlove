import { useState } from "react";
import "./App.css";

export default function App() {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const handleHolaClick = () => {
    setCount((prev) => prev + 1);
    setGreeting("¡Hola! 👋 ¡Bienvenido a tu primera app creada con GITLOVE!");
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="badge">
          <span className="heart">❤️</span> Powered by GITLOVE
        </div>
        
        <h1>Mi primera app GITLOVE</h1>
        
        <p className="subtitle">
          ¡Haz clic en el botón para interactuar!
        </p>

        <button className="hola-btn" onClick={handleHolaClick}>
          Hola
        </button>

        {greeting && (
          <div className="response-box">
            <p className="greeting">{greeting}</p>
            <span className="counter-badge">
              Has presionado "Hola" {count} {count === 1 ? "vez" : "veces"} ✨
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
