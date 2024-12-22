export { }; // This ensures the file is treated as a module

declare global {
  interface Window {
    globalConfig: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  }
}
