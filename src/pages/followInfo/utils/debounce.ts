function debounceStringFn(func: (value: string) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (value: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(value), delay);
  };
}

export default debounceStringFn;
