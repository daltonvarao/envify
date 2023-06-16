export function debounce(func: (...args: any[]) => void, wait: number) {
  let timer: NodeJS.Timeout;

  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), wait);
  };
}
