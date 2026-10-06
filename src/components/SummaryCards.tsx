import React from 'react';
import { CompleteTaxResult } from '../types/tax';
import { formatCOP } from '../utils/formatters';
import { TrendingUp, Wallet, ShieldAlert, Award, ArrowDownCircle, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  result: CompleteTaxResult;
  onOpenObligationModal: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ result, onOpenObligationModal }) => {
  const { liquidacion, conciliacion, obligacion, cedulaGeneral } = result;
  const isPagar = liquidacion.saldoAPagar > 0;
  const isFavor = liquidacion.saldoAFavor > 0;

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Patrimonio Líquido */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Patrimonio Líquido</span>
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-sm lg:text-base font-bold text-slate-900 font-mono">
              {formatCOP(conciliacion.patrimonioLiquidoAnoActual)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Bruto: {formatCOP(result.renglonesForm210['28'] as number)}
            </div>
          </div>

          {/* 2. Renta Líquida Gravable General */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">RLG Cédula General</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-sm lg:text-base font-bold text-slate-900 font-mono">
              {formatCOP(cedulaGeneral.rentaLiquidaGravableCedulaGeneral)}
            </div>
            <div className="text-[10px] text-blue-600 font-mono mt-0.5">
              ≈ {cedulaGeneral.rentaLiquidaGravableUVT.toLocaleString('es-CO')} UVT
            </div>
          </div>

          {/* 3. Total Impuesto a Cargo */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Impuesto a Cargo</span>
              <Award className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-sm lg:text-base font-bold text-slate-900 font-mono">
              {formatCOP(liquidacion.totalImpuestoCargo)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Renta: {formatCOP(liquidacion.impuestoNetoDeRenta)} | GO: {formatCOP(result.gananciasOcasionales.totalImpuestoGananciasOcasionales)}
            </div>
          </div>

          {/* 4. Retenciones y Créditos */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Retenciones / Anticipo</span>
              <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-sm lg:text-base font-bold text-emerald-700 font-mono">
              {formatCOP(liquidacion.totalRetenciones + (result.renglonesForm210['130'] as number))}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Ret: {formatCOP(liquidacion.totalRetenciones)} | Ant: {formatCOP(result.renglonesForm210['130'] as number)}
            </div>
          </div>

          {/* 5. Saldo Definitivo (Pagar o Favor) */}
          <div
            className={`border rounded-lg p-2.5 transition-all ${
              isPagar
                ? 'bg-rose-50/70 border-rose-300'
                : isFavor
                ? 'bg-emerald-50/70 border-emerald-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isPagar ? 'text-rose-700' : isFavor ? 'text-emerald-700' : 'text-slate-500'
                }`}
              >
                {isPagar ? 'Total a Pagar' : isFavor ? 'Saldo a Favor' : 'Saldo Neto'}
              </span>
              {isPagar ? (
                <ArrowUpCircle className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <div
              className={`text-sm lg:text-base font-extrabold font-mono ${
                isPagar ? 'text-rose-700' : isFavor ? 'text-emerald-700' : 'text-slate-800'
              }`}
            >
              {isPagar
                ? formatCOP(liquidacion.saldoAPagar)
                : isFavor
                ? formatCOP(liquidacion.saldoAFavor)
                : '$ 0'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
              Tasa efectiva: <strong className="text-slate-700">{liquidacion.tasaEfectivaTributacion}%</strong>
            </div>
          </div>

          {/* 6. Semáforo de Obligatoriedad */}
          <div
            onClick={onOpenObligationModal}
            className={`border rounded-lg p-2.5 cursor-pointer transition-all hover:shadow-sm ${
              obligacion.obligadoADeclarar
                ? 'bg-amber-50/80 border-amber-300 hover:border-amber-400'
                : 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  obligacion.obligadoADeclarar ? 'text-amber-800' : 'text-emerald-800'
                }`}
              >
                Obligado a Declarar
              </span>
              <ShieldAlert
                className={`w-3.5 h-3.5 ${
                  obligacion.obligadoADeclarar ? 'text-amber-600' : 'text-emerald-600'
                }`}
              />
            </div>
            <div
              className={`text-xs font-bold leading-tight ${
                obligacion.obligadoADeclarar ? 'text-amber-900' : 'text-emerald-900'
              }`}
            >
              {obligacion.obligadoADeclarar ? 'SÍ DECLARA AG 2025' : 'NO OBLIGADO'}
            </div>
            <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-1 underline decoration-dotted">
              Ver {obligacion.valoresYTopes.filter((v) => v.supera).length} causal(es) de ley →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
