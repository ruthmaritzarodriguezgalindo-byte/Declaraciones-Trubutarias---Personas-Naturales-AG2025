import React from 'react';
import { Form210Declaration, LiquidacionPrivadaCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { Calculator, Scale, AlertOctagon, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { TABLA_ARTICULO_241 } from '../../data/taxConstants';

interface LiquidacionTabProps {
  declaration: Form210Declaration;
  onUpdateLiquidacion: (data: Partial<Form210Declaration['liquidacionAvanzada']>) => void;
  onUpdateTaxpayer: (data: Partial<Form210Declaration['taxpayer']>) => void;
  calc: LiquidacionPrivadaCalculation;
}

export const LiquidacionTab: React.FC<LiquidacionTabProps> = ({
  declaration,
  onUpdateLiquidacion,
  onUpdateTaxpayer,
  calc,
}) => {
  const { liquidacionAvanzada, taxpayer, uvtValue, uvt2026Value } = declaration;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
              Liquidación Privada
            </span>
            <h3 className="text-base font-bold text-white">
              Cálculo del Impuesto sobre la Renta y Saldo Definitivo
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Aplica la tabla del Artículo 241 del Estatuto Tributario, los descuentos autorizados, deducción de retenciones en la fuente, liquidación del anticipo del año 2026 y sanciones legales aplicables.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shrink-0 text-right min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            {calc.saldoAPagar > 0 ? 'Total a Pagar (Renglón 135):' : 'Saldo a Favor (Renglón 136):'}
          </span>
          <span
            className={`text-xl font-extrabold font-mono ${
              calc.saldoAPagar > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {calc.saldoAPagar > 0 ? formatCOP(calc.saldoAPagar) : formatCOP(calc.saldoAFavor)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            Impuesto a Cargo: {formatCOP(calc.totalImpuestoCargo)}
          </span>
        </div>
      </div>

      {/* 1. Base Gravable y Tabla del Artículo 241 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Base Gravable Consolidada e Impuesto Marginal (Art. 241 E.T.)
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-slate-800">
            Base: {formatCOP(calc.baseGravableArticulo241)} (≈ {calc.baseGravableArticulo241_UVT.toLocaleString('es-CO')} UVT)
          </span>
        </div>

        {/* Tabla interactiva de los tramos UVT */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold border-b">
                <th className="py-2 px-3">Rango UVT</th>
                <th className="py-2 px-3">Equivalente en Pesos 2025</th>
                <th className="py-2 px-3">Tarifa Marginal</th>
                <th className="py-2 px-3">Impuesto Fijo Base</th>
                <th className="py-2 px-3 text-right">Estado del Contribuyente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {TABLA_ARTICULO_241.map((tramo, idx) => {
                const isCurrent =
                  calc.baseGravableArticulo241_UVT > tramo.desdeUVT &&
                  (tramo.hastaUVT === null || calc.baseGravableArticulo241_UVT <= tramo.hastaUVT);

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-l-emerald-600'
                        : 'text-slate-600'
                    }`}
                  >
                    <td className="py-2 px-3">
                      {tramo.desdeUVT} {tramo.hastaUVT ? `a ${tramo.hastaUVT}` : 'en adelante'} UVT
                    </td>
                    <td className="py-2 px-3">
                      {formatCOP(tramo.desdeUVT * uvtValue)}{' '}
                      {tramo.hastaUVT ? `a ${formatCOP(tramo.hastaUVT * uvtValue)}` : ''}
                    </td>
                    <td className="py-2 px-3">
                      {tramo.tarifaMarginal > 0 ? `${(tramo.tarifaMarginal * 100).toFixed(0)}%` : '0%'}
                    </td>
                    <td className="py-2 px-3">
                      {tramo.impuestoBaseUVT > 0
                        ? `${tramo.impuestoBaseUVT} UVT (${formatCOP(tramo.impuestoBaseUVT * uvtValue)})`
                        : '$ 0'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Tramo Actual
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-slate-50 border flex justify-between items-center text-xs">
            <span className="text-slate-600">Impuesto según Tabla Art. 241 E.T.:</span>
            <strong className="text-slate-900 font-mono">{formatCOP(calc.impuestoArticulo241)}</strong>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border flex justify-between items-center text-xs">
            <span className="text-slate-600">Total Impuesto Rentas Líquidas (Renglón 124):</span>
            <strong className="text-slate-900 font-mono">{formatCOP(calc.impuestoTotalRentasLiquidas)}</strong>
          </div>
        </div>
      </div>

      {/* 2. Descuentos Tributarios */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Scale className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Descuentos Tributarios (Renglón 125 Formulario 210)
          </h4>
        </div>
        <p className="text-xs text-slate-600">
          Los descuentos tributarios restan directamente del impuesto de renta pero no pueden exceder el impuesto básico (Art. 259 E.T.).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TaxInput
            label="Donaciones a entidades del Régimen Especial (25%)"
            sublabel="Certificado de donación a ESAL autorizadas. Descuento es del 25%."
            value={liquidacionAvanzada.descuentoDonacionesArt257}
            onChange={(val) => onUpdateLiquidacion({ descuentoDonacionesArt257: val })}
            uvtValue={uvtValue}
            legalRef="Art. 257 E.T."
          />
          <TaxInput
            label="Impuestos pagados en el exterior"
            sublabel="Crédito fiscal por impuestos sobre rentas de fuente extranjera."
            value={liquidacionAvanzada.descuentoImpuestosExterior}
            onChange={(val) => onUpdateLiquidacion({ descuentoImpuestosExterior: val })}
            uvtValue={uvtValue}
            legalRef="Art. 254 E.T."
          />
          <TaxInput
            label="Otros descuentos tributarios legalmente autorizados"
            sublabel="Inversiones ambientales, investigación tecnológica, etc."
            value={liquidacionAvanzada.otrosDescuentosTributarios}
            onChange={(val) => onUpdateLiquidacion({ otrosDescuentosTributarios: val })}
            uvtValue={uvtValue}
          />
        </div>
        <div className="p-2.5 rounded bg-purple-50 border border-purple-200 flex justify-between text-xs font-mono">
          <span className="text-purple-900">Impuesto Neto de Renta (Renglón 126):</span>
          <strong className="text-purple-900">{formatCOP(calc.impuestoNetoDeRenta)}</strong>
        </div>
      </div>

      {/* 3. Retenciones en la Fuente y Créditos */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Retenciones en la Fuente y Saldos a Favor de Años Anteriores
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <TaxInput
            label="Retenciones en la fuente a título de renta (Renglón 132)"
            sublabel="Certificados de retención laboral (220), honorarios, arriendos, CDTs."
            value={liquidacionAvanzada.retencionesEnLaFuenteRenta2025}
            onChange={(val) => onUpdateLiquidacion({ retencionesEnLaFuenteRenta2025: val })}
            uvtValue={uvtValue}
            legalRef="Art. 373 E.T."
            highlight={true}
          />
          <TaxInput
            label="Retenciones por Ganancia Ocasional"
            sublabel="Retención practicada en notarías por venta de inmuebles (1%) o loterías."
            value={liquidacionAvanzada.retencionesGananciaOcasional}
            onChange={(val) => onUpdateLiquidacion({ retencionesGananciaOcasional: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="Anticipo de renta año 2024 para 2025 (Renglón 130)"
            sublabel="Liquidado en la declaración del año gravable 2024 (Renglón 133 de 2024)."
            value={liquidacionAvanzada.anticipoRentaAnoAnteriorPara2025}
            onChange={(val) => onUpdateLiquidacion({ anticipoRentaAnoAnteriorPara2025: val })}
            uvtValue={uvtValue}
            legalRef="Art. 807 E.T."
          />
          <TaxInput
            label="Saldo a favor año 2024 sin solicitud de devolución (Renglón 131)"
            sublabel="Saldo a favor que se arrastra de la declaración anterior (Renglón 136 de 2024)."
            value={liquidacionAvanzada.saldoAFavorAnoAnteriorSinDevolucion}
            onChange={(val) => onUpdateLiquidacion({ saldoAFavorAnoAnteriorSinDevolucion: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>

      {/* 4. Anticipo de Renta para el Año 2026 */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            4. Anticipo de Renta para el Año Gravable 2026 (Renglón 133 - Art. 807 E.T.)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Años declarando renta (Determina el porcentaje legal):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'primero', label: '1er Año', pct: '25%' },
                { id: 'segundo', label: '2do Año', pct: '50%' },
                { id: 'tercero_o_mas', label: '3er Año o más', pct: '75%' },
              ].map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => onUpdateTaxpayer({ anosDeclarando: op.id as any })}
                  className={`p-2 rounded border text-xs text-center transition-all ${
                    taxpayer.anosDeclarando === op.id
                      ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>{op.label}</div>
                  <div className="text-[10px] text-blue-600 font-mono mt-0.5">{op.pct}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Procedimiento de cálculo del anticipo:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateLiquidacion({ metodoAnticipo2026: 'procedimiento1' })}
                className={`p-2 rounded border text-xs text-left transition-all ${
                  liquidacionAvanzada.metodoAnticipo2026 === 'procedimiento1'
                    ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>Procedimiento 1</div>
                <div className="text-[10px] text-slate-500 font-normal">Base: Impuesto neto 2025</div>
              </button>
              <button
                type="button"
                onClick={() => onUpdateLiquidacion({ metodoAnticipo2026: 'procedimiento2' })}
                className={`p-2 rounded border text-xs text-left transition-all ${
                  liquidacionAvanzada.metodoAnticipo2026 === 'procedimiento2'
                    ? 'bg-blue-50 border-blue-500 font-bold text-blue-900 ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>Procedimiento 2</div>
                <div className="text-[10px] text-slate-500 font-normal">Base: Promedio 2024 y 2025</div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded bg-blue-50 border border-blue-200 flex justify-between items-center text-xs font-mono">
          <span className="text-blue-900 font-sans">Anticipo Calculado para 2026 (Base × % - Retenciones):</span>
          <strong className="text-blue-900">{formatCOP(calc.anticipoCalculado2026)}</strong>
        </div>
      </div>

      {/* 5. Sanciones */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <AlertOctagon className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            5. Régimen Sancionatorio (Renglón 134 - Arts. 639 y 641 E.T.)
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Meses o fracción de mes de extemporaneidad:
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={liquidacionAvanzada.diasMesesExtemporaneidad || 0}
              onChange={(e) =>
                onUpdateLiquidacion({ diasMesesExtemporaneidad: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full px-3 py-1.5 border rounded text-xs font-mono bg-white"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              5% por cada mes o fracción sobre el impuesto a cargo (mínimo 10 UVT 2026 = {formatCOP(10 * uvt2026Value)}).
            </p>
          </div>
          <div className="p-3 rounded bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
            <span className="text-xs text-amber-900 font-semibold">Sanción liquidada por el sistema:</span>
            <span className="text-base font-bold font-mono text-amber-900">
              {formatCOP(calc.sancionExtemporaneidad)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
