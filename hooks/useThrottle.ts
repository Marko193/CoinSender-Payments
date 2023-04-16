import { useEffect, useRef, useState } from 'react';

type Func<T extends any[], R> = (...args: T) => R;

export function useThrottleValue<T>(value: T, delay: number = 500) {
  const [throttleValue, setThrottleValue] = useState<T>(value);
  const throttling = useRef(false);
  useEffect(() => {
    if (throttling.current === false) {
      setThrottleValue(value);
      throttling.current = true;
      setTimeout(() => {
        if (throttling?.current) throttling.current = false;
      }, delay);
    }
  }, [value, delay]);
  return throttleValue;
}

export function useThrottleFunction<T extends any[], R>(
  func: Func<T, R>,
  delay: number = 500,
  immediate: boolean,
): Func<T, R> {
  const throttling = useRef(false);
  const immediateRef = useRef(true);

  return function throttledFunction(...args: T) {
    if (!throttling.current) {
      if (immediate && immediateRef.current) {
        throttling.current = true;
        const result = func(...args);
        throttling.current = false;
        immediateRef.current = false;
        return result;
      } else {
        throttling.current = true;
        const result = func(...args);
        setTimeout(() => {
          throttling.current = false;
        }, delay);
        return result;
      }
    }
  } as Func<T, R>;
}
