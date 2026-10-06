import {
  Form210Declaration,
  CompleteTaxResult,
  RentasTrabajoCalculation,
  RentasCapitalCalculation,
  RentasNoLaboralesCalculation,
  CedulaGeneralCalculation,
  RentasPensionesCalculation,
  DividendosCalculation,
  GananciasOcasionalesCalculation,
  LiquidacionPrivadaCalculation,
  ConciliacionPatrimonialCalculation,
  ObligationEvaluation,
  Form210Renglones,
} from '../types/tax';
import {
  TABLA_ARTICULO_241,
  LIMITES_DEDUCCIONES,
  TOPES_OBLIGATORIEDAD_UVT,
  TARIFAS_GANANCIAS_OCASIONALES,
  SANCION_MINIMA_UVT,
} from '../data/taxConstants';

/**
 * Calcula el impuesto según la tabla del Artículo 241 del Estatuto Tributario
 * @param baseEnPesos Base gravable en pesos colombianos
 * @param uvt Valor del UVT del año gravable
 * @returns Impuesto liquidado en pesos colombianos (redondeado a miles según norma DIAN)
 */
export function calcularImpuestoArticulo241(baseEnPesos: number, uvt: number): { impuestoPesos: number; baseUVT: number; impuestoUVT: number } {
  if (baseEnPesos <= 0) return { impuestoPesos: 0, baseUVT: 0, impuestoUVT: 0 };

  const baseUVT = baseEnPesos / uvt;
  let impuestoUVT = 0;

  for (const tramo of TABLA_ARTICULO_241) {
    if (tramo.hastaUVT === null) {
      // Último tramo: más de 31.000 UVT
      if (baseUVT > tramo.desdeUVT) {
        impuestoUVT = tramo.impuestoBaseUVT + (baseUVT - tramo.desdeUVT) * tramo.tarifaMarginal;
        break;
      }
    } else if (baseUVT > tramo.desdeUVT && baseUVT <= tramo.hastaUVT) {
      impuestoUVT = tramo.impuestoBaseUVT + (baseUVT - tramo.desdeUVT) * tramo.tarifaMarginal;
      break;
    }
  }

  const impuestoPesos = Math.round(impuestoUVT * uvt);
  return {
    impuestoPesos: Math.max(0, redondearAMiles(impuestoPesos)),
    baseUVT: Math.round(baseUVT * 100) / 100,
    impuestoUVT: Math.round(impuestoUVT * 100) / 100,
  };
}

/**
 * Redondeo oficial a miles de la DIAN (Art. 577 E.T.)
 */
export function redondearAMiles(valor: number): number {
  return Math.round(valor / 1000) * 1000;
}

/**
 * Evalúa los topes legales para estar obligado a declarar renta AG 2025
 */
