import { useRef, useEffect } from 'react';

interface IncrementInputProps {
  value: number | undefined;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decrements?: number[];
  increments?: number[];
  placeholder?: string;
  autoFocus?: boolean;
  onEnterOrTab?: () => void;
  label?: string;
  required?: boolean;
}

export default function IncrementInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  decrements,
  increments,
  placeholder,
  autoFocus,
  onEnterOrTab,
  label,
  required,
}: IncrementInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleDecrement = (amount: number) => {
    const currentValue = value || 0;
    const newValue = Math.max(min, currentValue - amount);
    onChange(newValue);
  };

  const handleIncrement = (amount: number) => {
    const currentValue = value || 0;
    const newValue = max !== undefined ? Math.min(max, currentValue + amount) : currentValue + amount;
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === 'Tab') && onEnterOrTab) {
      e.preventDefault();
      onEnterOrTab();
    }
  };

  // Default increments/decrements
  const defaultIncrements = increments || [step, step * 2.5];
  const defaultDecrements = decrements || [step, step * 2.5];

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex items-center gap-2">
        {/* Decrement buttons */}
        {defaultDecrements.map((amount, idx) => (
          <button
            key={`dec-${idx}`}
            type="button"
            onClick={() => handleDecrement(amount)}
            className="min-w-[52px] h-[52px] flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl font-bold text-gray-700 text-base transition-all active:scale-95 touch-manipulation"
            disabled={(value || 0) - amount < min}
          >
            -{amount}
          </button>
        ))}

        {/* Main input */}
        <input
          ref={inputRef}
          type="number"
          value={value === undefined || value === 0 ? '' : value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          className="w-24 h-[52px] px-3 text-center text-xl font-bold border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 touch-manipulation"
        />

        {/* Increment buttons */}
        {defaultIncrements.map((amount, idx) => (
          <button
            key={`inc-${idx}`}
            type="button"
            onClick={() => handleIncrement(amount)}
            className="min-w-[52px] h-[52px] flex items-center justify-center bg-blue-100 hover:bg-blue-200 active:bg-blue-300 rounded-xl font-bold text-blue-700 text-base transition-all active:scale-95 touch-manipulation"
            disabled={max !== undefined && (value || 0) + amount > max}
          >
            +{amount}
          </button>
        ))}
      </div>
    </div>
  );
}
