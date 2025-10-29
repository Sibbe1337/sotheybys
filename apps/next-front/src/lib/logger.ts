/**
 * Simple logger that respects environment
 * Enable with LOG=1 in env
 */
export const log = (...args: any[]) => {
  // TEMPORARILY: Always log for debugging
  console.log('[APP]', ...args);
};

export const warn = (...args: any[]) => {
  // TEMPORARILY: Always warn for debugging
  console.warn('[APP]', ...args);
};

export const error = (...args: any[]) => {
  console.error('[APP]', ...args);
};

