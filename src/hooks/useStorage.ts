import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * STORAGE ABSTRACTION — localStorage on web, AsyncStorage on iOS/Android.
 * The same hook API drives all persistence features.
 */

const KEY = (k: string) => `palpda:${k}`;

const webGet = (k: string): string | null => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(KEY(k)) : null;
  } catch {
    return null;
  }
};

const webSet = (k: string, v: string): void => {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY(k), v);
  } catch {
    /* storage full / private mode — degrade silently */
  }
};

export async function storageGet(k: string): Promise<string | null> {
  if (Platform.OS === 'web') return webGet(k);
  try {
    return await AsyncStorage.getItem(KEY(k));
  } catch {
    return null;
  }
}

export async function storageSet(k: string, v: string): Promise<void> {
  if (Platform.OS === 'web') return webSet(k, v);
  try {
    await AsyncStorage.setItem(KEY(k), v);
  } catch {
    /* degrade silently */
  }
}

export function readJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** useStoredState — persisted state with cross-tab sync on web. */
export function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const keyRef = useRef(key);
  const lastWrite = useRef<string>('');

  // Load once (and re-sync on web 'storage' events from other tabs).
  useEffect(() => {
    let alive = true;
    (async () => {
      const raw = await storageGet(keyRef.current);
      if (alive) {
        setValue(readJson(raw, fallback));
        setReady(true);
      }
    })();

    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY(keyRef.current) && e.newValue && e.newValue !== lastWrite.current) {
        setValue(readJson(e.newValue, fallback));
      }
    };
    if (Platform.OS === 'web') window.addEventListener('storage', onStorage);
    return () => {
      alive = false;
      if (Platform.OS === 'web') window.removeEventListener('storage', onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const raw = JSON.stringify(value);
    lastWrite.current = raw;
    void storageSet(keyRef.current, raw);
  }, [value, ready]);

  return [value, setValue, ready] as const;
}
