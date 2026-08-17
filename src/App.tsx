import React, { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  Boxes,
  Layers,
  Wrench,
  Paintbrush,
  Zap,
  ShoppingCart,
  Calculator,
  Phone,
  MessageSquare,
  Truck,
  ShieldCheck,
  Clock,
  MapPin,
  Star,
  Heart,
  ArrowRight,
  Check,
  Send,
  Plus,
  SlidersHorizontal
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from './data/products';
import { Product, CartItem } from './types';
import { CalculatorModal } from './components/CalculatorModal';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickDetailProduct, setQuickDetailProduct] = useState<Product | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '', location: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`¡${product.name} agregado a la cotización!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const handleWhatsAppQuote = () => {
    const text = cartItems
      .map(i => `• ${i.product.name} x${i.quantity} ($${(i.product.price * i.quantity).toFixed(2)})`)
      .join('%0A');
    const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const url = `https://wa.me/51999999999?text=Hola%20GITLOVE%20Materiales,%20deseo%20cotizar:%0A${text}%0A%0ATotal%20Estimado:%20$${total.toFixed(2)}`;
    window.open(url, '_blank');
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Boxes': return <Boxes className="w-6 h-6 text-amber-500" />;
      case 'Layers': return <Layers className="w-6 h-6 text-slate-500" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-rose-500" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-pink-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-emerald-500" />;
      default: return <Boxes className="w-6 h-6 text-rose-500" />;
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-rose-500/40 animate-bounce">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="gradient-gitlove text-white text-xs font-medium py-2 px-4 border-b border-rose-900/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">GITLOVE</span>
            <span>Descuentos especiales por compras en volumen. ¡Atención personalizada a constructores!</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-rose-400" /> +51 (01) 800-GITLOVE</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-rose-400" /> Lunes a Sábado 7:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* MAIN HEADER / NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* BRAND LOGO */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">GITLOVE</span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">PRO</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Materiales de Construcción</p>
            </div>
          </a>

          {/* HEADER SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Buscar cemento, varillas, ladrillos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            {/* Calculator Button */}
            <button
              onClick={() => setIsCalcOpen(true)}
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-200 transition"
            >
              <Calculator className="w-4 h-4 text-rose-600" />
              <span>Calculadora</span>
            </button>

            {/* Contact CTA Button */}
            <a
              href="#contacto"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3.5 py-2.5 rounded-xl border border-rose-200 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Contacto</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <ShoppingCart className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Cotización</span>
              {totalCartCount > 0 && (
                <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar materiales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="gradient-gitlove text-white py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Garantía de Calidad Estructural en Cada Envío</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Construye tus Sueños con <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">GITLOVE</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Suministramos materiales de construcción certificados de primera calidad: Cemento, Aceros, Ladrillos y Herramientas con envío rápido directamente a tu obra.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#productos"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-2"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <button
                  onClick={() => setIsCalcOpen(true)}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
                >
                  <Calculator className="w-4 h-4 text-rose-400" />
                  <span>Calculadora de Obra</span>
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/60 text-center lg:text-left">
                <div>
                  <p className="text-2xl font-extrabold text-white">+15,000</p>
                  <p className="text-xs text-slate-400">Obras Atendidas</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-rose-400">24 Horas</p>
                  <p className="text-xs text-slate-400">Entrega Express</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Garantizado</p>
                </div>
              </div>
            </div>

            {/* HERO FEATURE CARD */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <Boxes className="w-4 h-4" /> Cotización Rápida en Vivo
                  </h3>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                    En Stock
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Cemento Portland Tipo I</p>
                      <p className="text-[10px] text-slate-400">Saco de 50 kg - Norma ASTM</p>
                    </div>
                    <span className="text-sm font-bold text-rose-400">$8.50</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Varilla Corrugada 1/2" x 12m</p>
                      <p className="text-[10px] text-slate-400">Grado 60 Sismorresistente</p>
                    </div>
                    <span className="text-sm font-bold text-rose-400">$13.20</span>
                  </div>
                </div>

                <a 
                  href="#productos"
                  className="block text-center w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs transition shadow-md"
                >
                  Ver Todos los Precios Actualizados
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFIT BAR */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Despacho a Obra</h4>
                <p className="text-[11px] text-slate-500">Envíos en menos de 24h</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Calidad Certificada</h4>
                <p className="text-[11px] text-slate-500">Normas NTP y ASTM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Asesoría Técnica</h4>
                <p className="text-[11px] text-slate-500">Atención directa por WhatsApp</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Precios de Mayorista</h4>
                <p className="text-[11px] text-slate-500">Descuentos por volumen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">CATEGORÍAS DE CONSTRUCCIÓN</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Todo lo que necesitas para tu proyecto</h2>
            <p className="text-xs sm:text-sm text-slate-500">Selecciona una categoría para filtrar nuestro stock en tiempo real.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'todos' : cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105' : 'bg-white border-slate-200/80 hover:border-rose-300 hover:shadow-md'}`}
                >
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl inline-block ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 group-hover:bg-rose-50'}`}>
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <div>
                      <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{cat.name}</h3>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{cat.count} productos</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-2 border-t border-slate-100/20 flex items-center justify-between text-[10px] font-semibold">
                    <span className={isSelected ? 'text-rose-400' : 'text-slate-500'}>
                      {isSelected ? 'Seleccionado' : 'Ver productos'}
                    </span>
                    <ArrowRight className={`w-3 h-3 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section id="productos" className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* HEADER & FILTERS BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Productos Destacados</h2>
              <p className="text-xs text-slate-500">Precios vigentes puestos en obra o almacén</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Quick Filter Pills */}
              <button
                onClick={() => setSelectedCategory('todos')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${selectedCategory === 'todos' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Todos
              </button>
              {CATEGORIES.slice(0, 4).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${selectedCategory === cat.id ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 ml-auto border-l border-slate-200 pl-3">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold bg-transparent text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-semibold text-sm">No se encontraron productos con el filtro aplicado.</p>
              <button 
                onClick={() => { setSelectedCategory('todos'); setSearchQuery(''); }}
                className="text-xs font-bold text-rose-600 underline"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {product.badge}
                    </div>
                  )}

                  {/* Visual Header / Image Placeholder */}
                  <div className={`h-40 bg-gradient-to-br ${product.colorGradient} p-4 flex flex-col justify-between text-white relative overflow-hidden shrink-0`}>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-sm"></div>
                    
                    <div className="flex justify-end">
                      <span className="text-[10px] font-semibold bg-black/20 px-2 py-0.5 rounded backdrop-blur-xs text-slate-200">
                        Stock: {product.stock} un.
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-black/30 px-2 py-0.5 rounded inline-block mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-sm line-clamp-2 leading-tight drop-shadow-xs">{product.name}</h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                        <span className="text-[10px] text-slate-400">({product.reviews} reseñas)</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Specs Tags */}
                    <div className="space-y-1">
                      {product.specs.slice(0, 2).map((spec, i) => (
                        <p key={i} className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </p>
                      ))}
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Precio Unitario</p>
                        <p className="text-lg font-extrabold text-slate-900">
                          ${product.price.toFixed(2)}
                          <span className="text-[10px] text-slate-400 font-normal"> / {product.unit}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-sm transition flex items-center justify-center shrink-0 group-hover:scale-105"
                        title="Agregar a Cotización"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CALCULATOR BANNER SECTION */}
      <section className="py-12 gradient-gitlove text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">HERRAMIENTA GRATUITA</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                ¿No sabes cuánto material necesitas?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Utiliza nuestra calculadora para determinar la cantidad exacta de cemento, arena y ladrillos para tu muro o losa de concreto. ¡Evita desperdicios!
              </p>
            </div>

            <button
              onClick={() => setIsCalcOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-rose-600/30 transition shrink-0 flex items-center gap-2 transform hover:scale-105"
            >
              <Calculator className="w-5 h-5" />
              <span>Abrir Calculadora Ahora</span>
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT & LOCATION SECTION */}
      <section id="contacto" className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">CONTACTO Y ATENCIÓN DIRECTA</span>
            <h2 className="text-3xl font-extrabold text-slate-900">¿Tienes dudas sobre tu pedido?</h2>
            <p className="text-sm text-slate-600">Atención inmediata por WhatsApp o formulario directo a nuestros asesores técnicos de obra.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Send className="w-5 h-5 text-rose-600" /> Solicitud de Presupuesto Personalizado
              </h3>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-2 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base">¡Mensaje enviado con éxito!</h4>
                  <p className="text-xs text-emerald-700">
                    Un asesor comercial de GITLOVE se pondrá en contacto contigo en menos de 15 minutos.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        placeholder="Juan Pérez"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="+51 987 654 321"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ubicación de la Obra (Distrito/Ciudad)</label>
                    <input
                      type="text"
                      placeholder="Ej: Av. Principal 123, San Isidro"
                      value={contactForm.location}
                      onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Detalle de los Materiales o Consulta</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Ej: Requiero 50 sacos de cemento tipo I y 100 varillas de acero 1/2 con despacho urgente..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-rose-500" />
                    <span>Solicitar Asesoría de Inmediato</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Channels Cards */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Atención Inmediata WhatsApp</h4>
                    <p className="text-xs text-emerald-100">Respuesta directa en menos de 5 min</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Envía tu lista de materiales o plano por chat y recibe tu cotización en formato PDF.
                </p>
                <a
                  href="https://wa.me/51999999999?text=Hola,%20quisiera%20cotizar%20materiales%20de%20construccion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm"
                >
                  <span>Escribir por WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Stores Info Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" /> Central de Almacenes y Tienda
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <p><span className="font-semibold text-slate-800">Dirección:</span> Av. Industrial 450, Zona Industrial GitLove</p>
                  <p><span className="font-semibold text-slate-800">Horario:</span> Lunes a Sábado de 7:00 am a 7:00 pm</p>
                  <p><span className="font-semibold text-slate-800">Teléfono:</span> (01) 800-GITLOVE / +51 999 888 777</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="gradient-gitlove text-white text-xs pt-12 pb-8 border-t border-rose-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">GITLOVE</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                La plataforma líder en suministro digital de materiales de construcción con garantía total y logística ágil para obras.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Categorías</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#productos" className="hover:text-rose-400 transition">Cementos y Agregados</a></li>
                <li><a href="#productos" className="hover:text-rose-400 transition">Aceros y Fierros</a></li>
                <li><a href="#productos" className="hover:text-rose-400 transition">Ladrillos y Bloques</a></li>
                <li><a href="#productos" className="hover:text-rose-400 transition">Herramientas de Obra</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Servicios GITLOVE</h5>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setIsCalcOpen(true)} className="hover:text-rose-400 transition">Calculadora de Materiales</button></li>
                <li><a href="#contacto" className="hover:text-rose-400 transition">Cotización al por Mayor</a></li>
                <li><a href="#contacto" className="hover:text-rose-400 transition">Despacho Express 24h</a></li>
                <li><a href="#contacto" className="hover:text-rose-400 transition">Crédito para Obras</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-slate-200 mb-3 uppercase tracking-wider text-[11px]">Boletín de Ofertas</h5>
              <p className="text-slate-400 mb-3 text-[11px]">Recibe promociones semanales en materiales de construcción.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-lg text-xs w-full text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button className="bg-rose-600 hover:bg-rose-700 px-3 py-2 rounded-lg font-bold text-white transition">
                  OK
                </button>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px] gap-4">
            <p>© {new Date().getFullYear()} GITLOVE Materiales de Construcción S.A.C. Todos los derechos reservados.</p>
            <p className="flex items-center gap-1">
              <span>Diseñado con pasión por</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span className="font-bold text-slate-400">GITLOVE</span>
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <CalculatorModal 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSendQuote={handleWhatsAppQuote}
      />
    </div>
  );
}
