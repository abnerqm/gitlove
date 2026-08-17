import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [greetingCount, setGreetingCount] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleHolaClick = () => {
    setGreetingCount((prev) => prev + 1);
    setShowToast(true);
    
    // Lanzar efecto de confeti visual
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#f472b6']
    });

    // Ocultar notificación automáticamente después de 3 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="badge">
          <Heart size={16} fill="currentColor" />
          <span>GITLOVE Agent</span>
        </div>

        <h1 className="title">Mi primera app GITLOVE</h1>
        
        <p className="description">
          ¡Bienvenido a tu nueva aplicación creada de forma autónoma por GITLOVE! Presiona el botón para comenzar.
        </p>

        <button className="btn-hola" onClick={handleHolaClick}>
          <MessageCircle size={22} />
          Hola
          <Sparkles size={18} />
        </button>

        {showToast && (
          <div className="toast">
            <CheckCircle2 size={18} />
            <span>¡Hola! Te damos la bienvenida a GITLOVE 🎉</span>
          </div>
        )}

        {greetingCount > 0 && (
          <p className="counter">
            Has hecho clic en <strong>Hola</strong> {greetingCount} {greetingCount === 1 ? 'vez' : 'veces'}
          </p>
        )}
      </div>
    </div>
  );
}