import React from 'react';
import { Form210Declaration, RentasTrabajoCalculation } from '../../types/tax';
import { TaxInput } from '../common/TaxInput';
import { formatCOP } from '../../utils/formatters';
import { Sparkles, Info, Users, ReceiptText, AlertCircle } from 'lucide-react';

interface TrabajoTabProps {
  declaration: Form210Declaration;
  onUpdateTrabajo: (data: Partial<Form210Declaration['rentasTrabajo']>) => void;
  calc: RentasTrabajoCalculation;
}

export const TrabajoTab: React.FC<TrabajoTabProps> = ({
  declaration,
  onUpdateTrabajo,
  calc,
}) => {
  const { rentasTrabajo, uvtValue } = declaration;
  const porcentajeConsumido =
    calc.limiteAplicable40o1340 > 0
      ? Math.min(100, Math.round((calc.totalBeneficiosSujetosLimite / calc.limiteAplicable40o1340) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* Explicación y Reglas de la Cédula */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white uppercase">
              Cédula General
            </span>
            <h3 className="text-sm font-bold text-emerald-950">
              Subcédula de Rentas de Trabajo (Arts. 103, 206 y 336 E.T.)
            </h3>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Aplica para salarios, prestaciones, honorarios y compensaciones percibidos por personas naturales que no imputen costos y deducciones. Regula el límite del 40% (máximo 1.340 UVT) y las deducciones sin límite de la Ley 2277.
          </p>
        </div>
        <div className="bg-white/80 border border-emerald-300 rounded-lg p-2.5 shrink-0 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Renta Líquida de Trabajo:
          </span>
          <span className="text-base font-extrabold text-emerald-700 font-mono">
            {formatCOP(calc.rentaLiquidaRentasTrabajo)}
          </span>
        </div>
      </div>

      {/* Monitor de Límites Legales (40% o 1.340 UVT) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-slate-800">
              Control de Límite Conjunto de Beneficios Tributarios (Art. 336 E.T. - Ley 2277)
            </span>
          </div>
          <div className="text-xs font-mono font-medium text-slate-600">
            Límite legal aplicable: <strong className="text-slate-900">{formatCOP(calc.limiteAplicable40o1340)}</strong> (Menor entre 40% y 1.340 UVT)
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              porcentajeConsumido >= 100 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, porcentajeConsumido)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
          <span>Beneficios solicitados: {formatCOP(calc.totalBeneficiosSujetosLimite)} ({porcentajeConsumido}% consumido)</span>
          <span>Aceptados en declaración: <strong className="text-slate-800">{formatCOP(calc.beneficiosAceptadosDentroLimite)}</strong></span>
        </div>

        {calc.totalBeneficiosSujetosLimite > calc.limiteAplicable40o1340 && (
          <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 rounded p-1.5 border border-amber-200 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              Atención: Los beneficios sujetos al límite superan el tope legal en {formatCOP(calc.totalBeneficiosSujetosLimite - calc.limiteAplicable40o1340)}. La ley restringe el beneficio computable.
            </span>
          </div>
        )}
      </div>

      {/* 1. Ingresos Brutos Laborales */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          1. Ingresos Brutos de Trabajo (Renglón 32 Formulario 210)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <TaxInput
            label="Salarios, prestaciones y viáticos"
            sublabel="Sueldos, horas extras, primas legales y extralegales, sobresueldos."
            value={rentasTrabajo.salariosYPrestaciones}
            onChange={(val) => onUpdateTrabajo({ salariosYPrestaciones: val })}
            uvtValue={uvtValue}
            legalRef="Art. 103 E.T."
          />
          <TaxInput
            label="Cesantías e intereses de cesantías"
            sublabel="Pagadas directamente en 2025 o consignadas en el fondo de cesantías."
            value={rentasTrabajo.cesantiasInteresesPagadasOReconocidas}
            onChange={(val) => onUpdateTrabajo({ cesantiasInteresesPagadasOReconocidas: val })}
            uvtValue={uvtValue}
            legalRef="Art. 206 #4"
          />
          <TaxInput
            label="Honorarios y servicios personales (sin costos)"
            sublabel="Cobros que tributan por rentas de trabajo con derecho al 25% exento."
            value={rentasTrabajo.honorariosCompensacionesSinCostos}
            onChange={(val) => onUpdateTrabajo({ honorariosCompensacionesSinCostos: val })}
            uvtValue={uvtValue}
            legalRef="Art. 103 E.T."
          />
          <TaxInput
            label="Otros ingresos laborales"
            sublabel="Bonificaciones extraordinarias, apoyos económicos, premios corporativos."
            value={rentasTrabajo.otrosIngresosLaborales}
            onChange={(val) => onUpdateTrabajo({ otrosIngresosLaborales: val })}
            uvtValue={uvtValue}
          />
          <TaxInput
            label="Rentas de trabajo percibidas del exterior"
            sublabel="Ingresos laborales obtenidos en el exterior por residentes fiscales."
            value={rentasTrabajo.ingresosExteriorLaborales}
            onChange={(val) => onUpdateTrabajo({ ingresosExteriorLaborales: val })}
            uvtValue={uvtValue}
            legalRef="Art. 9 y 10 E.T."
          />
        </div>
      </div>

      {/* 2. Ingresos No Constitutivos de Renta (INCRNGO) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          2. Ingresos No Constitutivos de Renta (INCRNGO) (Renglón 33)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <TaxInput
            label="Aportes obligatorios a Salud"
            sublabel="4% descontado por el empleador o pagado por planilla PILA."
            value={rentasTrabajo.aportesSaludObligatorios}
            onChange={(val) => onUpdateTrabajo({ aportesSaludObligatorios: val })}
            uvtValue={uvtValue}
            legalRef="Art. 56 E.T."
          />
          <TaxInput
            label="Aportes obligatorios a Pensión"
            sublabel="4% descontado para fondo de pensiones (Colpensiones o RAIS)."
            value={rentasTrabajo.aportesPensionObligatorios}
            onChange={(val) => onUpdateTrabajo({ aportesPensionObligatorios: val })}
            uvtValue={uvtValue}
            legalRef="Art. 55 E.T."
          />
          <TaxInput
            label="Fondo de Solidaridad Pensional (FSP)"
            sublabel="Aporte adicional de solidaridad (1% a 2% para salarios > 4 SMMLV)."
            value={rentasTrabajo.aportesFondoSolidaridadPensional}
            onChange={(val) => onUpdateTrabajo({ aportesFondoSolidaridadPensional: val })}
            uvtValue={uvtValue}
            legalRef="Art. 55 E.T."
          />
          <TaxInput
            label="Otros INCRNGO de trabajo"
            sublabel="Cesantías acumuladas a 2016 y otros ingresos no gravados."
            value={rentasTrabajo.otrosIncrngoTrabajo}
            onChange={(val) => onUpdateTrabajo({ otrosIncrngoTrabajo: val })}
            uvtValue={uvtValue}
          />
        </div>
      </div>

      {/* 3. Deducciones Generales y Rentas Exentas Sujetas al Límite */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-2">
          3. Deducciones y Rentas Exentas Sujetas al Límite del 40% / 1.340 UVT
        </h4>

        {/* Deducciones Art. 387, 119, 115 */}
        <div>
          <div className="text-xs font-semibold text-slate-800 mb-2">
            A. Deducciones Tradicionales Imputables
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <TaxInput
              label="Intereses de crédito hipotecario / leasing"
              sublabel="Intereses para adquisición de vivienda de habitación."
              value={rentasTrabajo.interesesVivienda}
              onChange={(val) => onUpdateTrabajo({ interesesVivienda: val })}
              uvtValue={uvtValue}
              maxUVT={1200}
              legalRef="Art. 119 E.T."
            />
            <TaxInput
              label="Medicina prepagada y pólizas de salud"
              sublabel="Pagos efectuados para protección del contribuyente o familia."
              value={rentasTrabajo.saludPrepagada}
              onChange={(val) => onUpdateTrabajo({ saludPrepagada: val })}
              uvtValue={uvtValue}
              maxUVT={192}
              legalRef="Art. 387 E.T."
            />
            {/* Dependientes Tradicional Art 387 */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-2 mb-1">
                <label className="text-xs font-semibold text-slate-800 leading-tight">
                  Dependientes Económicos Tradicional
                </label>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border">
                  Art. 387 E.T.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Hijos menores, cónyuge, padres o hermanos dependientes. Otorga 10% del ingreso bruto laboral hasta 384 UVT.
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rentasTrabajo.dependientesTradicionalesCount > 0}
                    onChange={(e) =>
                      onUpdateTrabajo({ dependientesTradicionalesCount: e.target.checked ? 1 : 0 })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-xs text-slate-700 font-medium">Aplica dependiente tradicional</span>
                </label>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 mt-2 font-semibold">
                Deducción calculada: {formatCOP(rentasTrabajo.dependientesTradicionalesCount > 0 ? Math.min(calc.ingresoBruto * 0.1, 384 * uvtValue) : 0)}
              </div>
            </div>

            <TaxInput
              label="50% del Gravamen a Movimientos Financieros (4x1000)"
              sublabel="Deducción del 50% del GMF efectivamente certificado por bancos."
              value={rentasTrabajo.gmfDeducible50}
              onChange={(val) => onUpdateTrabajo({ gmfDeducible50: val })}
              uvtValue={uvtValue}
              legalRef="Art. 115 E.T."
            />
          </div>
        </div>

        {/* Rentas Exentas Específicas */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-800 mb-2">
            B. Rentas Exentas Específicas
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <TaxInput
              label="Cesantías e intereses exentos"
              sublabel="Exención según tabla progresiva de salarios mensuales del Art. 206 #4."
              value={rentasTrabajo.cesantiasExentas}
              onChange={(val) => onUpdateTrabajo({ cesantiasExentas: val })}
              uvtValue={uvtValue}
              legalRef="Art. 206 #4"
            />
            <TaxInput
              label="Aportes voluntarios a pensión (FVP)"
              sublabel="Aportes en fondos voluntarios de pensiones con permanencia."
              value={rentasTrabajo.aportesVoluntariosPensionFVP}
              onChange={(val) => onUpdateTrabajo({ aportesVoluntariosPensionFVP: val })}
              uvtValue={uvtValue}
              maxUVT={3800}
              legalRef="Art. 126-1 E.T."
            />
            <TaxInput
              label="Aportes a cuentas AFC"
              sublabel="Ahorro para el Fomento de la Construcción."
              value={rentasTrabajo.aportesCuentasAFC}
              onChange={(val) => onUpdateTrabajo({ aportesCuentasAFC: val })}
              uvtValue={uvtValue}
              maxUVT={3800}
              legalRef="Art. 126-4 E.T."
            />
            <TaxInput
              label="Otras rentas exentas laborales"
              sublabel="Indemnizaciones por accidente, maternidad, etc."
              value={rentasTrabajo.otrasRentasExentasLaborales}
              onChange={(val) => onUpdateTrabajo({ otrasRentasExentasLaborales: val })}
              uvtValue={uvtValue}
              legalRef="Art. 206 E.T."
            />
          </div>
        </div>

        {/* C. Renta Exenta Laboral del 25% */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                C. Renta Exenta Laboral del 25% (Automática)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Tope Ley 2277: 790 UVT ({formatCOP(790 * uvtValue)})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Se calcula sobre el remanente del ingreso neto tras restar las deducciones anteriores y rentas exentas.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-slate-900 block">
              {formatCOP(calc.rentaExenta25)}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ≈ {(calc.rentaExenta25 / uvtValue).toFixed(1)} UVT
            </span>
          </div>
        </div>
      </div>

      {/* 4. DEDUCCIONES EXTRAORDINARIAS LEY 2277 (SIN SUJECIÓN AL LÍMITE DEL 40% NI 1.340 UVT) */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-400 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-emerald-200 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                4. Beneficios Especiales de la Reforma Tributaria Ley 2277 de 2022
              </h4>
              <p className="text-[11px] text-emerald-800 font-medium">
                ¡VENTAJA TRIBUTARIA! Estas dos deducciones <strong>NO están sujetas al límite conjunto del 40% ni de 1.340 UVT</strong>.
              </p>
            </div>
          </div>
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
            Beneficio Neto Directo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* A. Dependientes adicionales a 72 UVT */}
          <div className="bg-white border border-emerald-300 rounded-lg p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">
                  Dependientes Adicionales (72 UVT cada uno)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                Art. 336 Par. 2
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Deducción de hasta <strong>4 dependientes</strong> adicionales a razón de <strong>72 UVT por dependiente</strong> (hasta 288 UVT = {formatCOP(288 * uvtValue)}). Puede tomarse simultáneamente con la deducción tradicional del Art. 387.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <label className="text-xs font-semibold text-slate-700">
                Número de dependientes a 72 UVT:
              </label>
              <select
                value={rentasTrabajo.dependientesAdicionales72UVTCount}
                onChange={(e) =>
                  onUpdateTrabajo({ dependientesAdicionales72UVTCount: parseInt(e.target.value, 10) })
                }
                className="bg-white border border-slate-300 rounded px-3 py-1 text-xs font-bold text-slate-800 focus:border-emerald-600"
              >
                <option value={0}>0 dependientes</option>
                <option value={1}>1 dependiente (72 UVT = {formatCOP(72 * uvtValue)})</option>
                <option value={2}>2 dependientes (144 UVT = {formatCOP(144 * uvtValue)})</option>
                <option value={3}>3 dependientes (216 UVT = {formatCOP(216 * uvtValue)})</option>
                <option value={4}>4 dependientes (288 UVT = {formatCOP(288 * uvtValue)})</option>
              </select>
            </div>

            <div className="p-2 rounded bg-emerald-50 text-[11px] font-mono text-emerald-900 font-bold flex justify-between">
              <span>Deducción directa aplicable:</span>
              <span>{formatCOP(calc.deduccionDependientes72UVT)}</span>
            </div>
          </div>

          {/* B. Factura electrónica 1% */}
          <div className="bg-white border border-emerald-300 rounded-lg p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <ReceiptText className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">
                  Deducción del 1% por Factura Electrónica
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                Art. 336 Num. 5
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Deduce el <strong>1% del total de compras</strong> de bienes o servicios soportadas con factura electrónica de venta (FE), pagadas con medios electrónicos, sin importar causalidad. Tope de <strong>240 UVT</strong> ({formatCOP(240 * uvtValue)}).
            </p>

            <div className="pt-1">
              <TaxInput
                label="Total de compras soportadas con Factura Electrónica"
                sublabel="Ingresa el valor total comprado; el liquidador calcula el 1% deducible legal."
                value={rentasTrabajo.comprasFacturaElectronica1Porciento}
                onChange={(val) => onUpdateTrabajo({ comprasFacturaElectronica1Porciento: val })}
                uvtValue={uvtValue}
                placeholder="Ej. 30.000.000"
              />
            </div>

            <div className="p-2 rounded bg-emerald-50 text-[11px] font-mono text-emerald-900 font-bold flex justify-between">
              <span>1% deducible directamente (máx 240 UVT):</span>
              <span>{formatCOP(calc.deduccionFacturaElectronica1Porciento)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
