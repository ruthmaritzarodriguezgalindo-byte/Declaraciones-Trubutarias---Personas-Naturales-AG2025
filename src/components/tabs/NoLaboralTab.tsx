import React from 'react';
import { Form210Declaration, RentasNoLaboralesCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { Store, ShoppingBag, Truck, Receipt } from 'lucide-react';

interface NoLaboralTabProps {
  declaration: Form210Declaration;
  onUpdateNoLaboral: (data: Partial<Form210Declaration['rentasNoLaborales']>) => void;
  calc: RentasNoLaboralesCalculation;
}

export const NoLaboralTab: React.FC<NoLaboralTabProps> = ({
  declaration,
  onUpdateNoLaboral,
  calc,
}) => {
  const { rentasNoLaborales, uvtValue } = declaration;

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-700 text-white uppercase">
              Cédula General
            </span>
            <h3 className="text-sm font-bold text-amber-950">
              Subcédula de Rentas No Laborales (Arts. 335 y 336 E.T.)
            </h3>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Ingresos provenientes de comercio, industria, agricultura, servicios o actividades de profesionales independientes que contraten 2 o más trabajadores o decidan imputar costos y gastos procedentes en lugar de la renta exenta del 25%.
          </p>
        </div>
        <div className="bg-white/80 border border-amber-300 rounded-lg p-2.5 shrink-0 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Renta Líquida No Laboral:
          </span>
          <span className="text-base font-extrabold text-amber-800 font-mono">
            {formatCOP(calc.rentaLiquidaNoLaboral)}
          </span>
        </div>
      </div>

      {/* 1. Ingresos Brutos */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Store className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Ingresos Brutos No Laborales (Renglón 74 Formulario 210)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <TaxInput
            label="Ingresos por comercio, industria y servicios"
            sublabel="Ventas brutas de mercancías o servicios facturados en el año 2025."
            value={rentasNoLaborales.ingresosComercioIndustriaServicios}
            onChange={(val) => onUpdateNoLaboral({ ingresosComercioIndustriaServicios: val })}
            uvtValue={uvtValue}
            legalRef="Art. 335 E.T."
          />
          <TaxInput
            label="Otros ingresos no laborales"
            sublabel="Indemnizaciones, recuperaciones de deducciones y otros ingresos operativos."
            value={rentasNoLaborales.otrosIngresosNoLaborales}
            onChange={(val) => onUpdateNoLaboral({ otrosIngresosNoLaborales: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="(-) Devoluciones, rebajas y descuentos"
            sublabel="Devoluciones en ventas o descuentos comerciales concedidos (Renglón 75)."
            value={rentasNoLaborales.devolucionesRebajasDescuentos}
            onChange={(val) => onUpdateNoLaboral({ devolucionesRebajasDescuentos: val })}
            uvtValue={uvtValue}
            legalRef="Art. 26 E.T."
          />
        </div>
      </div>

      {/* 2. INCRNGO */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Receipt className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Ingresos No Constitutivos de Renta (INCRNGO) (Renglón 76)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Aportes a Seguridad Social como independiente"
            sublabel="Salud y pensión obligatorias pagadas sobre el IBC de la actividad no laboral."
            value={rentasNoLaborales.aportesSeguridadSocialNoLaboral}
            onChange={(val) => onUpdateNoLaboral({ aportesSeguridadSocialNoLaboral: val })}
            uvtValue={uvtValue}
            legalRef="Arts. 55 y 56 E.T."
          />
          <TaxInput
            label="Otros INCRNGO no laborales"
            sublabel="Otros ingresos no gravados vinculados a la actividad."
            value={rentasNoLaborales.otrosIncrngoNoLaborales}
            onChange={(val) => onUpdateNoLaboral({ otrosIncrngoNoLaborales: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>

      {/* 3. Costos y Deducciones Procedentes */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Truck className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Costos y Deducciones Procedentes (Renglón 77 Formulario 210)
          </h4>
        </div>
        <p className="text-xs text-slate-600">
          Costo de ventas de inventarios, nómina con nómina electrónica, servicios públicos del local/oficina, compras de materias primas e insumos. <strong>Deben estar soportados con Factura Electrónica de Venta o Documento Soporte Electrónico</strong> (Art. 771-2 y 771-5 E.T.).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Total costos y gastos imputables soportados"
            sublabel="Compras, nómina, arriendos operativos y gastos comerciales con soporte."
            value={rentasNoLaborales.costosProcedentesNoLaborales}
            onChange={(val) => onUpdateNoLaboral({ costosProcedentesNoLaborales: val })}
            uvtValue={uvtValue}
            legalRef="Art. 107 E.T."
            highlight={true}
          />
        </div>
        <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between text-xs font-mono">
          <span className="text-slate-600">Renta Líquida Ordinaria No Laboral:</span>
          <strong className="text-slate-900">{formatCOP(calc.rentaLiquidaOrdinaria)}</strong>
        </div>
      </div>

      {/* 4. Deducciones y Rentas Exentas */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          4. Rentas Exentas y Deducciones Imputables (Renglón 79)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Deducciones imputables no laborales"
            sublabel="50% del GMF financiero y gravámenes legalmente deducibles."
            value={rentasNoLaborales.deduccionesImputablesNoLaborales}
            onChange={(val) => onUpdateNoLaboral({ deduccionesImputablesNoLaborales: val })}
            uvtValue={uvtValue}
            legalRef="Art. 115 E.T."
          />
          <TaxInput
            label="Rentas exentas de la actividad no laboral"
            sublabel="Incentivos de economía naranja residuales o actividades exentas de ley."
            value={rentasNoLaborales.rentasExentasNoLaborales}
            onChange={(val) => onUpdateNoLaboral({ rentasExentasNoLaborales: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>
    </div>
  );
};
