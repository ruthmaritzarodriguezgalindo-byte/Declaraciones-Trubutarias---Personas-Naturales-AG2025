import React from 'react';
import { ObligationEvaluation, ObligationData } from '../types/tax';
import { formatCOP } from '../utils/formatters';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ObligationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: ObligationEvaluation;
  obligationData: ObligationData;
  onUpdateObligation: (data: Partial<ObligationData>) => void;
  uvtValue: number;
}

export const ObligationModal: React.FC<ObligationModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  obligationData,
  onUpdateObligation,
  uvtValue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Verificador de Obligatoriedad de Declarar Renta AG 2025
              </h3>
              <p className="text-xs text-slate-400">
                Estatuto Tributario Nacional (Arts. 592 y 594-3) • Presentación en 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`p-4 border-b flex items-center gap-3 ${
            evaluation.obligadoADeclarar
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {evaluation.obligadoADeclarar ? (
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-bold">
              {evaluation.obligadoADeclarar
                ? 'ESTÁ OBLIGADO A DECLARAR RENTA POR EL AÑO GRAVABLE 2025'
                : 'NO ESTÁ OBLIGADO A DECLARAR RENTA POR EL AÑO GRAVABLE 2025'}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {evaluation.obligadoADeclarar
                ? 'Cumple con una o varias causales objetivas fijadas por la ley. La declaración no implica necesariamente impuesto a pagar.'
                : 'Ninguno de los topes monetarios ni condiciones formales de ley fueron superados durante el año gravable 2025.'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {evaluation.valoresYTopes.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  item.supera
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-slate-800">{item.nombre}</div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      item.supera
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {item.supera ? 'SUPERA TOPE (OBLIGADO)' : 'DENTRO DEL TOPE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Valor Registrado / Acumulado:</span>
                    <span className="font-bold text-slate-900">{formatCOP(item.valorActual)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      Tope de Ley ({item.topeUVT.toLocaleString('es-CO')} UVT):
                    </span>
                    <span className="font-bold text-slate-600">{formatCOP(item.topePesos)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Condición IVA */}
            <div
              className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                obligationData.esResponsableIVA
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div>
                <div className="font-semibold text-slate-800">
                  Responsable del Impuesto sobre las Ventas (IVA)
                </div>
                <div className="text-[11px] text-slate-500">
                  Las personas naturales responsables de IVA están obligadas a declarar sin importar los topes anteriores.
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={obligationData.esResponsableIVA}
                  onChange={(e) => onUpdateObligation({ esResponsableIVA: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">Sí es responsable</span>
              </label>
            </div>
          </div>

          {/* Ajuste manual de consumos bancarios y compras */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Verificación de información exógena bancaria (Consumos y depósitos)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Consumos Tarjeta Crédito:
                </label>
                <input
                  type="number"
                  value={obligationData.consumosTarjetaCredito || 0}
                  onChange={(e) =>
                    onUpdateObligation({ consumosTarjetaCredito: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-2 py-1 text-xs border rounded bg-white text-right font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Compras y consumos totales:
                </label>
                <input
                  type="number"
                  value={obligationData.comprasTotales || 0}
                  onChange={(e) =>
                    onUpdateObligation({ comprasTotales: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-2 py-1 text-xs border rounded bg-white text-right font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">
                  Consignaciones bancarias:
                </label>
                <input
                  type="number"
                  value={obligationData.consignacionesBancarias || 0}
                  onChange={(e) =>
                    onUpdateObligation({ consignacionesBancarias: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-2 py-1 text-xs border rounded bg-white text-right font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
