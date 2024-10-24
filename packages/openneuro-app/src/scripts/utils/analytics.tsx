import { useEffect } from "react"
import { pageview } from "../utils/gtag"
import { useLocation } from "react-router-dom"

export const useAnalytics = (): void => {
  const location = useLocation()

  useEffect(() => {
    pageview(location.pathname + location.search)
  }, [location])
}
