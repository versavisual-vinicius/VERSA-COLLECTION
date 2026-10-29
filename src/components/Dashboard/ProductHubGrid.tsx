import React from 'react';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
  iconName: 'gallery' | 'library' | 'studio' | 'settings';
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'client-gallery',
    name: 'Client Gallery',
    category: 'Apresentação & Entrega',
    description: 'Galerias editoriais para clientes com grade calculada, lightbox e download seguro.',
    href: '/',
    badge: 'Produção',
    iconName: 'gallery',
  },
  {
    id: 'photo-library',
    name: 'Biblioteca de Fotos',
    category: 'Acervo Global',
    description: 'Gestão unificada de fotos com filtros, tags e operações em lote entre coleções.',
    href: '/#photos',
    badge: 'Fase 15',
    iconName: 'library',
  },
  {
    id: 'studio-manager',
    name: 'Studio Manager',
    category: 'Segurança & Clientes',
    description: 'Gestão de senhas, PIN de download, e-mails autorizados e histórico de exportações.',
    href: '/?admin=true',
    badge: 'Autenticado',
    iconName: 'studio',
  },
  {
    id: 'brand-presets',
    name: 'Configurações de Marca',
    category: 'Design Editorial',
    description: 'Tokens visuais, paleta institucional Teal/Petróleo, tipografia Outfit e assinatura @v1ncsc.',
    href: '/?admin=true#theme',
    badge: 'Versa Visual',
    iconName: 'settings',
  },
];

interface ProductHubGridProps {
  onNavigate?: (href: string) => void;
}

export const ProductHubGrid: React.FC<ProductHubGridProps> = ({ onNavigate }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <div data-testid="product-hub-grid" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-stone-100">
          Ecossistema de Produtos & Ferramentas
        </h2>
        <span className="text-xs text-stone-400 font-medium">
          4 módulos integrados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCTS.map((prod) => (
          <a
            key={prod.id}
            href={prod.href}
            onClick={(e) => handleClick(e, prod.href)}
            className="group relative rounded-xl border border-stone-800 bg-[#0d1418]/60 p-5 transition-all duration-300 hover:border-[#5E7F8C]/60 hover:bg-[#0d1418]/95 hover:shadow-xl hover:shadow-[#5E7F8C]/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5E7F8C]">
                  {prod.category}
                </span>
                {prod.badge && (
                  <span className="rounded-full bg-stone-800/90 px-2.5 py-0.5 text-[10px] font-medium text-stone-300 border border-stone-700/60">
                    {prod.badge}
                  </span>
                )}
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-100 group-hover:text-teal-300 transition-colors">
                {prod.name}
              </h3>
              <p className="mt-1.5 text-xs text-stone-400 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="mt-4 flex items-center text-xs font-semibold text-[#5E7F8C] group-hover:text-teal-400 pt-3 border-t border-stone-800/60">
              <span>Acessar módulo</span>
              <svg
                className="w-4 h-4 ml-1.5 transform transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
