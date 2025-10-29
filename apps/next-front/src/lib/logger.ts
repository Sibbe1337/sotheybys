/**
 * Simple logger that respects environment
 * Enable with LOG=1 in env
 */
export const log = (...args: any[]) => {
  if (process.env.LOG === '1' || process.env.NODE_ENV === 'development') {
    console.log('[APP]', ...args);
  }
};

export const warn = (...args: any[]) => {
  if (process.env.LOG === '1' || process.env.NODE_ENV === 'development') {
    console.warn('[APP]', ...args);
  }
};

export const error = (...args: any[]) => {
  console.error('[APP]', ...args);
};

