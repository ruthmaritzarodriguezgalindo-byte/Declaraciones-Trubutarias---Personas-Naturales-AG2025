import React from 'react';
import { Form210Declaration, CompleteTaxResult } from '../../types/tax';
import { formatCOP } from '../../utils/formatters';
import { ShieldCheck, AlertTriangle, Sparkles, TrendingUp, CheckCircle, Scale, Eye } from 'lucide-react';

interface AuditoriaTabProps {
  declaration: Form210Declaration;
  result: CompleteTaxResult;
  onNavigateToTab: (tab: string) => void;
}

export const AuditoriaTab: React.FC<AuditoriaTabProps> = ({
  declaration,
  result,
  onNavigateToTab,
}) => {
  const { conciliacion, obligacion, trabajo } = result;
  const { rentasTrabajo, uvtValue } = declaration;

  // Beneficios Ley 2277 no aprovechados al 100%
  const dependientesFaltantes = 4 - (rentasTrabajo.dependientesAdicionales72UVTCount || 0);
  const uvtDependientesPerdidos = dependientesFaltantes * 72;
  const ahorroPotencialDependientes = formatCOP(uvtDependientesPerdidos * uvtValue * 0.28); // Estimado tarifa media 28%

  const comprasSoportadas = rentasTrabajo.comprasFacturaElectronica1Porciento || 0;
  const maxComprasParaTope = 240 * uvtValue * 100; // Para llegar a 240 UVT de deduccion
  const margenFacturaElectronica = Math.max(0, 240 * uvtValue - trabajo.deduccionFacturaElectronica1Porciento);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
              Auditoría Preventiva
            </span>
            <h3 className="text-base font-bold text-white">
              Centro de Auditoría Fiscal y Detección de Riesgos DIAN
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Simula las pruebas de consistencia cruzada y fiscalización que ejecuta el motor de la DIAN: Renta por comparación patrimonial, límites de bancarización y optimización de beneficios legales.
          </p>
        </div>
      </div>

      {/* 1. Renta por Comparación Patrimonial (Art. 236 E.T.) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                1. Conciliación Patrimonial (Artículo 236 del Estatuto Tributario)
              </h4>
              <p className="text-xs text-slate-500">
                El incremento en el patrimonio líquido debe estar plenamente justificado en las rentas y ganancias del año.
              </p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-xs font-bold border ${
              conciliacion.alertaRentaPorComparacion
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {conciliacion.alertaRentaPorComparacion
              ? '⚠️ RIESGO: INCREMENTO NO JUSTIFICADO'
              : '✅ PATRIMONIO CONCILIADO CORRECTAMENTE'}
          </span>
        </div>

        {conciliacion.alertaRentaPorComparacion ? (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <AlertTriangle className="w-4 h-4" />
              <span>Diferencia patrimonial detectada: {formatCOP(conciliacion.diferenciaPatrimonial)}</span>
            </div>
            <p className="leading-relaxed">
              El patrimonio líquido aumentó en {formatCOP(conciliacion.incrementoPatrimonial)}, pero la suma de tus ingresos declarados, rentas exentas y ganancias netas menos impuestos solo justifica {formatCOP(conciliacion.justificacionTotalPatrimonial)}.
              <br />
              <strong>Riesgo de fiscalización:</strong> La DIAN podría reclasificar esta diferencia como <em>Renta Líquida Gravable por Comparación Patrimonial</em> adicionando una sanción por inexactitud del 100% o 200%.
              <br />
              <strong>Solución recomendada:</strong> Revisa si omitiste declarar deudas vigentes al 31 de diciembre de 2025, si recibiste herencias, indemnizaciones o ingresos no gravados no reportados.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              El patrimonio líquido está cubierto y soportado por los ingresos brutos, rentas líquidas y ganancias ocasionales declaradas. No existe riesgo de comparación patrimonial.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs pt-1">
          <div className="p-3 bg-slate-50 border rounded-lg">
            <span className="text-[10px] text-slate-500 block">Patrimonio Líquido 2024:</span>
            <span className="font-bold text-slate-900">{formatCOP(conciliacion.patrimonioLiquidoAnoAnterior)}</span>
          </div>
          <div className="p-3 bg-slate-50 border rounded-lg">
            <span className="text-[10px] text-slate-500 block">Patrimonio Líquido 2025:</span>
            <span className="font-bold text-slate-900">{formatCOP(conciliacion.patrimonioLiquidoAnoActual)}</span>
          </div>
          <div className="p-3 bg-slate-50 border rounded-lg">
            <span className="text-[10px] text-slate-500 block">Variación Patrimonial:</span>
            <span className={`font-bold ${conciliacion.incrementoPatrimonial >= 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
              {formatCOP(conciliacion.incrementoPatrimonial)}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border rounded-lg">
            <span className="text-[10px] text-slate-500 block">Total Justificación Soportada:</span>
            <span className="font-bold text-blue-700">{formatCOP(conciliacion.justificacionTotalPatrimonial)}</span>
          </div>
        </div>
      </div>

      {/* 2. Optimizador de Beneficios Ley 2277 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              2. Optimizador de Deducciones Especiales (Ley 2277 de 2022)
            </h4>
            <p className="text-xs text-slate-500">
              Verifica si estás aprovechando todos los incentivos fiscales que no consumen el límite del 40%.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dependientes adicionales */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                A. Dependientes Adicionales (72 UVT c/u)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                {rentasTrabajo.dependientesAdicionales72UVTCount} de 4 aplicados
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deducción directa actual: <strong>{formatCOP(trabajo.deduccionDependientes72UVT)}</strong>.
              {dependientesFaltantes > 0 ? (
                <> Aún puedes imputar <strong>{dependientesFaltantes} dependiente(s) más</strong> ({uvtDependientesPerdidos} UVT = {formatCOP(uvtDependientesPerdidos * uvtValue)}), lo que podría reducir tu impuesto en aprox. <strong>{ahorroPotencialDependientes}</strong>.</>
              ) : (
                ' ¡Has aprovechado el cupo máximo legal de 4 dependientes (288 UVT)!'
              )}
            </p>
            {dependientesFaltantes > 0 && (
              <button
                onClick={() => onNavigateToTab('trabajo')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline block"
              >
                Ajustar dependientes en Rentas de Trabajo →
              </button>
            )}
          </div>

          {/* Factura electrónica 1% */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                B. Factura Electrónica (1% de compras)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-bold">
                Deducción: {formatCOP(trabajo.deduccionFacturaElectronica1Porciento)}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Has reportado compras con FE por {formatCOP(comprasSoportadas)}.
              {margenFacturaElectronica > 0 ? (
                <> Aún tienes margen para deducir hasta <strong>{formatCOP(margenFacturaElectronica)}</strong> adicionales si registras más facturas electrónicas de compras personales durante el año gravable 2025.</>
              ) : (
                ' ¡Llegaste al tope máximo legal de 240 UVT de deducción por compras con factura electrónica!'
              )}
            </p>
            <button
              onClick={() => onNavigateToTab('trabajo')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline block"
            >
              Registrar más compras con FE →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Lista de Chequeo para evitar requerimientos DIAN */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-slate-900 border-b pb-2">
          3. Lista de Chequeo de Cumplimiento Formal (Criterios de Fiscalización Muisca)
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 p-2 rounded bg-slate-50 border">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Bancarización (Art. 771-5 E.T.):</strong> Todos los pagos a terceros por concepto de costos, compras o pasivos superiores a 100 UVT deben estar canalizados mediante transferencias electrónicas, cheques o tarjetas.
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded bg-slate-50 border">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Cruce con Información Exógena:</strong> Revisa el reporte de "Información Exógena DIAN" en el portal Muisca antes del envío para asegurar que todos los bancos, empleadores y clientes coincidan con lo liquidado.
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded bg-slate-50 border">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Certificados de Retención en la Fuente:</strong> Solo deben incluirse retenciones que cuenten con certificado físico o digital emitido por el agente retenedor (Art. 378 al 381 E.T.).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
