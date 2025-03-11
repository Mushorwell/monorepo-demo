export const simpleLogger =
  (
    prefix = '[SimpleLogger]',
    debug = false,
    level: 'log' | 'error' | 'warn' = 'log'
  ) =>
  (message: string, data?: any) => {
    if (debug) {
      console[level](`[${prefix}] ${message}`, data);
    }
  };
