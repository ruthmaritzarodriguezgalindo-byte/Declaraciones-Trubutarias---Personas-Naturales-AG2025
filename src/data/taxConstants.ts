/**
 * Constantes Tributarias de Colombia vigentes para el Año Gravable 2025 (presentado en 2026)
 * Normativa: Estatuto Tributario, Ley 2277 de 2022, Resoluciones DIAN.
 */

// Valor de la Unidad de Valor Tributario (UVT)
export const DEFAULT_UVT_2025 = 49799; // UVT Año Gravable 2025 oficial (Resolución DIAN 000193 de 2024 / proyectada)
export const DEFAULT_UVT_2026 = 52374; // UVT proyectada 2026 para sanciones del año de presentación
export const DEFAULT_UVT_2024 = 47065; // UVT de referencia para saldos del año anterior

// Topes para estar obligado a declarar AG 2025 (Arts. 592 y 594-3 E.T.)
export const TOPES_OBLIGATORIEDAD_UVT = {
  PATRIMONIO_BRUTO: 4500, // 4.500 UVT ($224,095,500 COP)
  INGRESOS_BRUTOS: 1400, // 1.400 UVT ($69,718,600 COP)
  CONSUMOS_TARJETA: 1400, // 1.400 UVT ($69,718,600 COP)
  COMPRAS_CONSUMOS: 1400, // 1.400 UVT ($69,718,600 COP)
  CONSIGNACIONES_BANCARIAS: 1400, // 1.400 UVT ($69,718,600 COP)
};

// Límites de deducciones y rentas exentas Cédula General (Ley 2277 de 2022)
export const LIMITES_DEDUCCIONES = {
  // Límite conjunto general Cédula General (Art. 336 E.T.)
  PORCENTAJE_LIMITE_GENERAL: 0.40, // 40% del ingreso neto
  TOPE_UVT_LIMITE_GENERAL: 1340, // 1.340 UVT anuales (reducido por Ley 2277)
  
  // Deducción por dependientes tradicional (Art. 387 E.T.)
  PORCENTAJE_DEPENDIENTES_TRADICIONAL: 0.10, // 10% del ingreso bruto
  TOPE_UVT_MENSUAL_DEPENDIENTE_TRADICIONAL: 32, // 32 UVT mensuales
  TOPE_UVT_ANUAL_DEPENDIENTE_TRADICIONAL: 384, // 384 UVT anuales

  // Nueva deducción por dependientes Ley 2277 de 2022 (Art. 336 Parágrafo 2)
  // NO sujeta al límite del 40% ni de 1.340 UVT
  UVT_POR_DEPENDIENTE_ADICIONAL: 72, // 72 UVT por dependiente
  MAX_DEPENDIENTES_ADICIONALES: 4, // Hasta 4 dependientes (máximo 288 UVT)

  // Deducción por compras con Factura Electrónica (Art. 336 Numeral 5 Ley 2277)
  // NO sujeta al límite del 40% ni de 1.340 UVT
  PORCENTAJE_FACTURA_ELECTRONICA: 0.01, // 1% de compras y servicios
  TOPE_UVT_FACTURA_ELECTRONICA: 240, // Máximo 240 UVT anuales

  // Intereses de vivienda (Art. 119 E.T.)
  TOPE_UVT_ANUAL_INTERESES_VIVIENDA: 1200, // 1.200 UVT anuales (100 UVT mensuales)

  // Medicina prepagada y pólizas de salud (Art. 387 E.T.)
  TOPE_UVT_ANUAL_SALUD_PREPAGADA: 192, // 16 UVT mensuales = 192 UVT anuales

  // Aportes voluntarios a fondos de pensiones y AFC (Arts. 126-1 y 126-4 E.T.)
  PORCENTAJE_MAX_FVP_AFC: 0.30, // 30% del ingreso laboral
  TOPE_UVT_ANUAL_FVP_AFC: 3800, // 3.800 UVT anuales

  // Renta exenta laboral del 25% (Art. 206 Numeral 10 E.T.)
  PORCENTAJE_EXENTA_LABORAL: 0.25, // 25%
  TOPE_UVT_ANUAL_EXENTA_LABORAL: 790, // 790 UVT anuales (reducido por Ley 2277)

  // Exención de pensiones (Art. 206 Numeral 9 E.T.)
  TOPE_UVT_ANUAL_PENSIONES_EXENTAS: 12000, // 1.000 UVT mensuales = 12.000 UVT anuales
};

// Tabla de tarifas del Artículo 241 del Estatuto Tributario para Personas Naturales
export interface TarifaArticulo241Bracket {
  desdeUVT: number;
  hastaUVT: number | null; // null si no tiene tope
  tarifaMarginal: number; // Porcentaje en decimal (ej. 0.19)
  impuestoBaseUVT: number; // Impuesto fijo base acumulado en UVT
}

export const TABLA_ARTICULO_241: TarifaArticulo241Bracket[] = [
  { desdeUVT: 0, hastaUVT: 1090, tarifaMarginal: 0.0, impuestoBaseUVT: 0 },
  { desdeUVT: 1090, hastaUVT: 1700, tarifaMarginal: 0.19, impuestoBaseUVT: 0 },
  { desdeUVT: 1700, hastaUVT: 4100, tarifaMarginal: 0.28, impuestoBaseUVT: 116 },
  { desdeUVT: 4100, hastaUVT: 8670, tarifaMarginal: 0.33, impuestoBaseUVT: 788 },
  { desdeUVT: 8670, hastaUVT: 18970, tarifaMarginal: 0.35, impuestoBaseUVT: 2296 },
  { desdeUVT: 18970, hastaUVT: 31000, tarifaMarginal: 0.37, impuestoBaseUVT: 5901 },
  { desdeUVT: 31000, hastaUVT: null, tarifaMarginal: 0.39, impuestoBaseUVT: 10352 },
];

// Tarifas de Ganancias Ocasionales (Art. 314 y 317 E.T., Ley 2277)
export const TARIFAS_GANANCIAS_OCASIONALES = {
  GENERAL: 0.15, // 15% para ventas de activos fijos, herencias, donaciones, etc.
  LOTERIAS_RIFAS: 0.20, // 20% para loterías, rifas, apuestas y similares
};

// Sanción Mínima (Art. 639 E.T.)
// La sanción mínima equivale a 10 UVT del año en que se liquide la sanción
export const SANCION_MINIMA_UVT = 10;
