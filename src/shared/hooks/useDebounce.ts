import { useState, useEffect } from "react";

/**
 * 입력 값이 바뀔 때마다 지정된 시간만큼 지연된 값을 반환합니다.
 * 입력이 멈춘 후 delay(ms)만큼 지나야 값이 반영됩니다.
 *
 * @param value 지연시킬 상태 값
 * @param delay 지연 시간 (기본 300ms)
 * @returns 지연된 상태 값
 */
const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
