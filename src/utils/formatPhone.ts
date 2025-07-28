export function formatPhoneNumber(phoneNumber: string | undefined | null): string {
  if (!phoneNumber) {
    return '-'
  }

  const cleaned = ('' + phoneNumber).replace(/\D/g, '')

  // Brazilian phone numbers can have 10 (DDNNNNNNNN) or 11 (DDNNNNNNNNN) digits
  // 10 digits: (DD) NNNN-NNNN
  // 11 digits: (DD) NNNNN-NNNN

  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`
  } else if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7, 11)}`
  }

  return phoneNumber // Return original if not a valid length
}
