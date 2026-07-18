import React, { useState, useCallback } from 'react';
import { Delete, Check } from 'lucide-react';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm?: () => void;
  label?: string;
  currency?: string;
  maxLength?: number;
  allowDecimal?: boolean;
}

export default function NumericInput({
  value,
  onChange,
  onConfirm,
  label,
  currency = 'KES',
  maxLength = 8,
  allowDecimal = true,
}: NumericInputProps) {
  const handleKey = useCallback((key: string) => {
    const currentStr = value.toString();

    if (key === 'backspace') {
      const newStr = currentStr.slice(0, -1);
      onChange(newStr === '' ? 0 : parseFloat(newStr));
      return;
    }

    if (key === 'clear') {
      onChange(0);
      return;
    }

    if (key === '.') {
      if (!allowDecimal || currentStr.includes('.')) return;
      onChange(parseFloat(currentStr + '.'));
      return;
    }

    if (currentStr.replace('.', '').length >= maxLength) return;

    const newValue = currentStr === '0' ? key : currentStr + key;
    onChange(parseFloat(newValue));
  }, [value, onChange, maxLength, allowDecimal]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <div className="text-center">
          <span className="text-sm font-medium text-slate-500">{label}</span>
        </div>
      )}

      <div className="rounded-2xl bg-slate-100 p-4 text-center">
        <span className="text-sm text-slate-500">{currency}</span>
        <div className="text-4xl font-bold text-slate-900">
          {value.toLocaleString('en-KE', { minimumFractionDigits: allowDecimal ? 2 : 0 })}
        </div>
      </div>

      <div className="numeric-keypad">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`keypad-btn ${key === 'backspace' ? 'danger' : ''}`}
          >
            {key === 'backspace' ? (
              <Delete className="h-6 w-6" />
            ) : key === '.' ? (
              <span className="text-2xl">.</span>
            ) : (
              key
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => handleKey('clear')} className="keypad-btn danger">
          Clear
        </button>
        {onConfirm && (
          <button onClick={onConfirm} className="keypad-btn action">
            <Check className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
