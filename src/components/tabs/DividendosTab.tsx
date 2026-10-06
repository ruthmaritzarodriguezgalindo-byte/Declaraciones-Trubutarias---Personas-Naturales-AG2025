import React from 'react';
import { Form210Declaration, DividendosCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { PieChart, Landmark, Scale, HelpCircle } from 'lucide-react';

interface DividendosTabProps {
  declaration: Form210Declaration;
  onUpdateDividendos: (data: Partial<Form210Declaration['dividendos']>) => void;
  calc: DividendosCalculation;
}

export const DividendosTab: React.FC<DividendosTabProps> = ({
  declaration,
  onUpdateDividendos,
  calc,
}) => {
  const { dividendos, uvtValue } = declaration;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-700 text-white uppercase">
              Cédula Especial
            </span>
            <h3 className="text-sm font-bold text-indigo-950">
              Cédula de Dividendos y Participaciones (Art. 242 E.T. - Ley 2277)
            </h3>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed">
            La Ley 2277 modificó el régimen de dividendos: las utilidades no gravadas recibidas a partir de 2017 se integran a la tarifa marginal de las personas naturales (Art. 241 E.T.), con derecho a un descuento tributario del 19% sobre el exceso de 1.090 UVT.
          </p>
        </div>
        <div className="bg-white/80 border border-indigo-300 rounded-lg p-2.5 shrink-0 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Renta Líquida Dividendos:
          </span>
          <span className="text-base font-extrabold text-indigo-800 font-mono">
            {formatCOP(calc.rentaLiquidaGravableDividendos)}
          </span>
        </div>
      </div>

      {/* Reglas Ley 2277 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Subcédula 1: Utilidades No Gravadas (2017 en adelante)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Se suman a la base de la tabla del Artículo 241 E.T. Si el valor supera <strong>1.090 UVT ({formatCOP(1090 * uvtValue)})</strong>, la persona natural tiene derecho a un <strong>descuento tributario del 19%</strong> sobre la parte que exceda dicho umbral (Art. 242 y 254-1 E.T.).
          </p>
          {calc.descuentoMarginalArt242 > 0 && (
            <div className="p-2 rounded bg-indigo-50 border border-indigo-100 text-xs font-mono text-indigo-900 font-bold flex justify-between">
              <span>Descuento tributario generado (19%):</span>
              <span>{formatCOP(calc.descuentoMarginalArt242)}</span>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Landmark className="w-4 h-4 text-purple-600" />
            <span>Subcédula 2: Utilidades Gravadas (2017 en adelante)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Se gravan primero a la tarifa societaria general del <strong>35%</strong> (Renglón 123 Formulario 210). El 65% restante se traslada para ser gravado con la tabla del Artículo 241 E.T.
          </p>
          {calc.impuestoDirectoSubcedula2_35 > 0 && (
            <div className="p-2 rounded bg-purple-50 border border-purple-100 text-xs font-mono text-purple-900 font-bold flex justify-between">
              <span>Impuesto 35% societario liquidado:</span>
              <span>{formatCOP(calc.impuestoDirectoSubcedula2_35)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          Dividendos Recibidos en el Año Gravable 2025
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="1. Dividendos año 2017 y siguientes NO gravados (Renglón 104)"
            sublabel="Certificados por la sociedad como procedentes de utilidades no gravadas (Art. 49 #3 E.T.)."
            value={dividendos.subcedula1_2017EnAdelanteNoGravados}
            onChange={(val) => onUpdateDividendos({ subcedula1_2017EnAdelanteNoGravados: val })}
            uvtValue={uvtValue}
            legalRef="Art. 242 E.T."
            highlight={true}
          />
          <TaxInput
            label="2. Dividendos año 2017 y siguientes GRAVADOS (Renglón 105)"
            sublabel="Certificados como gravados en cabeza de los accionistas (Art. 49 #2 E.T.)."
            value={dividendos.subcedula2_2017EnAdelanteGravados}
            onChange={(val) => onUpdateDividendos({ subcedula2_2017EnAdelanteGravados: val })}
            uvtValue={uvtValue}
            legalRef="Art. 242 inc. 2"
          />
          <TaxInput
            label="3. Dividendos año 2016 y anteriores (No gravados)"
            sublabel="Régimen de transición para dividendos antiguos antes de la Ley 1819."
            value={dividendos.dividendos2016YAnterioresNoGravados}
            onChange={(val) => onUpdateDividendos({ dividendos2016YAnterioresNoGravados: val })}
            uvtValue={uvtValue}
            legalRef="Art. 242-1 E.T."
          />
          <TaxInput
            label="4. Dividendos percibidos del exterior / Entidades Controladas (ECE)"
            sublabel="Dividendos de inversiones foráneas o entidades en el exterior (Art. 893 E.T.)."
            value={dividendos.dividendosECEYExterior}
            onChange={(val) => onUpdateDividendos({ dividendosECEYExterior: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>
    </div>
  );
};
