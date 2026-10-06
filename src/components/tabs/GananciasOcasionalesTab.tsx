import React from 'react';
import { Form210Declaration, GananciasOcasionalesCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { Home, Gift, Dices, Percent, HelpCircle } from 'lucide-react';

interface GananciasOcasionalesTabProps {
  declaration: Form210Declaration;
  onUpdateGanancias: (data: Partial<Form210Declaration['gananciasOcasionales']>) => void;
  calc: GananciasOcasionalesCalculation;
}

export const GananciasOcasionalesTab: React.FC<GananciasOcasionalesTabProps> = ({
  declaration,
  onUpdateGanancias,
  calc,
}) => {
  const { gananciasOcasionales, uvtValue } = declaration;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-700 text-white uppercase">
              Impuesto Complementario
            </span>
            <h3 className="text-sm font-bold text-rose-950">
              Ganancias Ocasionales (Arts. 300 al 317 E.T. - Ley 2277)
            </h3>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed">
            Grava ingresos extraordinarios como la venta de activos fijos poseídos por 2 o más años, herencias, legados, donaciones y loterías. La <strong>tarifa general es del 15%</strong> (Ley 2277 de 2022) y para <strong>loterías y rifas del 20%</strong>.
          </p>
        </div>
        <div className="bg-white/80 border border-rose-300 rounded-lg p-2.5 shrink-0 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Impuesto Ganancias Ocasionales:
          </span>
          <span className="text-base font-extrabold text-rose-700 font-mono">
            {formatCOP(calc.totalImpuestoGananciasOcasionales)}
          </span>
        </div>
      </div>

      {/* Tarifas vigentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 block">Tarifa General (Venta activos, herencias, donaciones):</span>
            <span className="text-slate-500 text-[11px]">Modificada por Ley 2277 de 2022 (era del 10%).</span>
          </div>
          <span className="text-base font-extrabold text-rose-600 font-mono bg-rose-50 px-2 py-1 rounded border border-rose-200">
            15%
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 block">Tarifa Loterías, Rifas y Apuestas:</span>
            <span className="text-slate-500 text-[11px]">Artículo 317 del Estatuto Tributario.</span>
          </div>
          <span className="text-base font-extrabold text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
            20%
          </span>
        </div>
      </div>

      {/* 1. Venta de Activos Fijos */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Home className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Venta de Activos Fijos Poseídos por 2 o más Años (Inmuebles, Vehículos)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Precio de venta / enajenación del activo"
            sublabel="Valor en escritura pública o contrato de venta en 2025."
            value={gananciasOcasionales.ventaActivosFijosPoseidos2MasAnos}
            onChange={(val) => onUpdateGanancias({ ventaActivosFijosPoseidos2MasAnos: val })}
            uvtValue={uvtValue}
            legalRef="Art. 300 E.T."
            highlight={true}
          />
          <TaxInput
            label="Costo fiscal del activo vendido (Renglón 112)"
            sublabel="Costo de adquisición ajustado o avalúo catastral del año anterior (Art. 72 / 73 E.T.)."
            value={gananciasOcasionales.costoFiscalActivosVendidos}
            onChange={(val) => onUpdateGanancias({ costoFiscalActivosVendidos: val })}
            uvtValue={uvtValue}
            legalRef="Art. 69 al 73 E.T."
          />
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between text-xs font-mono">
          <span className="text-slate-600">Utilidad / Ganancia Bruta por Venta de Activo:</span>
          <strong className="text-slate-900">
            {formatCOP(Math.max(0, gananciasOcasionales.ventaActivosFijosPoseidos2MasAnos - gananciasOcasionales.costoFiscalActivosVendidos))}
          </strong>
        </div>
      </div>

      {/* 2. Otras Ganancias Ocasionales */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Gift className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Herencias, Donaciones, Seguros y Premios (Renglón 111)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TaxInput
            label="Herencias, legados y donaciones"
            sublabel="Bienes o dineros recibidos a título gratuito por sucesión o donación."
            value={gananciasOcasionales.herenciasLegadosDonaciones}
            onChange={(val) => onUpdateGanancias({ herenciasLegadosDonaciones: val })}
            uvtValue={uvtValue}
            legalRef="Art. 302 E.T."
          />
          <TaxInput
            label="Indemnizaciones por seguros de vida"
            sublabel="Sumas pagadas por compañías de seguros con ocasión del fallecimiento del asegurado."
            value={gananciasOcasionales.indemnizacionesSegurosVida}
            onChange={(val) => onUpdateGanancias({ indemnizacionesSegurosVida: val })}
            uvtValue={uvtValue}
            legalRef="Art. 303-1 E.T."
          />
          <TaxInput
            label="Loterías, rifas, apuestas y premios (Tarifa 20%)"
            sublabel="Ganancias obtenidas en juegos de azar o concursos públicos."
            value={gananciasOcasionales.loteriasRifasApuestasPremios}
            onChange={(val) => onUpdateGanancias({ loteriasRifasApuestasPremios: val })}
            uvtValue={uvtValue}
            legalRef="Art. 317 E.T."
          />
        </div>
      </div>

      {/* 3. Ganancias Ocasionales Exentas */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Percent className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Ganancias Ocasionales Exentas y No Gravadas (Renglón 113)
          </h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Beneficios legales aplicables:
          <br />• <strong>Art. 311-1 E.T.:</strong> Primeras <strong>5.000 UVT</strong> ({formatCOP(5000 * uvtValue)}) de la utilidad en la venta de la casa o apartamento de habitación, condicionada a reinversión en nueva vivienda o pago hipotecario.
          <br />• <strong>Art. 307 E.T.:</strong> Primeras <strong>13.000 UVT</strong> de vivienda urbana del causante, y primeras <strong>3.250 UVT</strong> ({formatCOP(3250 * uvtValue)}) por porción conyugal o asignación hereditaria.
          <br />• <strong>Art. 303-1 E.T.:</strong> Primeras <strong>3.250 UVT</strong> en indemnizaciones de seguros de vida.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Total Ganancias Ocasionales Exentas certificadas"
            sublabel="Valor computable como exención legal soportada."
            value={gananciasOcasionales.gananciasOcasionalesExentasYNoGravadas}
            onChange={(val) => onUpdateGanancias({ gananciasOcasionalesExentasYNoGravadas: val })}
            uvtValue={uvtValue}
            legalRef="Arts. 307 y 311-1 E.T."
          />
        </div>
      </div>
    </div>
  );
};
