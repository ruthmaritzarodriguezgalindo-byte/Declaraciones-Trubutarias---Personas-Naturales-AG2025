import React, { useState, useMemo } from 'react';
import { Form210Declaration } from './types/tax';
import { SAMPLE_CASES } from './data/sampleCases';
import { DEFAULT_UVT_2025, DEFAULT_UVT_2026 } from './data/taxConstants';
import { liquidarFormulario210 } from './utils/taxCalculations';

import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { ObligationModal } from './components/ObligationModal';

import { TrabajoTab } from './components/tabs/TrabajoTab';
import { CapitalTab } from './components/tabs/CapitalTab';
import { NoLaboralTab } from './components/tabs/NoLaboralTab';
import { PensionTab } from './components/tabs/PensionTab';
import { DividendosTab } from './components/tabs/DividendosTab';
import { GananciasOcasionalesTab } from './components/tabs/GananciasOcasionalesTab';
import { PatrimonioTab } from './components/tabs/PatrimonioTab';
import { LiquidacionTab } from './components/tabs/LiquidacionTab';
import { Formulario210View } from './components/tabs/Formulario210View';
import { AuditoriaTab } from './components/tabs/AuditoriaTab';

const INITIAL_EMPTY_DECLARATION: Form210Declaration = {
  taxpayer: {
    nit: '',
    dv: '0',
    primerApellido: '',
    segundoApellido: '',
    primerNombre: '',
    otrosNombres: '',
    actividadEconomica: '0010',
    codigoMunicipio: '11001',
    departamento: 'BOGOTÁ D.C.',
    esResidenteFiscal: true,
    anosDeclarando: 'tercero_o_mas',
  },
  uvtValue: DEFAULT_UVT_2025,
  uvt2026Value: DEFAULT_UVT_2026,
  obligation: {
    patrimonioBruto: 0,
    ingresosBrutos: 0,
    consumosTarjetaCredito: 0,
    comprasTotales: 0,
    consignacionesBancarias: 0,
    esResponsableIVA: false,
  },
  patrimony: {
    efectivoYEquivalentes: 0,
    cuentasBancarias: 0,
    inversionesYAcciones: 0,
    bienesRaices: 0,
    vehiculos: 0,
    otrosActivos: 0,
    deudasFinancieras: 0,
    otrasDeudas: 0,
    patrimonioLiquidoAnoAnterior: 0,
  },
  rentasTrabajo: {
    salariosYPrestaciones: 0,
    honorariosCompensacionesSinCostos: 0,
    cesantiasInteresesPagadasOReconocidas: 0,
    otrosIngresosLaborales: 0,
    ingresosExteriorLaborales: 0,
    aportesSaludObligatorios: 0,
    aportesPensionObligatorios: 0,
    aportesFondoSolidaridadPensional: 0,
    otrosIncrngoTrabajo: 0,
    interesesVivienda: 0,
    saludPrepagada: 0,
    dependientesTradicionalesCount: 0,
    gmfDeducible50: 0,
    cesantiasExentas: 0,
    aportesVoluntariosPensionFVP: 0,
    aportesCuentasAFC: 0,
    otrasRentasExentasLaborales: 0,
    dependientesAdicionales72UVTCount: 0,
    comprasFacturaElectronica1Porciento: 0,
  },
  rentasCapital: {
    interesesYRendimientosFinancieros: 0,
    arrendamientos: 0,
    regaliasYPropiedadIntelectual: 0,
    otrosIngresosCapital: 0,
    ingresosExteriorCapital: 0,
    componenteInflacionario: 0,
    aportesSeguridadSocialCapital: 0,
    otrosIncrngoCapital: 0,
    costosProcedentesCapital: 0,
    interesesViviendaCapital: 0,
    gmfDeducibleCapital: 0,
    otrasDeduccionesCapital: 0,
    rentasExentasCapital: 0,
  },
  rentasNoLaborales: {
    ingresosComercioIndustriaServicios: 0,
    otrosIngresosNoLaborales: 0,
    devolucionesRebajasDescuentos: 0,
    aportesSeguridadSocialNoLaboral: 0,
    otrosIncrngoNoLaborales: 0,
    costosProcedentesNoLaborales: 0,
    deduccionesImputablesNoLaborales: 0,
    rentasExentasNoLaborales: 0,
  },
  rentasPensiones: {
    pensionesJubilacionVejezColombia: 0,
    pensionesInvalidezSobrevivientes: 0,
    pensionesExterior: 0,
    aportesSaludPensionados: 0,
    otrasRentasExentasPensiones: 0,
  },
  dividendos: {
    subcedula1_2017EnAdelanteNoGravados: 0,
    subcedula2_2017EnAdelanteGravados: 0,
    dividendos2016YAnterioresNoGravados: 0,
    dividendos2016YAnterioresGravados: 0,
    dividendosECEYExterior: 0,
  },
  gananciasOcasionales: {
    ventaActivosFijosPoseidos2MasAnos: 0,
    costoFiscalActivosVendidos: 0,
    herenciasLegadosDonaciones: 0,
    indemnizacionesSegurosVida: 0,
    loteriasRifasApuestasPremios: 0,
    gananciasOcasionalesExentasYNoGravadas: 0,
  },
  liquidacionAvanzada: {
    compensacionPerdidasAnosAnteriores: 0,
    compensacionExcesoRentaPresuntiva: 0,
    descuentoImpuestosExterior: 0,
    descuentoDonacionesArt257: 0,
    otrosDescuentosTributarios: 0,
    retencionesEnLaFuenteRenta2025: 0,
    retencionesGananciaOcasional: 0,
    anticipoRentaAnoAnteriorPara2025: 0,
    metodoAnticipo2026: 'procedimiento1',
    saldoAFavorAnoAnteriorSinDevolucion: 0,
    diasMesesExtemporaneidad: 0,
    esCorreccion: false,
    mayorValorPagarCorreccion: 0,
  },
};

