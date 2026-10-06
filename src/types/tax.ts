export interface TaxpayerInfo {
  nit: string;
  dv: string;
  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otrosNombres: string;
  actividadEconomica: string;
  codigoMunicipio: string;
  departamento: string;
  esResidenteFiscal: boolean;
  anosDeclarando: 'primero' | 'segundo' | 'tercero_o_mas';
}

export interface ObligationData {
  patrimonioBruto: number;
  ingresosBrutos: number;
  consumosTarjetaCredito: number;
  comprasTotales: number;
  consignacionesBancarias: number;
  esResponsableIVA: boolean;
}

export interface PatrimonyData {
  efectivoYEquivalentes: number;
  cuentasBancarias: number;
  inversionesYAcciones: number;
  bienesRaices: number;
  vehiculos: number;
  otrosActivos: number;
  deudasFinancieras: number;
  otrasDeudas: number;
  patrimonioLiquidoAnoAnterior: number;
}

export interface RentasTrabajoData {
  salariosYPrestaciones: number;
  honorariosCompensacionesSinCostos: number;
  cesantiasInteresesPagadasOReconocidas: number;
  otrosIngresosLaborales: number;
  ingresosExteriorLaborales: number;
  // INCRNGO
  aportesSaludObligatorios: number;
  aportesPensionObligatorios: number;
  aportesFondoSolidaridadPensional: number;
  otrosIncrngoTrabajo: number;
  // Deducciones generales imputables
  interesesVivienda: number;
  saludPrepagada: number;
  dependientesTradicionalesCount: number; // Art 387 (10% ingreso bruto, max 32 UVT/mes)
  gmfDeducible50: number; // 50% del 4x1000
  // Rentas exentas laborales
  cesantiasExentas: number; // Art 206 num 4
  aportesVoluntariosPensionFVP: number; // Art 126-1
  aportesCuentasAFC: number; // Art 126-4
  otrasRentasExentasLaborales: number;
  // Nuevas deducciones Ley 2277 de 2022 (Fuera del límite del 40% y 1.340 UVT)
  dependientesAdicionales72UVTCount: number; // Hasta 4 dependientes x 72 UVT cada uno
  comprasFacturaElectronica1Porciento: number; // Total compras con FE sin relacion causalidad (se deduce el 1%, max 240 UVT)
}

export interface RentasCapitalData {
  interesesYRendimientosFinancieros: number;
  arrendamientos: number;
  regaliasYPropiedadIntelectual: number;
  otrosIngresosCapital: number;
  ingresosExteriorCapital: number;
  // INCRNGO
  componenteInflacionario: number;
  aportesSeguridadSocialCapital: number;
  otrosIncrngoCapital: number;
  // Costos y gastos procedentes
  costosProcedentesCapital: number;
  // Rentas exentas y deducciones
  interesesViviendaCapital: number;
  gmfDeducibleCapital: number;
  otrasDeduccionesCapital: number;
  rentasExentasCapital: number;
}

export interface RentasNoLaboralesData {
  ingresosComercioIndustriaServicios: number;
  otrosIngresosNoLaborales: number;
  devolucionesRebajasDescuentos: number;
  // INCRNGO
  aportesSeguridadSocialNoLaboral: number;
  otrosIncrngoNoLaborales: number;
  // Costos y gastos procedentes
  costosProcedentesNoLaborales: number;
  // Rentas exentas y deducciones
  deduccionesImputablesNoLaborales: number;
  rentasExentasNoLaborales: number;
}

export interface RentasPensionesData {
  pensionesJubilacionVejezColombia: number;
  pensionesInvalidezSobrevivientes: number;
  pensionesExterior: number;
  aportesSaludPensionados: number;
  otrasRentasExentasPensiones: number;
}

export interface DividendosData {
  subcedula1_2017EnAdelanteNoGravados: number; // Art 49 no gravados recibidos en 2025
  subcedula2_2017EnAdelanteGravados: number; // Art 49 gravados recibidos en 2025
  dividendos2016YAnterioresNoGravados: number;
  dividendos2016YAnterioresGravados: number;
  dividendosECEYExterior: number;
}

export interface GananciasOcasionalesData {
  ventaActivosFijosPoseidos2MasAnos: number;
  costoFiscalActivosVendidos: number;
  herenciasLegadosDonaciones: number;
  indemnizacionesSegurosVida: number;
  loteriasRifasApuestasPremios: number;
  gananciasOcasionalesExentasYNoGravadas: number; // Art. 307 E.T. (primeras 3.250 UVT vivienda o asignaciones)
}

export interface LiquidacionAvanzadaData {
  compensacionPerdidasAnosAnteriores: number;
  compensacionExcesoRentaPresuntiva: number;
  descuentoImpuestosExterior: number; // Art 254
  descuentoDonacionesArt257: number; // 25% de donaciones aprobadas
  otrosDescuentosTributarios: number;
  retencionesEnLaFuenteRenta2025: number;
  retencionesGananciaOcasional: number;
  anticipoRentaAnoAnteriorPara2025: number; // Calculado en la declaracion 2024
  metodoAnticipo2026: 'procedimiento1' | 'procedimiento2';
  saldoAFavorAnoAnteriorSinDevolucion: number;
  diasMesesExtemporaneidad: number;
  esCorreccion: boolean;
  mayorValorPagarCorreccion: number;
}

export interface Form210Declaration {
  taxpayer: TaxpayerInfo;
  uvtValue: number; // Por defecto $49,799 para AG 2025
  uvt2026Value: number; // Por defecto $52,374
  patrimony: PatrimonyData;
  rentasTrabajo: RentasTrabajoData;
  rentasCapital: RentasCapitalData;
  rentasNoLaborales: RentasNoLaboralesData;
  rentasPensiones: RentasPensionesData;
  dividendos: DividendosData;
  gananciasOcasionales: GananciasOcasionalesData;
  liquidacionAvanzada: LiquidacionAvanzadaData;
  obligation: ObligationData;
}

