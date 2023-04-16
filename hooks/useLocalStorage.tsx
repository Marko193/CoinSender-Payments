import { useState, useEffect } from 'react';

interface LocalStorageItem<T> {
  key: string;
  value: T;
}

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      let item;
      if (typeof window !== 'undefined') {
        item = localStorage.getItem(key);
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(JSON.parse(e.newValue!));
      }
    };
    addEventListener('storage', onStorageChange);
    return () => {
      removeEventListener('storage', onStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
