import React from 'react';
import { CompleteTaxResult, Form210Declaration } from '../../types/tax';
import { formatCOP } from '../../utils/formatters';
import { Printer, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface Formulario210ViewProps {
  declaration: Form210Declaration;
  result: CompleteTaxResult;
  onPrint: () => void;
}

export const Formulario210View: React.FC<Formulario210ViewProps> = ({
  declaration,
  result,
  onPrint,
}) => {
  const { taxpayer } = declaration;
  const renglones = result.renglonesForm210;

  const renderRenglon = (num: string, label: string, isTotal: boolean = false) => {
    const val = renglones[num] as number | undefined;
    const formatted = val !== undefined && val !== null ? formatCOP(val) : '$ 0';

    return (
      <tr className={`border-b border-emerald-950/20 text-xs ${isTotal ? 'bg-emerald-100/70 font-bold text-emerald-950' : 'hover:bg-slate-50'}`}>
        <td className="w-12 py-1.5 px-2 text-center font-mono font-bold text-emerald-900 border-r border-emerald-950/20 bg-emerald-50/50">
          {num}
        </td>
        <td className="py-1.5 px-3 text-slate-800">
          {label}
        </td>
        <td className="w-48 py-1.5 px-3 text-right font-mono font-bold text-slate-900 border-l border-emerald-950/20">
          {formatted}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Formato oficial DIAN prellenado listo para confrontar en el portal Muisca de la DIAN.</span>
        </div>
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Declaración Oficial</span>
        </button>
      </div>

      {/* Contenedor del Formulario 210 Oficial (Réplica visual DIAN) */}
      <div
        id="formulario-210-printable"
        className="bg-white border-2 border-emerald-800 rounded-lg shadow-md p-6 max-w-5xl mx-auto font-sans print:border-none print:shadow-none print:p-0"
      >
        {/* Cabezote DIAN */}
        <div className="border-b-2 border-emerald-800 pb-3 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-md bg-emerald-800 text-white flex flex-col items-center justify-center font-bold text-lg leading-tight p-1 border-2 border-emerald-900">
                <span className="text-[9px] uppercase tracking-tighter">DIAN</span>
                <span className="text-xl">210</span>
              </div>
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-tight text-emerald-950">
                  Declaración de Renta y Complementarios
                </h2>
                <p className="text-[11px] font-semibold text-slate-700 uppercase">
                  Personas Naturales y Asimiladas de Residentes y Sucesiones Ilíquidas
                </p>
                <p className="text-[10px] text-slate-500">
                  Estatuto Tributario Nacional • República de Colombia
                </p>
              </div>
            </div>

            <div className="text-right border-2 border-emerald-800 rounded-md p-2 bg-emerald-50/50">
              <span className="text-[10px] uppercase font-bold text-emerald-900 block">Año Gravable</span>
              <span className="text-2xl font-black font-mono text-emerald-950 block">2025</span>
              <span className="text-[9px] text-slate-500 font-mono">Presentación 2026</span>
            </div>
          </div>

          {/* Datos del Declarante */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
            <div className="p-1.5 bg-slate-50 border rounded">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">5. NIT / C.C.</span>
              <span className="font-mono font-bold text-slate-900">{taxpayer.nit || '123456789'}</span>
            </div>
            <div className="p-1.5 bg-slate-50 border rounded">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">6. DV</span>
              <span className="font-mono font-bold text-slate-900">{taxpayer.dv || '1'}</span>
            </div>
            <div className="p-1.5 bg-slate-50 border rounded sm:col-span-2">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">7. Primer Apellido / 8. Segundo Apellido</span>
              <span className="font-bold text-slate-900 truncate block">
                {taxpayer.primerApellido || 'APELLIDO'} {taxpayer.segundoApellido}
              </span>
            </div>
            <div className="p-1.5 bg-slate-50 border rounded sm:col-span-2">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">9. Primer Nombre / 10. Otros Nombres</span>
              <span className="font-bold text-slate-900 truncate block">
                {taxpayer.primerNombre || 'NOMBRE'} {taxpayer.otrosNombres}
              </span>
            </div>
          </div>
        </div>

        {/* Cédulas y Renglones */}
        <div className="space-y-4">
          {/* SECCIÓN 1: PATRIMONIO */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Patrimonio (A 31 de Diciembre de 2025)
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('28', 'Total patrimonio bruto')}
                {renderRenglon('29', 'Deudas')}
                {renderRenglon('30', 'Total patrimonio líquido', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 2: CÉDULA GENERAL - RENTAS DE TRABAJO */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Cédula General - Rentas de Trabajo
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('32', 'Ingresos brutos por rentas de trabajo')}
                {renderRenglon('33', 'Ingresos no constitutivos de renta')}
                {renderRenglon('34', 'Ingresos netos')}
                {renderRenglon('35', 'Rentas exentas de trabajo')}
                {renderRenglon('36', 'Deducciones imputables (Incluye dependientes y factura electrónica Ley 2277)')}
                {renderRenglon('37', 'Total rentas exentas y deducciones imputables')}
                {renderRenglon('38', 'Renta líquida ordinaria / gravable rentas de trabajo', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 3: CÉDULA GENERAL - RENTAS DE CAPITAL */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Cédula General - Rentas de Capital
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('58', 'Ingresos brutos por rentas de capital')}
                {renderRenglon('59', 'Ingresos no constitutivos de renta')}
                {renderRenglon('60', 'Costos y deducciones procedentes')}
                {renderRenglon('61', 'Renta líquida ordinaria de capital')}
                {renderRenglon('62', 'Rentas exentas y deducciones')}
                {renderRenglon('63', 'Renta líquida gravable rentas de capital', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 4: CÉDULA GENERAL - RENTAS NO LABORALES */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Cédula General - Rentas No Laborales
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('74', 'Ingresos brutos rentas no laborales')}
                {renderRenglon('75', 'Devoluciones, rebajas y descuentos')}
                {renderRenglon('76', 'Ingresos no constitutivos de renta')}
                {renderRenglon('77', 'Costos y deducciones procedentes')}
                {renderRenglon('78', 'Renta líquida ordinaria')}
                {renderRenglon('79', 'Rentas exentas y deducciones')}
                {renderRenglon('80', 'Renta líquida gravable rentas no laborales', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 5: RESUMEN CÉDULA GENERAL */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Consolidación Cédula General
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('92', 'Renta líquida ordinaria de la cédula general')}
                {renderRenglon('93', 'Compensaciones por pérdidas fiscales')}
                {renderRenglon('94', 'Renta líquida gravable cédula general', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 6: CÉDULA DE PENSIONES */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Cédula de Rentas de Pensiones
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('98', 'Ingresos brutos por pensiones')}
                {renderRenglon('99', 'Ingresos no constitutivos de renta')}
                {renderRenglon('100', 'Renta exenta de pensiones (Hasta 12.000 UVT)')}
                {renderRenglon('101', 'Renta líquida gravable de pensiones', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 7: DIVIDENDOS Y PARTICIPACIONES */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Cédula de Dividendos y Participaciones
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('104', 'Subcédula 1: 2017 y siguientes utilidades no gravadas')}
                {renderRenglon('105', 'Subcédula 2: 2017 y siguientes utilidades gravadas')}
                {renderRenglon('106', 'Renta líquida gravable dividendos', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 8: GANANCIAS OCASIONALES */}
          <div className="border border-emerald-800 rounded overflow-hidden">
            <div className="bg-emerald-800 text-white font-bold text-xs px-3 py-1 uppercase tracking-wider">
              Ganancias Ocasionales
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('111', 'Ingresos por ganancias ocasionales')}
                {renderRenglon('112', 'Costos por ganancias ocasionales')}
                {renderRenglon('113', 'Ganancias ocasionales no gravadas y exentas')}
                {renderRenglon('114', 'Ganancias ocasionales gravables', true)}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN 9: LIQUIDACIÓN PRIVADA */}
          <div className="border-2 border-emerald-900 rounded overflow-hidden shadow-sm">
            <div className="bg-emerald-900 text-white font-bold text-xs px-3 py-1.5 uppercase tracking-wider">
              Liquidación Privada y Saldo Definitivo
            </div>
            <table className="w-full">
              <tbody>
                {renderRenglon('122', 'Impuesto sobre las rentas líquidas gravables (Art. 241 E.T.)')}
                {renderRenglon('123', 'Impuesto sobre dividendos gravados (Tarifa 35%)')}
                {renderRenglon('124', 'Total impuesto sobre las rentas líquidas')}
                {renderRenglon('125', 'Descuentos tributarios')}
                {renderRenglon('126', 'Impuesto neto de renta')}
                {renderRenglon('127', 'Impuesto de ganancias ocasionales')}
                {renderRenglon('128', 'Total impuesto a cargo', true)}
                {renderRenglon('130', 'Anticipo renta liquidado año anterior (2024)')}
                {renderRenglon('131', 'Saldo a favor año gravable anterior')}
                {renderRenglon('132', 'Retenciones en la fuente practicadas en 2025')}
                {renderRenglon('133', 'Anticipo renta para el año gravable 2026')}
                {renderRenglon('134', 'Sanciones')}
                {renderRenglon('135', 'TOTAL SALDO A PAGAR', true)}
                {renderRenglon('136', 'TOTAL SALDO A FAVOR', true)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie de firma del formulario oficial */}
        <div className="mt-8 pt-4 border-t-2 border-emerald-900 text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            Firma del Declarante o Representante: ________________________________________
          </div>
          <div className="text-right font-mono text-[9px]">
            Liquidador Formulario 210 DIAN AG 2025 • Estatuto Tributario vigente 2026
          </div>
        </div>
      </div>
    </div>
  );
};
