import React from 'react';
import { SAMPLE_CASES } from '../data/sampleCases';
import { Form210Declaration } from '../types/tax';
import { FileText, Printer, RotateCcw, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { formatCOP } from '../utils/formatters';

interface HeaderProps {
  declaration: Form210Declaration;
  onLoadSample: (id: string) => void;
  onReset: () => void;
  onUpdateUVT: (val: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  declaration,
  onLoadSample,
  onReset,
  onUpdateUVT,
  activeTab,
  setActiveTab,
  onPrint,
}) => {
  const [showConfigUVT, setShowConfigUVT] = React.useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-lg sticky top-0 z-40">
      {/* Barra superior institucional */}
      <div className="bg-emerald-800 text-emerald-100 text-[11px] px-4 py-1 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-700/50">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold uppercase tracking-wider">
            República de Colombia • DIAN • Estatuto Tributario Vigente 2026
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span>Año Gravable: <strong className="text-white">2025</strong></span>
          <span className="text-emerald-300">|</span>
          <button
            onClick={() => setShowConfigUVT(!showConfigUVT)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-600/40"
          >
            <Sliders className="w-3 h-3" />
            <span>UVT 2025: <strong className="text-white">{formatCOP(declaration.uvtValue)}</strong></span>
          </button>
        </div>
      </div>

      {/* Editor rápido de UVT si está abierto */}
      {showConfigUVT && (
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-2.5 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-emerald-400">Ajuste de Parámetro UVT:</span>
            <span>El valor fijado para el AG 2025 es de $49.799 (Res. DIAN). Puedes ajustarlo para simulaciones:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={declaration.uvtValue}
              onChange={(e) => onUpdateUVT(parseInt(e.target.value, 10) || 49799)}
              className="bg-slate-900 border border-slate-600 rounded px-2.5 py-1 text-right font-mono text-white text-xs w-28 focus:border-emerald-500"
            />
            <button
              onClick={() => {
                onUpdateUVT(49799);
                setShowConfigUVT(false);
              }}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px]"
            >
              Restablecer Oficial ($49.799)
            </button>
            <button
              onClick={() => setShowConfigUVT(false)}
              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Banner Principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40 border border-emerald-500/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                Liquidador Formulario 210 DIAN
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded uppercase">
                AG 2025
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Declaración de Renta Personas Naturales • Ley 2277 de 2022 y normas vigentes a 2026
            </p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cargar Casos de Ejemplo */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cargar Caso de Ejemplo</span>
            </button>
            <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 hidden group-hover:block z-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Perfiles Preconfigurados:
              </div>
              {SAMPLE_CASES.map((caso) => (
                <button
                  key={caso.id}
                  onClick={() => onLoadSample(caso.id)}
                  className="w-full text-left px-2.5 py-2 rounded-md hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex flex-col"
                >
                  <span className="font-semibold text-emerald-400">{caso.nombre}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {caso.perfil}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Botón Imprimir / PDF */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-colors"
            title="Imprimir liquidación oficial en formato PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          {/* Botón Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 border border-slate-700 text-xs text-slate-300 transition-colors"
            title="Reiniciar campos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </div>

      {/* Barra de Pestañas de Navegación */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'trabajo', label: '1. Rentas Trabajo', icon: '💼' },
            { id: 'capital', label: '2. Rentas Capital', icon: '📈' },
            { id: 'nolaboral', label: '3. Rentas No Laborales', icon: '🏪' },
            { id: 'pensiones', label: '4. Pensiones', icon: '👴' },
            { id: 'dividendos', label: '5. Dividendos', icon: '📊' },
            { id: 'ganancias', label: '6. Ganancias Ocasionales', icon: '🏠' },
            { id: 'patrimonio', label: 'Patrimonio & Deudas', icon: '🏛️' },
            { id: 'liquidacion', label: 'Liquidación & Anticipo', icon: '⚖️' },
            { id: 'formulario210', label: 'Formulario 210 Oficial', icon: '📋', badge: 'DIAN' },
            { id: 'auditoria', label: 'Auditoría & Obligatoriedad', icon: '🔍' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-t-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white border-emerald-500 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
