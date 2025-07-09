import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorage {
  /**
   * Store data in localStorage with type safety
   * @param key - The key to store the data under
   * @param value - The value to store (will be JSON stringified)
   * @returns boolean - true if successful, false if failed
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        // console.warn("localStorage is not available");
        return false;
      }

      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      return false;
    }
  }

  /**
   * Retrieve data from localStorage with type safety
   * @param key - The key to retrieve data for
   * @returns T | null - The parsed data or null if not found/error
   */
  getItem<T>(key: string): T | null {
    try {
      if (!this.isLocalStorageAvailable()) {
        // console.warn("localStorage is not available");
        return null;
      }

      const item = localStorage.getItem(key);
      if (!item || item === 'undefined') {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   * @returns boolean - true if successful, false if failed
   */
  removeItem(key: string): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        // console.warn("localStorage is not available");
        return false;
      }

      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   * @returns boolean - true if successful, false if failed
   */
  clear(): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        // console.warn("localStorage is not available");
        return false;
      }

      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   * @param key - The key to check
   * @returns boolean - true if key exists, false otherwise
   */
  hasItem(key: string): boolean {
    try {
      if (!this.isLocalStorageAvailable()) {
        return false;
      }

      console.log(localStorage.getItem(key));

      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error("Error checking localStorage key:", error);
      return false;
    }
  }

  /**
   * Get all keys from localStorage
   * @returns string[] - Array of all keys
   */
  getAllKeys(): string[] {
    try {
      if (!this.isLocalStorageAvailable()) {
        return [];
      }

      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error("Error getting localStorage keys:", error);
      return [];
    }
  }

  /**
   * Get the size of localStorage in bytes (approximate)
   * @returns number - Size in bytes
   */
  getStorageSize(): number {
    try {
      if (!this.isLocalStorageAvailable()) {
        return 0;
      }

      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error("Error calculating localStorage size:", error);
      return 0;
    }
  }

  /**
   * Store data with expiration time
   * @param key - The key to store the data under
   * @param value - The value to store
   * @param expirationMinutes - Expiration time in minutes
   * @returns boolean - true if successful, false if failed
   */
  setItemWithExpiration<T>(
    key: string,
    value: T,
    expirationMinutes: number
  ): boolean {
    try {
      const expirationTime =
        new Date().getTime() + expirationMinutes * 60 * 1000;
      const dataWithExpiration = {
        value,
        expiration: expirationTime,
      };

      return this.setItem(key, dataWithExpiration);
    } catch (error) {
      console.error("Error saving with expiration to localStorage:", error);
      return false;
    }
  }

  /**
   * Retrieve data with expiration check
   * @param key - The key to retrieve data for
   * @returns T | null - The data if valid and not expired, null otherwise
   */
  getItemWithExpiration<T>(key: string): T | null {
    try {
      const dataWithExpiration = this.getItem<{ value: T; expiration: number }>(
        key
      );

      if (!dataWithExpiration) {
        return null;
      }

      const currentTime = new Date().getTime();
      if (currentTime > dataWithExpiration.expiration) {
        // Data has expired, remove it
        this.removeItem(key);
        return null;
      }

      return dataWithExpiration.value;
    } catch (error) {
      console.error("Error reading with expiration from localStorage:", error);
      return null;
    }
  }

  /**
   * Check if localStorage is available in the current environment
   * @returns boolean - true if available, false otherwise
   */
  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof Storage === "undefined") {
        return false;
      }

      const testKey = "__localStorage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
