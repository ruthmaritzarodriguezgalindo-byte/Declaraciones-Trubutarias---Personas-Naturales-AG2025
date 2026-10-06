import React from 'react';
import { Form210Declaration, RentasPensionesCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { HeartPulse, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PensionTabProps {
  declaration: Form210Declaration;
  onUpdatePension: (data: Partial<Form210Declaration['rentasPensiones']>) => void;
  calc: RentasPensionesCalculation;
}

export const PensionTab: React.FC<PensionTabProps> = ({
  declaration,
  onUpdatePension,
  calc,
}) => {
  const { rentasPensiones, uvtValue } = declaration;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-700 text-white uppercase">
              Cédula Independiente
            </span>
            <h3 className="text-sm font-bold text-purple-950">
              Cédula de Rentas de Pensiones (Arts. 337 y 206 #9 E.T.)
            </h3>
          </div>
          <p className="text-xs text-purple-800 leading-relaxed">
            Comprende mesadas pensionales de jubilación, vejez, invalidez, sobrevivientes y riesgos laborales. Gozan de una exención de hasta <strong>1.000 UVT mensuales (12.000 UVT anuales = {formatCOP(12000 * uvtValue)})</strong>.
          </p>
        </div>
        <div className="bg-white/80 border border-purple-300 rounded-lg p-2.5 shrink-0 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Renta Líquida Gravable:
          </span>
          <span className="text-base font-extrabold text-purple-800 font-mono">
            {formatCOP(calc.rentaLiquidaGravablePensiones)}
          </span>
        </div>
      </div>

      {/* Regla de exención destacada */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Exención de 1.000 UVT Mensuales (Art. 206 Numeral 9 del Estatuto Tributario)</span>
        </div>
        <p className="text-xs text-slate-600">
          En Colombia, las pensiones no pagan impuesto sobre la renta salvo que la mesada individual supere los 1.000 UVT mensuales ($49.799.000 COP mensuales en 2025). La gran mayoría de los pensionados tienen un impuesto liquidado de $0 en esta cédula.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          Ingresos Pensionales (Renglón 98 Formulario 210)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <TaxInput
            label="Pensiones de jubilación y vejez en Colombia"
            sublabel="Total mesadas ordinarias y adicionales (prima de junio/diciembre)."
            value={rentasPensiones.pensionesJubilacionVejezColombia}
            onChange={(val) => onUpdatePension({ pensionesJubilacionVejezColombia: val })}
            uvtValue={uvtValue}
            legalRef="Art. 337 E.T."
          />
          <TaxInput
            label="Pensiones de invalidez y sobrevivientes"
            sublabel="Pagadas por aseguradoras de vida o fondos de pensiones."
            value={rentasPensiones.pensionesInvalidezSobrevivientes}
            onChange={(val) => onUpdatePension({ pensionesInvalidezSobrevivientes: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="Pensiones percibidas del exterior"
            sublabel="Pensiones foráneas recibidas por residentes fiscales (verificar CDI)."
            value={rentasPensiones.pensionesExterior}
            onChange={(val) => onUpdatePension({ pensionesExterior: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>

      {/* Deducciones e INCRNGO */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          INCRNGO y Rentas Exentas (Renglones 99 y 100)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Aportes a Salud descontados de la pensión (Renglón 99)"
            sublabel="Descuentos obligatorios del 4%, 10% o 12% para EPS."
            value={rentasPensiones.aportesSaludPensionados}
            onChange={(val) => onUpdatePension({ aportesSaludPensionados: val })}
            uvtValue={uvtValue}
            legalRef="Art. 56 E.T."
          />
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Renta Exenta Automática Aplicada (Renglón 100)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Hasta 12.000 UVT anuales ({formatCOP(12000 * uvtValue)}).
              </span>
            </div>
            <div className="mt-2 text-right">
              <span className="text-sm font-bold font-mono text-emerald-700">
                {formatCOP(calc.rentaExentaPensiones)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
