import React, { useState } from 'react';
import { Calculator, X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [area, setArea] = useState<number>(20);
  const [calcType, setCalcType] = useState<'wall' | 'floor'>('wall');

  if (!isOpen) return null;

  // Estimates
  const bricksNeeded = Math.ceil(area * 38); // ~38 bricks per m2 for standard wall
  const cementBags = Math.ceil(area * 0.25);  // ~0.25 bags per m2
  const sandM3 = (area * 0.03).toFixed(2);     // ~0.03 m3 sand per m2

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="gradient-gitlove p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600/30 border border-rose-400/40 rounded-xl text-rose-300">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Calculadora GITLOVE</h3>
              <p className="text-xs text-slate-300">Calcula materiales exactos para tu obra</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              ¿Qué vas a construir?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCalcType('wall')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition text-center ${calcType === 'wall' ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                🧱 Muro / Pared
              </button>
              <button
                onClick={() => setCalcType('floor')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition text-center ${calcType === 'floor' ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                🏗️ Piso / Losa
              </button>
            </div>
          </div>

          {/* Area Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Área aproximada (m²):</label>
              <span className="text-xl font-bold text-rose-600">{area} m²</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="200" 
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>5 m²</span>
              <span>100 m²</span>
              <span>200 m²</span>
            </div>
          </div>

          {/* Calculation Results */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Estimación de Materiales:
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">{calcType === 'wall' ? 'Ladrillos' : 'Varillas 1/2"'}</p>
                <p className="text-lg font-bold text-slate-900">{calcType === 'wall' ? bricksNeeded : Math.ceil(area * 1.8)}</p>
                <p className="text-[10px] text-slate-400">unidades</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Cemento</p>
                <p className="text-lg font-bold text-slate-900">{cementBags}</p>
                <p className="text-[10px] text-slate-400">sacos (42.5kg)</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Arena/Hormigón</p>
                <p className="text-lg font-bold text-slate-900">{sandM3}</p>
                <p className="text-[10px] text-slate-400">m³</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
          >
            <span>Listo, Volver a la Tienda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
