import { differenceInDays, differenceInHours, differenceInMinutes, differenceInYears, format, isValid, parseISO } from "date-fns"

export const formatDateTime = (input: string) => {
  let messageDate: Date

  console.log(input)

  messageDate = parseISO(input)

  if (!isValid(messageDate)) return "Invalid date"

  const now = new Date()

  if (differenceInMinutes(now, messageDate) < 1) return "Just now"
  if (differenceInHours(now, messageDate) < 1) return format(messageDate, "HH:mm")
  if (differenceInDays(now, messageDate) < 1) return format(messageDate, "HH:mm")
  if (differenceInYears(now, messageDate) < 1) return format(messageDate, "dd.MM.yyyy HH:mm")
  return format(messageDate, "EEE dd.MM.yyyy HH:mm")
}
