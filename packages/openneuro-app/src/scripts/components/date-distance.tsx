import React from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import parseISO from "date-fns/parseISO"
import { formatDate } from "../utils/date"

export function DateDistance({ date }) {
  const formattedDate = formatDate(date)
  const distance = formatDistanceToNow(parseISO(date))
  return <>{formattedDate} - {distance} ago</>
}
