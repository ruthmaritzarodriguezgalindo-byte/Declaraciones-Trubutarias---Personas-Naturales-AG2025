import React from 'react';
import { Form210Declaration, ConciliacionPatrimonialCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { Building, Car, CreditCard, Landmark, Wallet, AlertTriangle } from 'lucide-react';

interface PatrimonioTabProps {
  declaration: Form210Declaration;
  onUpdatePatrimonio: (data: Partial<Form210Declaration['patrimony']>) => void;
  calc: ConciliacionPatrimonialCalculation;
}

export const PatrimonioTab: React.FC<PatrimonioTabProps> = ({
  declaration,
  onUpdatePatrimonio,
  calc,
}) => {
  const { patrimony, uvtValue } = declaration;

  const totalBruto =
    patrimony.efectivoYEquivalentes +
    patrimony.cuentasBancarias +
    patrimony.inversionesYAcciones +
    patrimony.bienesRaices +
    patrimony.vehiculos +
    patrimony.otrosActivos;

  const totalDeudas = patrimony.deudasFinancieras + patrimony.otrasDeudas;
  const totalLiquido = Math.max(0, totalBruto - totalDeudas);

  return (
    <div className="space-y-6">
      {/* Header explicativo */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white uppercase">
              Renglones 28 al 30
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Patrimonio Fiscal a 31 de Diciembre de 2025 (Arts. 261 al 287 E.T.)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Los bienes deben declararse por su valor patrimonial o costo fiscal determinado según las normas de los Artículos 69 al 73 del E.T. (para inmuebles: el mayor entre costo de adquisición o avalúo catastral 2025).
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white border border-slate-300 rounded-lg p-2.5 text-right shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Patrimonio Bruto:
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {formatCOP(totalBruto)}
            </span>
          </div>
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-right shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              Patrimonio Líquido:
            </span>
            <span className="text-base font-extrabold text-emerald-700 font-mono">
              {formatCOP(totalLiquido)}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Activos (Patrimonio Bruto) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Landmark className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Bienes y Derechos Apreciables en Dinero (Patrimonio Bruto - Renglón 28)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <TaxInput
            label="Bienes Raíces (Inmuebles urbanos y rurales)"
            sublabel="Mayor entre costo fiscal o avalúo catastral del predial 2025 (Art. 72 E.T.)."
            value={patrimony.bienesRaices}
            onChange={(val) => onUpdatePatrimonio({ bienesRaices: val })}
            uvtValue={uvtValue}
            legalRef="Art. 72 E.T."
            highlight={true}
          />
          <TaxInput
            label="Cuentas corrientes, ahorros y depósitos"
            sublabel="Saldo certificado por bancos y corporaciones financieras a 31 de dic de 2025."
            value={patrimony.cuentasBancarias}
            onChange={(val) => onUpdatePatrimonio({ cuentasBancarias: val })}
            uvtValue={uvtValue}
            legalRef="Art. 268 E.T."
          />
          <TaxInput
            label="Inversiones, acciones, CDTs y fondos"
            sublabel="Costo fiscal o valor patrimonial certificado de participaciones e inversiones."
            value={patrimony.inversionesYAcciones}
            onChange={(val) => onUpdatePatrimonio({ inversionesYAcciones: val })}
            uvtValue={uvtValue}
            legalRef="Art. 271 E.T."
          />
          <TaxInput
            label="Vehículos y medios de transporte"
            sublabel="Costo de adquisición ajustado o valor en tablas del MinTransporte."
            value={patrimony.vehiculos}
            onChange={(val) => onUpdatePatrimonio({ vehiculos: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="Efectivo en caja y moneda extranjera"
            sublabel="Dinero disponible físico convertido a TRM a 31 de dic de 2025."
            value={patrimony.efectivoYEquivalentes}
            onChange={(val) => onUpdatePatrimonio({ efectivoYEquivalentes: val })}
            uvtValue={uvtValue}
            legalRef="Art. 261 E.T."
          />
          <TaxInput
            label="Otros activos y derechos patrimoniales"
            sublabel="Cuentas por cobrar a terceros, inventarios, joyas, obras de arte, criptoactivos."
            value={patrimony.otrosActivos}
            onChange={(val) => onUpdatePatrimonio({ otrosActivos: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>

      {/* 2. Deudas */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <CreditCard className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Deudas y Pasivos Vigentes a 31 de Diciembre de 2025 (Renglón 29)
          </h4>
        </div>
        <p className="text-xs text-slate-600">
          Para personas no obligadas a llevar contabilidad, las deudas con particulares deben estar respaldadas en documento con fecha cierta o cumplir los requisitos de bancarización y aceptación probatoria (Art. 283 y 770 del E.T.).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Deudas con entidades financieras"
            sublabel="Créditos hipotecarios, de consumo, libranzas y tarjetas certificadas."
            value={patrimony.deudasFinancieras}
            onChange={(val) => onUpdatePatrimonio({ deudasFinancieras: val })}
            uvtValue={uvtValue}
            legalRef="Art. 283 E.T."
          />
          <TaxInput
            label="Otras deudas con particulares o empresas"
            sublabel="Pasivos con documento de fecha cierta o pagaré con reconocimiento de firmas."
            value={patrimony.otrasDeudas}
            onChange={(val) => onUpdatePatrimonio({ otrasDeudas: val })}
            uvtValue={uvtValue}
            legalRef="Art. 770 E.T."
          />
        </div>
      </div>

      {/* 3. Conciliación con el Año Anterior */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <Wallet className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Patrimonio Líquido del Año Anterior (2024) para Control Patrimonial
          </h4>
        </div>
        <p className="text-xs text-slate-600">
          Ingresa el valor del Renglón 30 de tu declaración de renta del año gravable 2024 para auditar automáticamente que el incremento patrimonial de 2025 esté plenamente justificado y evitar sospechas de renta por comparación patrimonial (Art. 236 E.T.).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaxInput
            label="Patrimonio Líquido Declarado en 2024 (Renglón 30 declaración 2024)"
            sublabel="Base para verificar la variación patrimonial interanual."
            value={patrimony.patrimonioLiquidoAnoAnterior}
            onChange={(val) => onUpdatePatrimonio({ patrimonioLiquidoAnoAnterior: val })}
            uvtValue={uvtValue}
          />
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-center">
            <span className="text-[11px] text-slate-500 block">Variación Patrimonial Neta (2025 vs 2024):</span>
            <span
              className={`text-base font-bold font-mono mt-1 ${
                calc.incrementoPatrimonial >= 0 ? 'text-emerald-700' : 'text-slate-700'
              }`}
            >
              {calc.incrementoPatrimonial >= 0 ? '+' : ''}
              {formatCOP(calc.incrementoPatrimonial)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
