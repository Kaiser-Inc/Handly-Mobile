export function formatPhoneNumber(
  phoneNumber: string | undefined | null,
): string {
  if (!phoneNumber) {
    return '-'
  }

  const cleaned = ` ${phoneNumber}`.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`
  }

  return phoneNumber
}
