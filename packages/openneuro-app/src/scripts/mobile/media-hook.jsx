import { useEffect, useState } from 'react'

// custom media query hook - can be used anywhere by passing in desired breakpoint
function useMedia(query) {
  const [match, setmatch] = useState(window.matchMedia(query).match)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.match !== match) setmatch(media.match)
    const listener = () => setmatch(media.match)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [match, query])

  return match
}

export default useMedia
