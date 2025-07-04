import dayjs from "dayjs"

/**
 * Formats a date string into a human-readable relative time format
 * Provides contextual time display based on how recent the date is
 *
 * @param date - ISO date string to format
 * @returns Formatted time string:
 *   - "Just now" for less than 1 minute ago
 *   - "hh:mm A" for same day
 *   - "MM DD, hh:mm A" for same year
 *   - "DDD MM YYYY hh:mm A" for older dates
 */
export const formatDateTime = (date: string) => {
  const now = dayjs()
  const messageDate = dayjs(date)

  if (now.diff(messageDate, "minute") < 1) return "Just now"
  if (now.diff(messageDate, "hour") < 1) return messageDate.format("hh:mm A")
  if (now.diff(messageDate, "day") < 1) return messageDate.format("hh:mm A")
  if (now.diff(messageDate, "year") < 1) return messageDate.format("MM DD, hh:mm A")
  return messageDate.format("DDD MM YYYY hh:mm A")
}
