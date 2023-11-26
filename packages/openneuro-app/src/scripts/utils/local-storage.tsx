import React from "react"
import { createContext, useContext, useEffect, useState } from "react"

/** Shared context for all local storage updates */
const LocalStorageContext = createContext()

const LOCAL_STORAGE_KEY = "openneuro"

function getStorageValue<T>(key: string, defaultValue: T): T {
  const saved = localStorage.getItem(key)
  if (saved) return JSON.parse(saved)
  else return defaultValue
}

/**
 * Local storage hook that updates across components
 * @param key Field name for localstorage object
 */
export function useLocalStorage<T>(
  key: string,
): [T, (value: T) => void] {
  const context = useContext(LocalStorageContext)
  const setValue = (value: T) => {
    const update = {}
    update[key] = value
    context?.setLocalStorageValue(update)
  }
  return [context?.localStorageValue[key], setValue]
}

export function LocalStorageProvider({ children, defaultValue }) {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    return getStorageValue(LOCAL_STORAGE_KEY, defaultValue)
  })

  useEffect(() => {
    const val = localStorage.getItem(LOCAL_STORAGE_KEY)
    const prev = val ? JSON.parse(val) : {}
    const updateValue = { ...prev, ...defaultValue, ...localStorageValue }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updateValue))
  }, [localStorageValue])

  return (
    <LocalStorageContext.Provider
      value={{ localStorageValue, setLocalStorageValue }}
    >
      {children}
    </LocalStorageContext.Provider>
  )
}
