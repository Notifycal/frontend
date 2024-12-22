export const isProduction = import.meta.env.MODE === 'production';

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getConfigValue(key: string): unknown {
  if (!window.globalConfig) {
    console.error('globalConfig is not defined');
    return '';
  }

  if (!(key in window.globalConfig)) {
    console.error(`Config key not defined: ${key}`);
    return '';
  }

  return window.globalConfig[key];
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