export function evaluarObligacionDeclarar(declaration: Form210Declaration): ObligationEvaluation {
  const uvt = declaration.uvtValue;
  const p = declaration.patrimony;
  const o = declaration.obligation;
  const rTrabajo = declaration.rentasTrabajo;
  const rCapital = declaration.rentasCapital;
  const rNoLaboral = declaration.rentasNoLaborales;
  const rPension = declaration.rentasPensiones;
  const rDiv = declaration.dividendos;
  const rGO = declaration.gananciasOcasionales;

  // Patrimonio bruto calculado
  const patrimonioBrutoTotal =
    p.efectivoYEquivalentes +
    p.cuentasBancarias +
    p.inversionesYAcciones +
    p.bienesRaices +
    p.vehiculos +
    p.otrosActivos;

  const patrimonioBrutoEval = Math.max(patrimonioBrutoTotal, o.patrimonioBruto || 0);

  // Total ingresos brutos ordinarios y extraordinarios
  const ingresosBrutosTotal =
    (rTrabajo.salariosYPrestaciones +
      rTrabajo.honorariosCompensacionesSinCostos +
      rTrabajo.cesantiasInteresesPagadasOReconocidas +
      rTrabajo.otrosIngresosLaborales +
      rTrabajo.ingresosExteriorLaborales) +
    (rCapital.interesesYRendimientosFinancieros +
      rCapital.arrendamientos +
      rCapital.regaliasYPropiedadIntelectual +
      rCapital.otrosIngresosCapital +
      rCapital.ingresosExteriorCapital) +
    (rNoLaboral.ingresosComercioIndustriaServicios +
      rNoLaboral.otrosIngresosNoLaborales) +
    (rPension.pensionesJubilacionVejezColombia +
      rPension.pensionesInvalidezSobrevivientes +
      rPension.pensionesExterior) +
    (rDiv.subcedula1_2017EnAdelanteNoGravados +
      rDiv.subcedula2_2017EnAdelanteGravados +
      rDiv.dividendos2016YAnterioresNoGravados +
      rDiv.dividendos2016YAnterioresGravados) +
    (rGO.ventaActivosFijosPoseidos2MasAnos +
      rGO.herenciasLegadosDonaciones +
      rGO.indemnizacionesSegurosVida +
      rGO.loteriasRifasApuestasPremios);

  const ingresosBrutosEval = Math.max(ingresosBrutosTotal, o.ingresosBrutos || 0);

  const topePatrimonioPesos = TOPES_OBLIGATORIEDAD_UVT.PATRIMONIO_BRUTO * uvt;
  const topeIngresosPesos = TOPES_OBLIGATORIEDAD_UVT.INGRESOS_BRUTOS * uvt;
  const topeTarjetaPesos = TOPES_OBLIGATORIEDAD_UVT.CONSUMOS_TARJETA * uvt;
  const topeComprasPesos = TOPES_OBLIGATORIEDAD_UVT.COMPRAS_CONSUMOS * uvt;
  const topeConsignacionesPesos = TOPES_OBLIGATORIEDAD_UVT.CONSIGNACIONES_BANCARIAS * uvt;

  const causalPatrimonio = patrimonioBrutoEval > topePatrimonioPesos;
  const causalIngresos = ingresosBrutosEval >= topeIngresosPesos;
  const causalTarjeta = (o.consumosTarjetaCredito || 0) >= topeTarjetaPesos;
  const causalCompras = (o.comprasTotales || 0) >= topeComprasPesos;
  const causalConsignaciones = (o.consignacionesBancarias || 0) >= topeConsignacionesPesos;
  const causalIVA = !!o.esResponsableIVA;

  const obligado =
    causalPatrimonio ||
    causalIngresos ||
    causalTarjeta ||
    causalCompras ||
    causalConsignaciones ||
    causalIVA;

  return {
    obligadoADeclarar: obligado,
    causales: {
      patrimonio: causalPatrimonio,
      ingresos: causalIngresos,
      tarjetaCredito: causalTarjeta,
      comprasTotales: causalCompras,
      consignaciones: causalConsignaciones,
      responsableIVA: causalIVA,
    },
    valoresYTopes: [
      {
        nombre: 'Patrimonio Bruto a 31 de diciembre de 2025',
        valorActual: patrimonioBrutoEval,
        topeUVT: TOPES_OBLIGATORIEDAD_UVT.PATRIMONIO_BRUTO,
        topePesos: topePatrimonioPesos,
        supera: causalPatrimonio,
      },
      {
        nombre: 'Ingresos Brutos en el año gravable 2025',
        valorActual: ingresosBrutosEval,
        topeUVT: TOPES_OBLIGATORIEDAD_UVT.INGRESOS_BRUTOS,
        topePesos: topeIngresosPesos,
        supera: causalIngresos,
      },
      {
        nombre: 'Consumos mediante Tarjeta de Crédito en 2025',
        valorActual: o.consumosTarjetaCredito || 0,
        topeUVT: TOPES_OBLIGATORIEDAD_UVT.CONSUMOS_TARJETA,
        topePesos: topeTarjetaPesos,
        supera: causalTarjeta,
      },
      {
        nombre: 'Compras y consumos totales en 2025',
        valorActual: o.comprasTotales || 0,
        topeUVT: TOPES_OBLIGATORIEDAD_UVT.COMPRAS_CONSUMOS,
        topePesos: topeComprasPesos,
        supera: causalCompras,
      },
      {
        nombre: 'Consignaciones bancarias, depósitos e inversiones en 2025',
        valorActual: o.consignacionesBancarias || 0,
        topeUVT: TOPES_OBLIGATORIEDAD_UVT.CONSIGNACIONES_BANCARIAS,
        topePesos: topeConsignacionesPesos,
        supera: causalConsignaciones,
      },
    ],
  };
}

/**
 * Ejecuta la liquidación completa del Formulario 210 de la DIAN para el AG 2025
 */