export default function App() {
  // Inicializamos con el caso de ejemplo 1 para exhibición inmediata
  const [declaration, setDeclaration] = useState<Form210Declaration>(
    SAMPLE_CASES[0].declaration
  );
  const [activeTab, setActiveTab] = useState<string>('trabajo');
  const [isObligationModalOpen, setIsObligationModalOpen] = useState<boolean>(false);

  // Liquidación reactiva en tiempo real
  const result = useMemo(() => {
    return liquidarFormulario210(declaration);
  }, [declaration]);

  // Carga de perfiles preconfigurados
  const handleLoadSample = (id: string) => {
    const found = SAMPLE_CASES.find((c) => c.id === id);
    if (found) {
      setDeclaration(JSON.parse(JSON.stringify(found.declaration)));
    }
  };

  // Restablecer a ceros
  const handleReset = () => {
    setDeclaration(JSON.parse(JSON.stringify(INITIAL_EMPTY_DECLARATION)));
  };

  // Actualización de UVT
  const handleUpdateUVT = (val: number) => {
    setDeclaration((prev) => ({
      ...prev,
      uvtValue: val,
    }));
  };

  // Impresión
  const handlePrint = () => {
    // Si no está en la pestaña oficial del formulario 210, cambiar a ella para la impresión
    if (activeTab !== 'formulario210') {
      setActiveTab('formulario210');
      setTimeout(() => {
        window.print();
      }, 150);
    } else {
      window.print();
    }
  };

  // Updaters modulares
  const handleUpdateTaxpayer = (data: Partial<Form210Declaration['taxpayer']>) => {
    setDeclaration((prev) => ({
      ...prev,
      taxpayer: { ...prev.taxpayer, ...data },
    }));
  };

  const handleUpdatePatrimonio = (data: Partial<Form210Declaration['patrimony']>) => {
    setDeclaration((prev) => ({
      ...prev,
      patrimony: { ...prev.patrimony, ...data },
    }));
  };

  const handleUpdateTrabajo = (data: Partial<Form210Declaration['rentasTrabajo']>) => {
    setDeclaration((prev) => ({
      ...prev,
      rentasTrabajo: { ...prev.rentasTrabajo, ...data },
    }));
  };

  const handleUpdateCapital = (data: Partial<Form210Declaration['rentasCapital']>) => {
    setDeclaration((prev) => ({
      ...prev,
      rentasCapital: { ...prev.rentasCapital, ...data },
    }));
  };

  const handleUpdateNoLaboral = (data: Partial<Form210Declaration['rentasNoLaborales']>) => {
    setDeclaration((prev) => ({
      ...prev,
      rentasNoLaborales: { ...prev.rentasNoLaborales, ...data },
    }));
  };

  const handleUpdatePension = (data: Partial<Form210Declaration['rentasPensiones']>) => {
    setDeclaration((prev) => ({
      ...prev,
      rentasPensiones: { ...prev.rentasPensiones, ...data },
    }));
  };

  const handleUpdateDividendos = (data: Partial<Form210Declaration['dividendos']>) => {
    setDeclaration((prev) => ({
      ...prev,
      dividendos: { ...prev.dividendos, ...data },
    }));
  };

  const handleUpdateGanancias = (data: Partial<Form210Declaration['gananciasOcasionales']>) => {
    setDeclaration((prev) => ({
      ...prev,
      gananciasOcasionales: { ...prev.gananciasOcasionales, ...data },
    }));
  };

  const handleUpdateLiquidacion = (data: Partial<Form210Declaration['liquidacionAvanzada']>) => {
    setDeclaration((prev) => ({
      ...prev,
      liquidacionAvanzada: { ...prev.liquidacionAvanzada, ...data },
    }));
  };

  const handleUpdateObligation = (data: Partial<Form210Declaration['obligation']>) => {
    setDeclaration((prev) => ({
      ...prev,
      obligation: { ...prev.obligation, ...data },
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header institucional */}
      <Header
        declaration={declaration}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onUpdateUVT={handleUpdateUVT}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
      />

      {/* KPI Cards de resumen en tiempo real */}
      <SummaryCards
        result={result}
        onOpenObligationModal={() => setIsObligationModalOpen(true)}
      />

      {/* Contenedor principal de pestañas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'trabajo' && (
          <TrabajoTab
            declaration={declaration}
            onUpdateTrabajo={handleUpdateTrabajo}
            calc={result.trabajo}
          />
        )}

        {activeTab === 'capital' && (
          <CapitalTab
            declaration={declaration}
            onUpdateCapital={handleUpdateCapital}
            calc={result.capital}
          />
        )}

        {activeTab === 'nolaboral' && (
          <NoLaboralTab
            declaration={declaration}
            onUpdateNoLaboral={handleUpdateNoLaboral}
            calc={result.noLaboral}
          />
        )}

        {activeTab === 'pensiones' && (
          <PensionTab
            declaration={declaration}
            onUpdatePension={handleUpdatePension}
            calc={result.pensiones}
          />
        )}

        {activeTab === 'dividendos' && (
          <DividendosTab
            declaration={declaration}
            onUpdateDividendos={handleUpdateDividendos}
            calc={result.dividendos}
          />
        )}

        {activeTab === 'ganancias' && (
          <GananciasOcasionalesTab
            declaration={declaration}
            onUpdateGanancias={handleUpdateGanancias}
            calc={result.gananciasOcasionales}
          />
        )}

        {activeTab === 'patrimonio' && (
          <PatrimonioTab
            declaration={declaration}
            onUpdatePatrimonio={handleUpdatePatrimonio}
            calc={result.conciliacion}
          />
        )}

        {activeTab === 'liquidacion' && (
          <LiquidacionTab
            declaration={declaration}
            onUpdateLiquidacion={handleUpdateLiquidacion}
            onUpdateTaxpayer={handleUpdateTaxpayer}
            calc={result.liquidacion}
          />
        )}

        {activeTab === 'formulario210' && (
          <Formulario210View
            declaration={declaration}
            result={result}
            onPrint={handlePrint}
          />
        )}

        {activeTab === 'auditoria' && (
          <AuditoriaTab
            declaration={declaration}
            result={result}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Modal de Obligatoriedad */}
      <ObligationModal
        isOpen={isObligationModalOpen}
        onClose={() => setIsObligationModalOpen(false)}
        evaluation={result.obligacion}
        obligationData={declaration.obligation}
        onUpdateObligation={handleUpdateObligation}
        uvtValue={declaration.uvtValue}
      />

      {/* Footer informativo */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <strong className="text-white">Liquidador Formulario 210 DIAN — Año Gravable 2025</strong>
            <span className="block text-[11px] text-slate-500">
              Conforme al Estatuto Tributario Colombiano, Ley 2277 de 2022 y resoluciones DIAN vigentes a 2026.
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            UVT 2025: ${declaration.uvtValue.toLocaleString('es-CO')} COP • UVT 2026: ${declaration.uvt2026Value.toLocaleString('es-CO')} COP
          </div>
        </div>
      </footer>
    </div>
  );
}
