import React from 'react';
import { formatCOP } from '../../utils/formatters';

interface TaxInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  uvtValue: number;
  sublabel?: string;
  legalRef?: string;
  maxUVT?: number;
  placeholder?: string;
  disabled?: boolean;
  highlight?: boolean;
}

export const TaxInput: React.FC<TaxInputProps> = ({
  label,
  value,
  onChange,
  uvtValue,
  sublabel,
  legalRef,
  maxUVT,
  placeholder = '0',
  disabled = false,
  highlight = false,
}) => {
  const uvtEquiv = uvtValue > 0 ? (value / uvtValue).toFixed(1) : '0';
  const maxPesos = maxUVT ? maxUVT * uvtValue : undefined;
  const isOverLimit = maxPesos !== undefined && value > maxPesos;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = raw === '' ? 0 : parseInt(raw, 10);
    onChange(num);
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        highlight
          ? 'bg-emerald-50/50 border-emerald-300'
          : isOverLimit
          ? 'bg-amber-50/50 border-amber-300'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <label className="text-xs font-semibold text-slate-800 leading-tight">
          {label}
        </label>
        {legalRef && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 font-medium border border-slate-200">
            {legalRef}
          </span>
        )}
      </div>

      {sublabel && (
        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{sublabel}</p>
      )}

      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
          $
        </span>
        <input
          type="text"
          value={value === 0 ? '' : value.toLocaleString('es-CO')}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-7 pr-3 py-1.5 text-right font-mono text-sm font-semibold rounded border outline-none transition-all ${
            disabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
              : 'bg-white border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-slate-900'
          }`}
        />
      </div>

      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-mono">
        <span>≈ {uvtEquiv} UVT</span>
        {maxUVT && (
          <span
            className={
              isOverLimit ? 'text-amber-700 font-bold' : 'text-slate-400'
            }
          >
            Tope: {maxUVT.toLocaleString('es-CO')} UVT ({formatCOP(maxPesos)})
          </span>
        )}
      </div>

      {isOverLimit && (
        <p className="text-[10px] text-amber-700 mt-1 font-medium">
          ⚠️ Nota: El valor supera el tope normativo de {maxUVT} UVT. El liquidador aplicará el límite legal.
        </p>
      )}
    </div>
  );
};
