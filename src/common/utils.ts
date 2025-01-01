export const isProduction = import.meta.env.MODE === 'production';

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
