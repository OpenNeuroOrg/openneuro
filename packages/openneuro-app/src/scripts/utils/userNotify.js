import { toast } from 'react-toastify'
import isFuture from 'date-fns/isFuture'

export const expiringBanner = (message, expiration) => {
  if (isFuture(expiration)) {
    toast.warn(message, { autoClose: 15000 })
  }
}
