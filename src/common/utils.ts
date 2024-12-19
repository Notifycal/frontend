export const isProduction = import.meta.env.MODE === 'production';

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
