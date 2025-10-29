import { CacheAdapter } from './adapter';

interface CacheEntry<T> {
  value: T;
  expires: number;
}

export class MemoryCacheAdapter implements CacheAdapter {
  private store = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, options: { ttl?: number } = {}): void {
    const ttl = options.ttl ?? 600; // Default 10 minutes
    this.store.set(key, {
      value,
      expires: Date.now() + ttl * 1000
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  isExpired(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return true;
    return Date.now() > entry.expires;
  }
}

