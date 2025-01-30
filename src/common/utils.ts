export const isProduction = import.meta.env.MODE === 'production';

export function getLocalStorageItem(itemKey: string): string | null {
  return localStorage.getItem(itemKey);
}

export function setLocalStorageItem(itemKey: string, itemContent: string | null): void {
  if (itemContent) {
    localStorage.setItem(itemKey, itemContent);
  } else {
    localStorage.removeItem(itemKey);
  }
}