export interface RentasTrabajoCalculation {
  ingresoBruto: number;
  incrngo: number;
  ingresoNeto: number;
  deduccionesGenerales: number;
  rentasExentasEspecificas: number;
  rentaExenta25: number;
  totalBeneficiosSujetosLimite: number;
  limite40Porciento: number;
  limite1340UVT: number;
  limiteAplicable40o1340: number;
  beneficiosAceptadosDentroLimite: number;
  // Ley 2277 extras
  deduccionDependientes72UVT: number;
  deduccionFacturaElectronica1Porciento: number;
  rentaLiquidaRentasTrabajo: number;
}

export interface RentasCapitalCalculation {
  ingresoBruto: number;
  incrngo: number;
  ingresoNeto: number;
  costosProcedentes: number;
  rentaLiquidaOrdinaria: number;
  deduccionesYRentasExentas: number;
  rentaLiquidaCapital: number;
}

export interface RentasNoLaboralesCalculation {
  ingresoBruto: number;
  devoluciones: number;
  ingresoNetoSinDevoluciones: number;
  incrngo: number;
  ingresoNeto: number;
  costosProcedentes: number;
  rentaLiquidaOrdinaria: number;
  deduccionesYRentasExentas: number;
  rentaLiquidaNoLaboral: number;
}

export interface CedulaGeneralCalculation {
  rentaLiquidaTrabajo: number;
  rentaLiquidaCapital: number;
  rentaLiquidaNoLaboral: number;
  rentaLiquidaCedulaGeneralSinCompensacion: number;
  compensacionesAplicadas: number;
  rentaLiquidaGravableCedulaGeneral: number;
  rentaLiquidaGravableUVT: number;
}

export interface RentasPensionesCalculation {
  ingresoBruto: number;
  incrngo: number;
  ingresoNeto: number;
  rentaExentaPensiones: number; // max 12.000 UVT
  rentaLiquidaGravablePensiones: number;
}

export interface DividendosCalculation {
  subcedula1NoGravados: number; // Se suma a tarifa 241 con descuento marginal
  subcedula2Gravados: number; // 35% tarifa societaria + remanente
  impuestoDirectoSubcedula2_35: number;
  dividendosAnteriores2016: number;
  rentaLiquidaGravableDividendos: number;
  impuestoDividendosCalculado: number;
  descuentoMarginalArt242: number;
}

export interface GananciasOcasionalesCalculation {
  ingresosTotales: number;
  costosProcedentes: number;
  gananciaOcasionalNeta: number;
  gananciasOcasionalesExentas: number;
  gananciaOcasionalGravableGeneral: number;
  gananciaOcasionalGravableLoterias: number;
  impuestoGananciaOcasionalGeneral15: number;
  impuestoGananciaOcasionalLoterias20: number;
  totalImpuestoGananciasOcasionales: number;
}

export interface LiquidacionPrivadaCalculation {
  baseGravableArticulo241: number; // Cedula general + pensiones + dividendos subcedula 1
  baseGravableArticulo241_UVT: number;
  impuestoArticulo241: number;
  impuestoCedulaGeneralYPensiones: number;
  impuestoTotalRentasLiquidas: number;
  totalDescuentosTributarios: number;
  limiteDescuentosTributarios: number;
  descuentosTributariosEfectivos: number;
  impuestoNetoDeRenta: number;
  totalImpuestoCargo: number;
  totalRetenciones: number;
  anticipoCalculado2026: number;
  totalSaldoImpuesto: number;
  sancionExtemporaneidad: number;
  saldoAPagar: number;
  saldoAFavor: number;
  tasaEfectivaTributacion: number; // Impuesto neto renta / Ingresos brutos totales
}

export interface ConciliacionPatrimonialCalculation {
  patrimonioLiquidoAnoActual: number;
  patrimonioLiquidoAnoAnterior: number;
  incrementoPatrimonial: number;
  totalRentasLiquidasGravables: number;
  totalRentasExentas: number;
  gananciasOcasionalesNetas: number;
  ingresosNoConstitutivosTotal: number;
  justificacionTotalPatrimonial: number;
  diferenciaPatrimonial: number; // Si es > 0, posible renta por comparación patrimonial
  alertaRentaPorComparacion: boolean;
}

export interface ObligationEvaluation {
  obligadoADeclarar: boolean;
  causales: {
    patrimonio: boolean;
    ingresos: boolean;
    tarjetaCredito: boolean;
    comprasTotales: boolean;
    consignaciones: boolean;
    responsableIVA: boolean;
  };
  valoresYTopes: {
    nombre: string;
    valorActual: number;
    topeUVT: number;
    topePesos: number;
    supera: boolean;
  }[];
}

export interface Form210Renglones {
  [key: string]: number | string;
}

export interface CompleteTaxResult {
  trabajo: RentasTrabajoCalculation;
  capital: RentasCapitalCalculation;
  noLaboral: RentasNoLaboralesCalculation;
  cedulaGeneral: CedulaGeneralCalculation;
  pensiones: RentasPensionesCalculation;
  dividendos: DividendosCalculation;
  gananciasOcasionales: GananciasOcasionalesCalculation;
  liquidacion: LiquidacionPrivadaCalculation;
  conciliacion: ConciliacionPatrimonialCalculation;
  obligacion: ObligationEvaluation;
  renglonesForm210: Form210Renglones;
}
