import { useState } from 'react';
import { formatNumber, formatUsInteger, parseUsNumber } from '../../utils/formatting';

interface FormattedNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  /** Decimal places when blurred; omit for integer formatting (e.g. equity). */
  decimals?: number;
  className?: string;
}

function formatDisplay(value: number, decimals?: number): string {
  if (decimals !== undefined) return formatNumber(value, decimals);
  return formatUsInteger(value);
}

export function FormattedNumberInput({
  value,
  onChange,
  decimals,
  className = 'fi',
}: FormattedNumberInputProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState('');

  const displayValue = focused ? draft : formatDisplay(value, decimals);

  return (
    <input
      type="text"
      inputMode="decimal"
      className={className}
      value={displayValue}
      onFocus={() => {
        setFocused(true);
        setDraft(decimals !== undefined ? String(value) : formatUsInteger(value));
      }}
      onBlur={() => {
        setFocused(false);
        const parsed = parseUsNumber(draft);
        if (!Number.isNaN(parsed)) onChange(parsed);
      }}
      onChange={(e) => {
        const next = e.target.value;
        setDraft(next);
        const parsed = parseUsNumber(next);
        if (!Number.isNaN(parsed)) onChange(parsed);
      }}
    />
  );
}
