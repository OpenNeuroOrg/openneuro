import { useEffect, useState } from "react"

function getStorageValue<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key)
  if (saved) return JSON.parse(saved)
  else return defaultValue
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
