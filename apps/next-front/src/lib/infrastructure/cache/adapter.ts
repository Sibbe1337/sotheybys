export interface CacheAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, options?: { ttl?: number }): void;
  delete(key: string): void;
  clear(): void;
  isExpired(key: string): boolean;
}

