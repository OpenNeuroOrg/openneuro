import { toast } from 'react-toastify'
import isFuture from 'date-fns/is_future'

export const expiringBanner = (message, expiration) => {
  if (isFuture(expiration)) {
    toast.warn(message, { autoClose: 15000 })
  }
}
