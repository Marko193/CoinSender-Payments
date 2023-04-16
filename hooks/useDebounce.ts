import { useEffect, useState } from 'react';

export function useDebounceValue<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceFunction<F extends (...args: any[]) => any>(
  func: F,
  delay: number = 500,
): F {
  let timeout: NodeJS.Timeout;

  function debouncedFunction(this: any, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return debouncedFunction as F;
}
