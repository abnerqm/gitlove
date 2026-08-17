import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onSendQuote: () => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onSendQuote
}) => {
  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="gradient-gitlove p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-rose-400" />
            <div>
              <h3 className="font-bold text-lg">Tu Cotización</h3>
              <p className="text-xs text-slate-300">{items.length} productos seleccionados</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5 text-slate-200" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-slate-600 font-medium">Tu lista de cotización está vacía</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explora nuestros materiales de construcción y agrégalos para solicitar tu presupuesto.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div 
                key={product.id} 
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${product.colorGradient} flex items-center justify-center text-white font-bold text-xs shadow-inner shrink-0`}>
                  {product.category.substring(0, 3).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-slate-800 truncate">{product.name}</h4>
                  <p className="text-xs text-rose-600 font-bold mt-0.5">
                    ${product.price.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ {product.unit}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                  <button 
                    onClick={() => onUpdateQuantity(product.id, -1)} 
                    className="p-1 text-slate-500 hover:bg-slate-100 rounded transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-700">{quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(product.id, 1)} 
                    className="p-1 text-slate-500 hover:bg-slate-100 rounded transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button 
                  onClick={() => onRemoveItem(product.id)} 
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal Estimado</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Envío a Obra</span>
                <span className="text-emerald-600 font-medium">Por Cotizar</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Estimado:</span>
                <span className="text-rose-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onSendQuote}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Cotización por WhatsApp</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
