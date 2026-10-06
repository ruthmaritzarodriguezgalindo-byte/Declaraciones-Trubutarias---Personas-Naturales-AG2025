/**
 * Utilidades de formateo para moneda colombiana (COP) y números
 */

export function formatCOP(valor: number | undefined | null): string {
  if (valor === undefined || valor === null || isNaN(valor)) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatNumber(valor: number | undefined | null): string {
  if (valor === undefined || valor === null || isNaN(valor)) return '0';
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 2,
  }).format(valor);
}

export function parseCOPInput(text: string): number {
  if (!text) return 0;
  // Elimina caracteres no numéricos excepto el signo negativo
  const clean = text.replace(/[^0-9-]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}
