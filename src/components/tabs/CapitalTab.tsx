import React from 'react';
import { Form210Declaration, RentasCapitalCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { TrendingUp, Building2, Coins, ShieldCheck } from 'lucide-react';

interface CapitalTabProps {
  declaration: Form210Declaration;
  onUpdateCapital: (data: Partial<Form210Declaration['rentasCapital']>) => void;
  calc: RentasCapitalCalculation;
}

export const CapitalTab: React.FC<CapitalTabProps> = ({
  declaration,
  onUpdateCapital,
  calc,
}) => {
  const { rentasCapital, uvtValue } = declaration;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-700 text-white uppercase">
              Cédula General
            </span>
            <h3 className="text-sm font-bold text-blue-950">
              Subcédula de Rentas de Capital (Arts. 335 y 336 E.T.)
            </h3>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed">
            Comprende intereses, rendimientos financieros, arrendamientos de bienes muebles e inmuebles, regalías y explotación de propiedad intelectual. Permite restar costos y gastos procedentes debidamente soportados.
          </p>
        </div>
        <div className="bg-white/80 border border-blue-300 rounded-lg p-2.5 shrink-0 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Renta Líquida de Capital:
          </span>
          <span className="text-base font-extrabold text-blue-700 font-mono">
            {formatCOP(calc.rentaLiquidaCapital)}
          </span>
        </div>
      </div>

      {/* 1. Ingresos Brutos de Capital */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Coins className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Ingresos Brutos de Capital (Renglón 58 Formulario 210)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <TaxInput
            label="Arrendamientos (Inmuebles y muebles)"
            sublabel="Cánones de arrendamiento percibidos por vivienda, locales, oficinas o bodegas."
            value={rentasCapital.arrendamientos}
            onChange={(val) => onUpdateCapital({ arrendamientos: val })}
            uvtValue={uvtValue}
            legalRef="Art. 335 E.T."
          />
          <TaxInput
            label="Intereses y rendimientos financieros"
            sublabel="Certificados por bancos, fondos de inversión, CDTs, pagarés y préstamos."
            value={rentasCapital.interesesYRendimientosFinancieros}
            onChange={(val) => onUpdateCapital({ interesesYRendimientosFinancieros: val })}
            uvtValue={uvtValue}
            legalRef="Art. 335 E.T."
          />
          <TaxInput
            label="Regalías y explotación de propiedad intelectual"
            sublabel="Derechos de autor, patentes, marcas y propiedad industrial."
            value={rentasCapital.regaliasYPropiedadIntelectual}
            onChange={(val) => onUpdateCapital({ regaliasYPropiedadIntelectual: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="Otros ingresos de capital"
            sublabel="Otros rendimientos o beneficios económicos derivados de activos de capital."
            value={rentasCapital.otrosIngresosCapital}
            onChange={(val) => onUpdateCapital({ otrosIngresosCapital: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="Rentas de capital del exterior"
            sublabel="Rendimientos financieros o rentas de activos ubicados en el exterior."
            value={rentasCapital.ingresosExteriorCapital}
            onChange={(val) => onUpdateCapital({ ingresosExteriorCapital: val })}
            uvtValue={uvtValue}
            legalRef="Art. 9 y 10 E.T."
          />
        </div>
      </div>

      {/* 2. Ingresos No Constitutivos de Renta (INCRNGO) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Ingresos No Constitutivos de Renta (INCRNGO) (Renglón 59)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TaxInput
            label="Componente inflacionario de rendimientos"
            sublabel="Porcentaje no constitutivo de renta fijado anualmente por decreto reglamentario."
            value={rentasCapital.componenteInflacionario}
            onChange={(val) => onUpdateCapital({ componenteInflacionario: val })}
            uvtValue={uvtValue}
            legalRef="Arts. 38 - 41 E.T."
          />
          <TaxInput
            label="Aportes a Seguridad Social como independiente"
            sublabel="Salud y pensión pagados mediante planilla PILA sobre rentas de capital."
            value={rentasCapital.aportesSeguridadSocialCapital}
            onChange={(val) => onUpdateCapital({ aportesSeguridadSocialCapital: val })}
            uvtValue={uvtValue}
            legalRef="Arts. 55 y 56 E.T."
          />
          <TaxInput
            label="Otros INCRNGO de capital"
            sublabel="Otros conceptos no constitutivos de renta ni ganancia ocasional."
            value={rentasCapital.otrosIncrngoCapital}
            onChange={(val) => onUpdateCapital({ otrosIncrngoCapital: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>

      {/* 3. Costos y Gastos Procedentes */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Costos y Deducciones Procedentes (Renglón 60 Formulario 210)
          </h4>
        </div>
        <p className="text-xs text-slate-600">
          Gastos indispensables con relación de causalidad con la generación del ingreso: cuotas de administración de inmuebles arrendados, reparaciones locativas, comisiones inmobiliarias, impuesto predial y seguros. Deben contar con factura electrónica de venta o documento soporte electrónico.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Total costos y gastos procedentes soportados"
            sublabel="Gastos directos de los inmuebles o activos productores de renta."
            value={rentasCapital.costosProcedentesCapital}
            onChange={(val) => onUpdateCapital({ costosProcedentesCapital: val })}
            uvtValue={uvtValue}
            legalRef="Art. 107 E.T."
            highlight={true}
          />
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between text-xs font-mono">
          <span className="text-slate-600">Renta Líquida Ordinaria de Capital (Ingreso Neto - Costos):</span>
          <strong className="text-slate-900">{formatCOP(calc.rentaLiquidaOrdinaria)}</strong>
        </div>
      </div>

      {/* 4. Deducciones y Rentas Exentas */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          4. Rentas Exentas y Deducciones Imputables (Renglón 62)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TaxInput
            label="50% del GMF soportado en cuentas de capital"
            sublabel="Gravamen a los movimientos financieros de cuentas dedicadas a la actividad."
            value={rentasCapital.gmfDeducibleCapital}
            onChange={(val) => onUpdateCapital({ gmfDeducibleCapital: val })}
            uvtValue={uvtValue}
            legalRef="Art. 115 E.T."
          />
          <TaxInput
            label="Intereses de vivienda imputados a capital"
            sublabel="Si no se imputaron en la cédula laboral."
            value={rentasCapital.interesesViviendaCapital}
            onChange={(val) => onUpdateCapital({ interesesViviendaCapital: val })}
            uvtValue={uvtValue}
            legalRef="Art. 119 E.T."
          />
          <TaxInput
            label="Otras deducciones y rentas exentas"
            sublabel="Otras exenciones autorizadas expresamente por el Estatuto Tributario."
            value={rentasCapital.otrasDeduccionesCapital}
            onChange={(val) => onUpdateCapital({ otrasDeduccionesCapital: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>
    </div>
  );
};
