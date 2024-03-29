import { useEffect, useState } from "react";

const isInBrowser = typeof window !== "undefined";

type JSONValue = string | number | boolean | null | undefined | JSONValue[] | { [key: string]: JSONValue };

type StoredValue<T extends JSONValue> = { at: number; data: T };
type StoredMeta = { storedAt: number; isSetter: boolean };

/**
 * Use local storage hook
 * ======================
 */
export default function useLocalStorage<T extends JSONValue>(
  key: string,
  initialValue?: T
): [T, (value: T, shouldChangeSetter?: boolean) => void, StoredMeta] {
  const [isSetter, setIsSetter] = useState(false);

  const [value, setValue] = useState<StoredValue<T>>({ at: 0, data: initialValue });

  // Load inicial state with local-storage
  useEffect(() => {
    const storageValue = window.localStorage.getItem(key);
    if (storageValue === null) {
      // Tuve que definir un valor por defecto del local storage, que sería este
      setValue({data: {token: null, email: null}, at: 0})
    } else {
      setValue(JSON.parse(storageValue))
    }
  }, [key]);

  // Wrap the setter to set the value to local storage
  const setValueWrapper = (data: T, shouldChangeSetter = true) => {
    const toStore: StoredValue<T> = { data, at: Date.now() };
    setValue(toStore);
    if (shouldChangeSetter) setIsSetter(true);
    if (!isInBrowser) return;
    window.localStorage.setItem(key, JSON.stringify(toStore));
  };

  // Add event listeners to update the value when it changes in another window
  useEffect(() => {
    if (!isInBrowser) return;
    const handleStorageEvent = ({ key: eventKey, oldValue, newValue }: StorageEvent) => {
      if (key !== eventKey || oldValue === newValue || !newValue) return;
      const toStore: StoredValue<T> = JSON.parse(newValue);
      setValue(toStore);
      setIsSetter(false);
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [key, value, setValue, setIsSetter]);

  // Return hook
  return [value ? value.data : null , setValueWrapper, { isSetter, storedAt: value ? value.at : null }];
}