export function liquidarFormulario210(declaration: Form210Declaration): CompleteTaxResult {
  const uvt = declaration.uvtValue || 49799;
  const uvt2026 = declaration.uvt2026Value || 52374;
  const rTrab = declaration.rentasTrabajo;
  const rCap = declaration.rentasCapital;
  const rNoLab = declaration.rentasNoLaborales;
  const rPens = declaration.rentasPensiones;
  const rDiv = declaration.dividendos;
  const rGO = declaration.gananciasOcasionales;
  const p = declaration.patrimony;
  const liq = declaration.liquidacionAvanzada;

  // ==========================================
  // 1. CÉDULA GENERAL: RENTAS DE TRABAJO
  // ==========================================
  const ingresoBrutoTrabajo =
    rTrab.salariosYPrestaciones +
    rTrab.honorariosCompensacionesSinCostos +
    rTrab.cesantiasInteresesPagadasOReconocidas +
    rTrab.otrosIngresosLaborales +
    rTrab.ingresosExteriorLaborales;

  const incrngoTrabajo =
    rTrab.aportesSaludObligatorios +
    rTrab.aportesPensionObligatorios +
    rTrab.aportesFondoSolidaridadPensional +
    rTrab.otrosIncrngoTrabajo;

  const ingresoNetoTrabajo = Math.max(0, ingresoBrutoTrabajo - incrngoTrabajo);

  // Deducción tradicional por dependientes (Art. 387 E.T.)
  let deduccionDependientesTradicional = 0;
  if (rTrab.dependientesTradicionalesCount > 0) {
    const tope384UVT = LIMITES_DEDUCCIONES.TOPE_UVT_ANUAL_DEPENDIENTE_TRADICIONAL * uvt;
    const maxDiezPorciento = ingresoBrutoTrabajo * LIMITES_DEDUCCIONES.PORCENTAJE_DEPENDIENTES_TRADICIONAL;
    deduccionDependientesTradicional = Math.min(maxDiezPorciento, tope384UVT);
  }

  // Intereses de vivienda (Art. 119 E.T.) - max 1.200 UVT
  const topeInteresesVivienda = LIMITES_DEDUCCIONES.TOPE_UVT_ANUAL_INTERESES_VIVIENDA * uvt;
  const deduccionInteresesVivienda = Math.min(rTrab.interesesVivienda || 0, topeInteresesVivienda);

  // Salud prepagada (Art. 387 E.T.) - max 192 UVT
  const topeSaludPrepagada = LIMITES_DEDUCCIONES.TOPE_UVT_ANUAL_SALUD_PREPAGADA * uvt;
  const deduccionSaludPrepagada = Math.min(rTrab.saludPrepagada || 0, topeSaludPrepagada);

  // GMF deducible (Art. 115 E.T.) - 50% soportado
  const deduccionGMF = (rTrab.gmfDeducible50 || 0);

  const deduccionesGeneralesTrabajo =
    deduccionDependientesTradicional +
    deduccionInteresesVivienda +
    deduccionSaludPrepagada +
    deduccionGMF;

  // Rentas exentas específicas (FVP, AFC, Cesantías exentas, otras)
  const topeFVPAFC = Math.min(
    ingresoBrutoTrabajo * LIMITES_DEDUCCIONES.PORCENTAJE_MAX_FVP_AFC,
    LIMITES_DEDUCCIONES.TOPE_UVT_ANUAL_FVP_AFC * uvt
  );
  const totalFVPAFC = Math.min((rTrab.aportesVoluntariosPensionFVP || 0) + (rTrab.aportesCuentasAFC || 0), topeFVPAFC);
  const rentasExentasEspecificas =
    totalFVPAFC +
    (rTrab.cesantiasExentas || 0) +
    (rTrab.otrasRentasExentasLaborales || 0);

  // Base para renta exenta del 25% (Art. 206 Num. 10 E.T.)
  // Base = Ingreso Neto - Deducciones Generales - Rentas Exentas Específicas
  const baseParaExenta25 = Math.max(0, ingresoNetoTrabajo - deduccionesGeneralesTrabajo - rentasExentasEspecificas);
  const tope790UVT = LIMITES_DEDUCCIONES.TOPE_UVT_ANUAL_EXENTA_LABORAL * uvt;
  const rentaExenta25Calculada = Math.min(baseParaExenta25 * LIMITES_DEDUCCIONES.PORCENTAJE_EXENTA_LABORAL, tope790UVT);

  // Beneficios totales sujetos al límite general conjunto (40% o 1.340 UVT)
  const totalBeneficiosSujetosLimite =
    deduccionesGeneralesTrabajo +
    rentasExentasEspecificas +
    rentaExenta25Calculada;

  const limite40Porciento = ingresoNetoTrabajo * LIMITES_DEDUCCIONES.PORCENTAJE_LIMITE_GENERAL;
  const limite1340UVT = LIMITES_DEDUCCIONES.TOPE_UVT_LIMITE_GENERAL * uvt;
  const limiteAplicable40o1340 = Math.min(limite40Porciento, limite1340UVT);

  const beneficiosAceptadosDentroLimite = Math.min(totalBeneficiosSujetosLimite, limiteAplicable40o1340);

  // Deducciones EXTRAORDINARIAS de la Ley 2277 de 2022 (NO sujetas al límite del 40% ni 1.340 UVT)
  // 1. Dependientes adicionales: hasta 4 dependientes a 72 UVT cada uno (Art. 336 Parágrafo 2)
  const dependientesExtraCount = Math.min(Math.max(0, rTrab.dependientesAdicionales72UVTCount || 0), LIMITES_DEDUCCIONES.MAX_DEPENDIENTES_ADICIONALES);
  const deduccionDependientes72UVT = dependientesExtraCount * LIMITES_DEDUCCIONES.UVT_POR_DEPENDIENTE_ADICIONAL * uvt;

  // 2. Factura electrónica 1% de compras y servicios (Art. 336 Numeral 5) - max 240 UVT
  const tope240UVT = LIMITES_DEDUCCIONES.TOPE_UVT_FACTURA_ELECTRONICA * uvt;
  const deduccionFacturaElectronica1Porciento = Math.min(
    (rTrab.comprasFacturaElectronica1Porciento || 0) * LIMITES_DEDUCCIONES.PORCENTAJE_FACTURA_ELECTRONICA,
    tope240UVT
  );

  // Renta Líquida Rentas de Trabajo
  const rentaLiquidaRentasTrabajo = Math.max(
    0,
    ingresoNetoTrabajo -
      beneficiosAceptadosDentroLimite -
      deduccionDependientes72UVT -
      deduccionFacturaElectronica1Porciento
  );

  const calcTrabajo: RentasTrabajoCalculation = {
    ingresoBruto: ingresoBrutoTrabajo,
    incrngo: incrngoTrabajo,
    ingresoNeto: ingresoNetoTrabajo,
    deduccionesGenerales: deduccionesGeneralesTrabajo,
    rentasExentasEspecificas,
    rentaExenta25: rentaExenta25Calculada,
    totalBeneficiosSujetosLimite,
    limite40Porciento,
    limite1340UVT,
    limiteAplicable40o1340,
    beneficiosAceptadosDentroLimite,
    deduccionDependientes72UVT,
    deduccionFacturaElectronica1Porciento,
    rentaLiquidaRentasTrabajo,
  };

  // ==========================================
  // 2. CÉDULA GENERAL: RENTAS DE CAPITAL
  // ==========================================
  const ingresoBrutoCapital =
    rCap.interesesYRendimientosFinancieros +
    rCap.arrendamientos +
    rCap.regaliasYPropiedadIntelectual +
    rCap.otrosIngresosCapital +
    rCap.ingresosExteriorCapital;

  const incrngoCapital =
    rCap.componenteInflacionario +
    rCap.aportesSeguridadSocialCapital +
    rCap.otrosIncrngoCapital;

  const ingresoNetoCapital = Math.max(0, ingresoBrutoCapital - incrngoCapital);
  const costosProcedentesCapital = rCap.costosProcedentesCapital || 0;
  const rentaLiquidaOrdinariaCapital = Math.max(0, ingresoNetoCapital - costosProcedentesCapital);

  const deduccionesYRentasExentasCapital = Math.min(
    rentaLiquidaOrdinariaCapital,
    (rCap.interesesViviendaCapital || 0) +
      (rCap.gmfDeducibleCapital || 0) +
      (rCap.otrasDeduccionesCapital || 0) +
      (rCap.rentasExentasCapital || 0)
  );

  const rentaLiquidaCapital = Math.max(0, rentaLiquidaOrdinariaCapital - deduccionesYRentasExentasCapital);

  const calcCapital: RentasCapitalCalculation = {
    ingresoBruto: ingresoBrutoCapital,
    incrngo: incrngoCapital,
    ingresoNeto: ingresoNetoCapital,
    costosProcedentes: costosProcedentesCapital,
    rentaLiquidaOrdinaria: rentaLiquidaOrdinariaCapital,
    deduccionesYRentasExentas: deduccionesYRentasExentasCapital,
    rentaLiquidaCapital,
  };

  // ==========================================
  // 3. CÉDULA GENERAL: RENTAS NO LABORALES
  // ==========================================
  const ingresoBrutoNoLaboral =
    rNoLab.ingresosComercioIndustriaServicios + rNoLab.otrosIngresosNoLaborales;
  const devolucionesNoLaboral = rNoLab.devolucionesRebajasDescuentos || 0;
  const ingresoNetoSinDevolucionesNoLaboral = Math.max(0, ingresoBrutoNoLaboral - devolucionesNoLaboral);

  const incrngoNoLaboral =
    rNoLab.aportesSeguridadSocialNoLaboral + (rNoLab.otrosIncrngoNoLaborales || 0);

  const ingresoNetoNoLaboral = Math.max(0, ingresoNetoSinDevolucionesNoLaboral - incrngoNoLaboral);
  const costosProcedentesNoLaboral = rNoLab.costosProcedentesNoLaborales || 0;
  const rentaLiquidaOrdinariaNoLaboral = Math.max(0, ingresoNetoNoLaboral - costosProcedentesNoLaboral);

  const deduccionesYRentasExentasNoLaboral = Math.min(
    rentaLiquidaOrdinariaNoLaboral,
    (rNoLab.deduccionesImputablesNoLaborales || 0) + (rNoLab.rentasExentasNoLaborales || 0)
  );

  const rentaLiquidaNoLaboral = Math.max(0, rentaLiquidaOrdinariaNoLaboral - deduccionesYRentasExentasNoLaboral);

  const calcNoLaboral: RentasNoLaboralesCalculation = {
    ingresoBruto: ingresoBrutoNoLaboral,
    devoluciones: devolucionesNoLaboral,
    ingresoNetoSinDevoluciones: ingresoNetoSinDevolucionesNoLaboral,
    incrngo: incrngoNoLaboral,
    ingresoNeto: ingresoNetoNoLaboral,
    costosProcedentes: costosProcedentesNoLaboral,
    rentaLiquidaOrdinaria: rentaLiquidaOrdinariaNoLaboral,
    deduccionesYRentasExentas: deduccionesYRentasExentasNoLaboral,
    rentaLiquidaNoLaboral,
  };

  // ==========================================
  // 4. CONSOLIDACIÓN CÉDULA GENERAL
  // ==========================================
  const rentaLiquidaCedulaGeneralSinCompensacion =
    rentaLiquidaRentasTrabajo + rentaLiquidaCapital + rentaLiquidaNoLaboral;

  const totalCompensacionesSolicitadas =
    (liq.compensacionPerdidasAnosAnteriores || 0) +
    (liq.compensacionExcesoRentaPresuntiva || 0);

  const compensacionesAplicadas = Math.min(
    rentaLiquidaCedulaGeneralSinCompensacion,
    totalCompensacionesSolicitadas
  );

  const rentaLiquidaGravableCedulaGeneral = Math.max(
    0,
    rentaLiquidaCedulaGeneralSinCompensacion - compensacionesAplicadas
  );

  const calcCedulaGeneral: CedulaGeneralCalculation = {
    rentaLiquidaTrabajo: rentaLiquidaRentasTrabajo,
    rentaLiquidaCapital,
    rentaLiquidaNoLaboral,
    rentaLiquidaCedulaGeneralSinCompensacion,
    compensacionesAplicadas,
    rentaLiquidaGravableCedulaGeneral,
    rentaLiquidaGravableUVT: Math.round((rentaLiquidaGravableCedulaGeneral / uvt) * 100) / 100,
  };

  // ==========================================
  // 5. CÉDULA DE PENSIONES (Art. 337 y 206 #9 E.T.)
  // ==========================================
  const ingresoBrutoPensiones =
    rPens.pensionesJubilacionVejezColombia +
    rPens.pensionesInvalidezSobrevivientes +
    rPens.pensionesExterior;

  const incrngoPensiones = rPens.aportesSaludPensionados || 0;
  const ingresoNetoPensiones = Math.max(0, ingresoBrutoPensiones - incrngoPensiones);

  // Exención de hasta 1.000 UVT mensuales = 12.000 UVT anuales
  const topeExencionPensiones = LIMITES_DEDUCCIONES.TOPE_UVT_ANUAL_PENSIONES_EXENTAS * uvt;
  const rentaExentaPensiones = Math.min(ingresoNetoPensiones, topeExencionPensiones);
  const rentaLiquidaGravablePensiones = Math.max(0, ingresoNetoPensiones - rentaExentaPensiones);

  const calcPensiones: RentasPensionesCalculation = {
    ingresoBruto: ingresoBrutoPensiones,
    incrngo: incrngoPensiones,
    ingresoNeto: ingresoNetoPensiones,
    rentaExentaPensiones,
    rentaLiquidaGravablePensiones,
  };

  // ==========================================
  // 6. CÉDULA DE DIVIDENDOS Y PARTICIPACIONES (Ley 2277 / Art. 242 E.T.)
  // ==========================================
  // Subcédula 1: 2017 y siguientes utilidades no gravadas (van a la tabla 241, con descuento del 19% marginal para > 1.090 UVT)
  const divSub1NoGravados = rDiv.subcedula1_2017EnAdelanteNoGravados || 0;

  // Subcédula 2: 2017 y siguientes utilidades gravadas (35% tarifa societaria + remanente a tabla 241)
  const divSub2Gravados = rDiv.subcedula2_2017EnAdelanteGravados || 0;
  const impuestoDirectoSubcedula2_35 = Math.round(divSub2Gravados * 0.35);
  const remanenteSub2ParaTabla241 = divSub2Gravados - impuestoDirectoSubcedula2_35;

  const dividendosAnteriores2016 =
    (rDiv.dividendos2016YAnterioresNoGravados || 0) +
    (rDiv.dividendos2016YAnterioresGravados || 0) +
    (rDiv.dividendosECEYExterior || 0);

  const rentaLiquidaGravableDividendos = divSub1NoGravados + remanenteSub2ParaTabla241 + dividendosAnteriores2016;

  // Descuento tributario marginal del 19% para dividendos no gravados recibidos por personas naturales (Art. 254-1 / Art. 242 E.T.)
  // Aplica sobre la porción de dividendos de la subcédula 1 que exceda de 1.090 UVT
  const tope1090UVTPesos = 1090 * uvt;
  let descuentoMarginalArt242 = 0;
  if (divSub1NoGravados > tope1090UVTPesos) {
    descuentoMarginalArt242 = Math.round((divSub1NoGravados - tope1090UVTPesos) * 0.19);
  }

  const calcDividendos: DividendosCalculation = {
    subcedula1NoGravados: divSub1NoGravados,
    subcedula2Gravados: divSub2Gravados,
    impuestoDirectoSubcedula2_35,
    dividendosAnteriores2016,
    rentaLiquidaGravableDividendos,
    impuestoDividendosCalculado: impuestoDirectoSubcedula2_35,
    descuentoMarginalArt242,
  };

  // ==========================================
  // 7. GANANCIAS OCASIONALES (Art. 300 - 317 E.T., Ley 2277)
  // ==========================================
  const ingresosVentaActivos2Anos = rGO.ventaActivosFijosPoseidos2MasAnos || 0;
  const costoFiscalActivos = Math.min(ingresosVentaActivos2Anos, rGO.costoFiscalActivosVendidos || 0);
  const gananciaVentaActivos = Math.max(0, ingresosVentaActivos2Anos - costoFiscalActivos);

  const herenciasYDonaciones = rGO.herenciasLegadosDonaciones || 0;
  const indemnizacionesSeguros = rGO.indemnizacionesSegurosVida || 0;
  const loteriasRifas = rGO.loteriasRifasApuestasPremios || 0;

  const ingresosTotalesGO =
    ingresosVentaActivos2Anos +
    herenciasYDonaciones +
    indemnizacionesSeguros +
    loteriasRifas;

  const gananciaOcasionalNeta =
    gananciaVentaActivos +
    herenciasYDonaciones +
    indemnizacionesSeguros +
    loteriasRifas;

  const gananciasOcasionalesExentas = Math.min(
    gananciaOcasionalNeta,
    rGO.gananciasOcasionalesExentasYNoGravadas || 0
  );

  // Separar ganancia gravable sujeta a tarifa general (15%) de loterías/rifas (20%)
  const gananciaGravableTotal = Math.max(0, gananciaOcasionalNeta - gananciasOcasionalesExentas);
  const gananciaOcasionalGravableLoterias = Math.min(loteriasRifas, gananciaGravableTotal);
  const gananciaOcasionalGravableGeneral = Math.max(0, gananciaGravableTotal - gananciaOcasionalGravableLoterias);

  const impuestoGananciaOcasionalGeneral15 = Math.round(
    gananciaOcasionalGravableGeneral * TARIFAS_GANANCIAS_OCASIONALES.GENERAL
  );
  const impuestoGananciaOcasionalLoterias20 = Math.round(
    gananciaOcasionalGravableLoterias * TARIFAS_GANANCIAS_OCASIONALES.LOTERIAS_RIFAS
  );
  const totalImpuestoGananciasOcasionales =
    impuestoGananciaOcasionalGeneral15 + impuestoGananciaOcasionalLoterias20;

  const calcGananciasOcasionales: GananciasOcasionalesCalculation = {
    ingresosTotales: ingresosTotalesGO,
    costosProcedentes: costoFiscalActivos,
    gananciaOcasionalNeta,
    gananciasOcasionalesExentas,
    gananciaOcasionalGravableGeneral,
    gananciaOcasionalGravableLoterias,
    impuestoGananciaOcasionalGeneral15,
    impuestoGananciaOcasionalLoterias20,
    totalImpuestoGananciasOcasionales,
  };

  // ==========================================
  // 8. LIQUIDACIÓN PRIVADA Y TARIFA ARTÍCULO 241
  // ==========================================
  // Base combinada para el Art. 241 E.T. (Cédula General + Pensiones + Dividendos Subcédula 1 y remanente)
  const baseGravableArticulo241 =
    rentaLiquidaGravableCedulaGeneral +
    rentaLiquidaGravablePensiones +
    divSub1NoGravados +
    remanenteSub2ParaTabla241;

  const resultadoTabla241 = calcularImpuestoArticulo241(baseGravableArticulo241, uvt);
  const impuestoArticulo241 = resultadoTabla241.impuestoPesos;

  // Impuesto proporcional de Cédula General y Pensiones vs Dividendos
  const totalImpuestoRentas = impuestoArticulo241 + impuestoDirectoSubcedula2_35;

  // Descuentos tributarios (Art. 254 exterior, Art. 257 donaciones 25%, Art. 254-1 descuento por dividendos)
  const descuentoDonaciones = (liq.descuentoDonacionesArt257 || 0);
  const descuentoExterior = (liq.descuentoImpuestosExterior || 0);
  const otrosDescuentos = (liq.otrosDescuentosTributarios || 0);

  const totalDescuentosSolicitados =
    descuentoDonaciones +
    descuentoExterior +
    otrosDescuentos +
    descuentoMarginalArt242;

  // Límite de descuentos tributarios: No pueden superar el impuesto básico de renta (Art. 259 E.T.)
  const limiteDescuentosTributarios = totalImpuestoRentas;
  const descuentosTributariosEfectivos = Math.min(totalDescuentosSolicitados, limiteDescuentosTributarios);

  const impuestoNetoDeRenta = Math.max(0, totalImpuestoRentas - descuentosTributariosEfectivos);
  const totalImpuestoCargo = impuestoNetoDeRenta + totalImpuestoGananciasOcasionales;

  // Retenciones en la fuente
  const totalRetenciones =
    (liq.retencionesEnLaFuenteRenta2025 || 0) +
    (liq.retencionesGananciaOcasional || 0);

  // Anticipo de renta para el año gravable 2026 (Art. 807 E.T.)
  let porcentajeAnticipo = 0.75; // 3er año o más
  if (declaration.taxpayer.anosDeclarando === 'primero') {
    porcentajeAnticipo = 0.25;
  } else if (declaration.taxpayer.anosDeclarando === 'segundo') {
    porcentajeAnticipo = 0.50;
  }

  let baseAnticipo = impuestoNetoDeRenta;
  if (liq.metodoAnticipo2026 === 'procedimiento2') {
    // Promedio entre impuesto año anterior e impuesto año actual
    const impuestoAnoAnterior = (liq.anticipoRentaAnoAnteriorPara2025 || 0) > 0 ? (liq.anticipoRentaAnoAnteriorPara2025 / porcentajeAnticipo) : impuestoNetoDeRenta;
    baseAnticipo = (impuestoNetoDeRenta + impuestoAnoAnterior) / 2;
  }

  const anticipoBruto2026 = baseAnticipo * porcentajeAnticipo;
  const anticipoCalculado2026 = Math.max(
    0,
    redondearAMiles(anticipoBruto2026 - (liq.retencionesEnLaFuenteRenta2025 || 0))
  );

  // Saldo del impuesto antes de anticipo y saldo a favor anterior
  const anticipoAnoAnteriorAplicado = liq.anticipoRentaAnoAnteriorPara2025 || 0;
  const saldoAFavorAnoAnterior = liq.saldoAFavorAnoAnteriorSinDevolucion || 0;

  // Sanción por extemporaneidad (Art. 641 E.T.)
  // 5% por mes o fracción sobre el impuesto a cargo (o sobre ingresos si impuesto = 0), máx 100%, mín 10 UVT 2026
  let sancionExtemporaneidad = 0;
  const mesesExtemp = Math.max(0, liq.diasMesesExtemporaneidad || 0);
  if (mesesExtemp > 0) {
    const sancionMinimaLegal = redondearAMiles(SANCION_MINIMA_UVT * uvt2026);
    let baseSancion = totalImpuestoCargo;
    let porcentajeSancion = Math.min(1.0, mesesExtemp * 0.05);

    if (baseSancion <= 0) {
      // Si no hay impuesto a cargo, se liquida sobre ingresos brutos: 0.5% por mes o fracción máx 5% o 2.500 UVT
      const baseIngresos = ingresoBrutoTrabajo + ingresoBrutoCapital + ingresoBrutoNoLaboral + ingresoBrutoPensiones;
      const sancionIngresos = baseIngresos * Math.min(0.05, mesesExtemp * 0.005);
      sancionExtemporaneidad = Math.max(sancionMinimaLegal, redondearAMiles(sancionIngresos));
    } else {
      const sancionCalculada = baseSancion * porcentajeSancion;
      sancionExtemporaneidad = Math.max(sancionMinimaLegal, redondearAMiles(sancionCalculada));
    }
  }

  // Liquidación final del saldo a pagar o a favor:
  // Saldo = Total Impuesto a Cargo + Anticipo 2026 + Sanción - Retenciones - Anticipo 2024 - Saldo a Favor 2024
  const creditosFiscalesTotales =
    totalRetenciones +
    anticipoAnoAnteriorAplicado +
    saldoAFavorAnoAnterior;

  const debitoFiscalTotal =
    totalImpuestoCargo +
    anticipoCalculado2026 +
    sancionExtemporaneidad;

  let saldoAPagar = 0;
  let saldoAFavor = 0;

  if (debitoFiscalTotal >= creditosFiscalesTotales) {
    saldoAPagar = redondearAMiles(debitoFiscalTotal - creditosFiscalesTotales);
    saldoAFavor = 0;
  } else {
    saldoAPagar = 0;
    saldoAFavor = redondearAMiles(creditosFiscalesTotales - debitoFiscalTotal);
  }

  // Tasa efectiva de tributación (Impuesto neto / Ingresos brutos totales)
  const totalIngresosDeclarados =
    ingresoBrutoTrabajo +
    ingresoBrutoCapital +
    ingresoBrutoNoLaboral +
    ingresoBrutoPensiones +
    divSub1NoGravados +
    divSub2Gravados +
    ingresosTotalesGO;

  const tasaEfectivaTributacion =
    totalIngresosDeclarados > 0
      ? Math.round((impuestoNetoDeRenta / totalIngresosDeclarados) * 10000) / 100
      : 0;

  const impuestoCedulaGeneralYPensiones = Math.max(0, impuestoArticulo241 - descuentoMarginalArt242);

  const calcLiquidacion: LiquidacionPrivadaCalculation = {
    baseGravableArticulo241,
    baseGravableArticulo241_UVT: resultadoTabla241.baseUVT,
    impuestoArticulo241,
    impuestoCedulaGeneralYPensiones,
    impuestoTotalRentasLiquidas: totalImpuestoRentas,
    totalDescuentosTributarios: totalDescuentosSolicitados,
    limiteDescuentosTributarios,
    descuentosTributariosEfectivos,
    impuestoNetoDeRenta,
    totalImpuestoCargo,
    totalRetenciones,
    anticipoCalculado2026,
    totalSaldoImpuesto: Math.max(0, totalImpuestoCargo - totalRetenciones),
    sancionExtemporaneidad,
    saldoAPagar,
    saldoAFavor,
    tasaEfectivaTributacion,
  };

  // ==========================================
  // 9. CONCILIACIÓN PATRIMONIAL (Art. 236 E.T.)
  // ==========================================
  const patrimonioBruto2025 =
    p.efectivoYEquivalentes +
    p.cuentasBancarias +
    p.inversionesYAcciones +
    p.bienesRaices +
    p.vehiculos +
    p.otrosActivos;

  const deudas2025 = (p.deudasFinancieras || 0) + (p.otrasDeudas || 0);
  const patrimonioLiquidoAnoActual = Math.max(0, patrimonioBruto2025 - deudas2025);
  const patrimonioLiquidoAnoAnterior = p.patrimonioLiquidoAnoAnterior || 0;
  const incrementoPatrimonial = patrimonioLiquidoAnoActual - patrimonioLiquidoAnoAnterior;

  const totalRentasLiquidasGravables =
    rentaLiquidaGravableCedulaGeneral +
    rentaLiquidaGravablePensiones +
    rentaLiquidaGravableDividendos;

  const totalRentasExentas =
    beneficiosAceptadosDentroLimite +
    deduccionDependientes72UVT +
    deduccionFacturaElectronica1Porciento +
    deduccionesYRentasExentasCapital +
    deduccionesYRentasExentasNoLaboral +
    rentaExentaPensiones;

  const ingresosNoConstitutivosTotal =
    incrngoTrabajo + incrngoCapital + incrngoNoLaboral + incrngoPensiones;

  // Justificación total del incremento patrimonial
  const justificacionTotalPatrimonial =
    totalRentasLiquidasGravables +
    totalRentasExentas +
    gananciaOcasionalNeta +
    ingresosNoConstitutivosTotal -
    impuestoNetoDeRenta;

  const diferenciaPatrimonial = incrementoPatrimonial - justificacionTotalPatrimonial;
  const alertaRentaPorComparacion = diferenciaPatrimonial > 0 && incrementoPatrimonial > 0;

  const calcConciliacion: ConciliacionPatrimonialCalculation = {
    patrimonioLiquidoAnoActual,
    patrimonioLiquidoAnoAnterior,
    incrementoPatrimonial,
    totalRentasLiquidasGravables,
    totalRentasExentas,
    gananciasOcasionalesNetas: gananciaOcasionalNeta,
    ingresosNoConstitutivosTotal,
    justificacionTotalPatrimonial,
    diferenciaPatrimonial,
    alertaRentaPorComparacion,
  };

  // ==========================================
  // 10. EVALUACIÓN DE OBLIGATORIEDAD
  // ==========================================
  const evaluacionObligacion = evaluarObligacionDeclarar(declaration);

  // ==========================================
  // 11. MAPEO A RENGLONES OFICIALES FORMULARIO 210
  // ==========================================
  const renglones: Form210Renglones = {
    '28': redondearAMiles(patrimonioBruto2025), // Total patrimonio bruto
    '29': redondearAMiles(deudas2025), // Deudas
    '30': redondearAMiles(patrimonioLiquidoAnoActual), // Total patrimonio líquido

    // Cédula General - Rentas de Trabajo
    '32': redondearAMiles(ingresoBrutoTrabajo), // Ingresos brutos por rentas de trabajo
    '33': redondearAMiles(incrngoTrabajo), // Ingresos no constitutivos de renta
    '34': redondearAMiles(ingresoNetoTrabajo), // Ingresos netos
    '35': redondearAMiles(rentasExentasEspecificas + rentaExenta25Calculada), // Rentas exentas de trabajo
    '36': redondearAMiles(deduccionesGeneralesTrabajo + deduccionDependientes72UVT + deduccionFacturaElectronica1Porciento), // Deducciones imputables
    '37': redondearAMiles(beneficiosAceptadosDentroLimite + deduccionDependientes72UVT + deduccionFacturaElectronica1Porciento), // Total rentas exentas y deducciones imputables
    '38': redondearAMiles(rentaLiquidaRentasTrabajo), // Renta líquida ordinaria / gravable rentas de trabajo

    // Rentas de Capital
    '58': redondearAMiles(ingresoBrutoCapital), // Ingresos brutos rentas de capital
    '59': redondearAMiles(incrngoCapital), // INCRNGO capital
    '60': redondearAMiles(costosProcedentesCapital), // Costos y deducciones procedentes
    '61': redondearAMiles(rentaLiquidaOrdinariaCapital), // Renta líquida ordinaria capital
    '62': redondearAMiles(deduccionesYRentasExentasCapital), // Rentas exentas y deducciones capital
    '63': redondearAMiles(rentaLiquidaCapital), // Renta líquida gravable capital

    // Rentas No Laborales
    '74': redondearAMiles(ingresoBrutoNoLaboral), // Ingresos brutos rentas no laborales
    '75': redondearAMiles(devolucionesNoLaboral), // Devoluciones, rebajas y descuentos
    '76': redondearAMiles(incrngoNoLaboral), // INCRNGO no laboral
    '77': redondearAMiles(costosProcedentesNoLaboral), // Costos y deducciones procedentes no laboral
    '78': redondearAMiles(rentaLiquidaOrdinariaNoLaboral), // Renta líquida ordinaria no laboral
    '79': redondearAMiles(deduccionesYRentasExentasNoLaboral), // Rentas exentas y deducciones no laboral
    '80': redondearAMiles(rentaLiquidaNoLaboral), // Renta líquida gravable no laboral

    // Resumen Cédula General
    '92': redondearAMiles(rentaLiquidaCedulaGeneralSinCompensacion), // Renta líquida ordinaria de la cédula general
    '93': redondearAMiles(compensacionesAplicadas), // Compensaciones por pérdidas
    '94': redondearAMiles(rentaLiquidaGravableCedulaGeneral), // Renta líquida gravable cédula general

    // Rentas de Pensiones
    '98': redondearAMiles(ingresoBrutoPensiones), // Ingresos brutos pensiones
    '99': redondearAMiles(incrngoPensiones), // INCRNGO pensiones
    '100': redondearAMiles(rentaExentaPensiones), // Renta exenta de pensiones
    '101': redondearAMiles(rentaLiquidaGravablePensiones), // Renta líquida gravable de pensiones

    // Rentas de Dividendos
    '104': redondearAMiles(divSub1NoGravados), // Subcédula 1: 2017 y siguientes no gravados
    '105': redondearAMiles(divSub2Gravados), // Subcédula 2: 2017 y siguientes gravados
    '106': redondearAMiles(rentaLiquidaGravableDividendos), // Renta líquida gravable de dividendos

    // Ganancias Ocasionales
    '111': redondearAMiles(ingresosTotalesGO), // Ingresos por ganancias ocasionales
    '112': redondearAMiles(costoFiscalActivos), // Costos por ganancias ocasionales
    '113': redondearAMiles(gananciasOcasionalesExentas), // Ganancias ocasionales no gravadas y exentas
    '114': redondearAMiles(gananciaGravableTotal), // Ganancias ocasionales gravables

    // Liquidación Privada
    '122': redondearAMiles(impuestoCedulaGeneralYPensiones), // Impuesto sobre las rentas líquidas gravables
    '123': redondearAMiles(impuestoDirectoSubcedula2_35), // Impuesto sobre dividendos gravados 35%
    '124': redondearAMiles(totalImpuestoRentas), // Total impuesto sobre rentas líquidas
    '125': redondearAMiles(descuentosTributariosEfectivos), // Descuentos tributarios
    '126': redondearAMiles(impuestoNetoDeRenta), // Impuesto neto de renta
    '127': redondearAMiles(totalImpuestoGananciasOcasionales), // Impuesto de ganancias ocasionales
    '128': redondearAMiles(totalImpuestoCargo), // Total impuesto a cargo
    '130': redondearAMiles(anticipoAnoAnteriorAplicado), // Anticipo renta liquidado año anterior
    '131': redondearAMiles(saldoAFavorAnoAnterior), // Saldo a favor año gravable anterior
    '132': redondearAMiles(totalRetenciones), // Retenciones en la fuente que le practicaron
    '133': redondearAMiles(anticipoCalculado2026), // Anticipo renta para el año gravable siguiente (2026)
    '134': redondearAMiles(sancionExtemporaneidad), // Sanciones
    '135': redondearAMiles(saldoAPagar), // Total saldo a pagar
    '136': redondearAMiles(saldoAFavor), // Total saldo a favor
  };

  return {
    trabajo: calcTrabajo,
    capital: calcCapital,
    noLaboral: calcNoLaboral,
    cedulaGeneral: calcCedulaGeneral,
    pensiones: calcPensiones,
    dividendos: calcDividendos,
    gananciasOcasionales: calcGananciasOcasionales,
    liquidacion: calcLiquidacion,
    conciliacion: calcConciliacion,
    obligacion: evaluacionObligacion,
    renglonesForm210: renglones,
  };
}
