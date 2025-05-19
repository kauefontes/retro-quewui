/**
 * API Cache utility to prevent duplicate requests
 * Implements a simple in-memory cache with TTL (time to live)
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache: Record<string, CacheEntry<unknown>> = {};
  private ttl: number = 60000; // Default: 1 minute cache

  /**
   * Set the Time To Live for cache entries
   * @param milliseconds TTL in milliseconds
   */
  setTTL(milliseconds: number): void {
    this.ttl = milliseconds;
  }

  /**
   * Get a value from cache if it exists and is not expired
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache[key];
    const now = Date.now();
    
    if (entry && now - entry.timestamp < this.ttl) {
      console.log(`[Cache] Hit for ${key}`);
      return entry.data as T;
    }
    
    console.log(`[Cache] Miss for ${key}`);
    return null;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param data Data to store
   */
  set<T>(key: string, data: T): void {
    console.log(`[Cache] Setting ${key}`);
    this.cache[key] = {
      data,
      timestamp: Date.now()
    };
  }

  /**
   * Clear a specific key from the cache
   * @param key Cache key to clear
   */
  clear(key: string): void {
    delete this.cache[key];
  }

  /**
   * Clear all keys from the cache
   */
  clearAll(): void {
    this.cache = {};
  }

  /**
   * Get data from cache if it exists and not expired, otherwise fetch it using the provided function
   * @param key Cache key
   * @param fetchFn Function to fetch data if not in cache
   * @returns The data (from cache or freshly fetched)
   */
  async getOrFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    // Try to get from cache first
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }
    
    // If not in cache, fetch and store
    const data = await fetchFn();
    this.set(key, data);
    return data;
  }
}

// Create a singleton instance
export const apiCache = new ApiCache();

export default apiCache;