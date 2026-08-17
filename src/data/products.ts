import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cementos',
    name: 'Cementos y Agregados',
    icon: 'Boxes',
    count: 24,
    description: 'Cemento Portland, arena fina, gruesa y hormigón de alta resistencia.',
    bgGradient: 'from-amber-500/10 to-orange-500/10 border-amber-200'
  },
  {
    id: 'aceros',
    name: 'Aceros y Varillas',
    icon: 'Layers',
    count: 18,
    description: 'Fierros corrugados, mallas electrosoldadas y clavos de construcción.',
    bgGradient: 'from-slate-500/10 to-zinc-500/10 border-slate-200'
  },
  {
    id: 'ladrillos',
    name: 'Ladrillos y Bloques',
    icon: 'Building2',
    count: 15,
    description: 'Ladrillos King Kong, pandereta, techo y bloques de concreto.',
    bgGradient: 'from-rose-500/10 to-red-500/10 border-rose-200'
  },
  {
    id: 'herramientas',
    name: 'Herramientas y Equipos',
    icon: 'Wrench',
    count: 32,
    description: 'Rotomartillos, mezcladoras, carretillas y herramientas manuales.',
    bgGradient: 'from-blue-500/10 to-indigo-500/10 border-blue-200'
  },
  {
    id: 'pinturas',
    name: 'Pinturas y Acabados',
    icon: 'Paintbrush',
    count: 28,
    description: 'Esmaltes, látex lavable, impermeabilizantes y selladores.',
    bgGradient: 'from-pink-500/10 to-rose-500/10 border-pink-200'
  },
  {
    id: 'plomeria',
    name: 'Electricidad y Plomería',
    icon: 'Zap',
    count: 40,
    description: 'Tubos PVC, cables de cobre, tableros y conexiones sanitarias.',
    bgGradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-200'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Cemento Portland Tipo I Extra Fuerte (42.5 kg)',
    category: 'cementos',
    price: 8.50,
    unit: 'saco',
    rating: 4.9,
    reviews: 142,
    stock: 250,
    featured: true,
    badge: 'Más Vendido',
    description: 'Ideal para columnas, vigas, cimentaciones y techos de alta resistencia estructural.',
    specs: ['Norma ASTM C-150', 'Fraguado rápido 45 min', 'Resistencia 42.5 MPa'],
    colorGradient: 'from-slate-700 to-slate-900'
  },
  {
    id: 'prod-2',
    name: 'Varilla de Acero Corrugado 1/2" x 12m G60',
    category: 'aceros',
    price: 13.20,
    unit: 'varilla',
    rating: 4.8,
    reviews: 98,
    stock: 500,
    featured: true,
    badge: 'Oferta GITLOVE',
    description: 'Acero de construcción dúctil y sismorresistente con excelente adherencia al concreto.',
    specs: ['Grado 60', 'Diámetro 1/2 pulgada', 'Longitud 12 metros'],
    colorGradient: 'from-zinc-600 to-slate-800'
  },
  {
    id: 'prod-3',
    name: 'Ladrillo King Kong 18 Huecos Estructural',
    category: 'ladrillos',
    price: 0.75,
    unit: 'unidad',
    rating: 4.7,
    reviews: 86,
    stock: 4500,
    featured: true,
    badge: 'Garantizado',
    description: 'Ladrillo de arcilla cocida para muros portantes de alta resistencia térmica y acústica.',
    specs: ['Medida: 24x12x9 cm', 'Absorción < 15%', 'Resistencia 130 kg/cm²'],
    colorGradient: 'from-rose-600 to-red-800'
  },
  {
    id: 'prod-4',
    name: 'Arena Gruesa Clasificada Lavada (m³)',
    category: 'cementos',
    price: 22.00,
    unit: 'm³',
    rating: 4.6,
    reviews: 54,
    stock: 80,
    featured: false,
    description: 'Arena libre de impurezas y sales, óptima para asentado de ladrillos y vaciado de losas.',
    specs: ['Granulometría controlada', 'Sin materia orgánica', 'Entrega en volquete'],
    colorGradient: 'from-amber-600 to-yellow-800'
  },
  {
    id: 'prod-5',
    name: 'Rotomartillo SDS Plus 800W + Kit Brocas',
    category: 'herramientas',
    price: 89.90,
    unit: 'equipo',
    rating: 4.9,
    reviews: 110,
    stock: 35,
    featured: true,
    badge: 'Top Herramientas',
    description: 'Potente perforador con función de cincelado para concreto y mampostería pesada.',
    specs: ['800 Watts de potencia', 'Energía de impacto 2.7 J', 'Incluye maletín de transporte'],
    colorGradient: 'from-blue-600 to-indigo-900'
  },
  {
    id: 'prod-6',
    name: 'Pintura Látex Anti-Humedad GITLOVE Pro (5 Gal)',
    category: 'pinturas',
    price: 64.50,
    unit: 'balde',
    rating: 5.0,
    reviews: 67,
    stock: 60,
    featured: true,
    badge: 'Exclusivo',
    description: 'Fórmula lavable de máximo cubrimiento con tecnología antihongos y protección UV.',
    specs: ['Rendimiento 120 m²', 'Secado al tacto 30 min', 'Acabado mate satinado'],
    colorGradient: 'from-rose-500 to-pink-700'
  },
  {
    id: 'prod-7',
    name: 'Tubo PVC Presión 1/2" C-10 para Agua Fría',
    category: 'plomeria',
    price: 4.20,
    unit: 'tubo 5m',
    rating: 4.7,
    reviews: 43,
    stock: 300,
    featured: false,
    description: 'Tuberia de alta presión resistente a la corrosión para instalaciones sanitarias internas.',
    specs: ['Longitud 5.0m', 'Clase 10 - 145 PSI', 'Empalme simple espiga'],
    colorGradient: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'prod-8',
    name: 'Carretilla de Obra Reforzada 150L Neumática',
    category: 'herramientas',
    price: 48.00,
    unit: 'unidad',
    rating: 4.8,
    reviews: 79,
    stock: 25,
    featured: false,
    description: 'Chasis de tubo de acero continuo con tolva esmaltada resistente a impactos en obra.',
    specs: ['Capacidad 150 Litros', 'Rueda neumática 16"', 'Soporta hasta 220 kg'],
    colorGradient: 'from-orange-600 to-red-900'
  }
];
