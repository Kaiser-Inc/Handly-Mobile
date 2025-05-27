import { z } from 'zod'

export const fortmatDocument = (value: string) => {
  const numbers = value.replace(/\D/g, '')

  if (numbers.length <= 11) {
    // Formatação de CPF: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }
  // Formatação de CNPJ: 00.000.000/0000-00
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, '')

  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let rest = 11 - (sum % 11)
  const digit1 = rest > 9 ? 0 : rest
  if (digit1 !== Number.parseInt(cleanCPF.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  rest = 11 - (sum % 11)
  const digit2 = rest > 9 ? 0 : rest
  if (digit2 !== Number.parseInt(cleanCPF.charAt(10))) return false

  return true
}

const validateCNPJ = (cnpj: string) => {
  const cleanCNPJ = cnpj.replace(/\D/g, '')

  if (cleanCNPJ.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false

  let size = cleanCNPJ.length - 2
  let numbers = cleanCNPJ.substring(0, size)
  const digits = cleanCNPJ.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number.parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number.parseInt(digits.charAt(0))) return false

  size = size + 1
  numbers = cleanCNPJ.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += Number.parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== Number.parseInt(digits.charAt(1))) return false

  return true
}

export const signUpSchema = z.object({
  name: z.string({ required_error: 'Campo obrigatório' }),
  email: z
    .string({ required_error: 'Campo obrigatório' })
    .email('Email invalido'),
  password: z
    .string({ required_error: 'Campo obrigatório' })
    .min(8, 'A senha deve conter pelo menos 8 caracteres')
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: 'A senha deve conter pelo menos uma letra',
    })
    .refine((val) => !/^\d+$/.test(val), {
      message: 'A senha não pode conter apenas números',
    }),
  role: z.enum(['customer', 'provider']),
  cpf_cnpj: z.string({ required_error: 'Campo obrigatório' }).refine((val) => {
    const cleanValue = val.replace(/\D/g, '')
    if (cleanValue.length === 11) {
      return validateCPF(cleanValue)
    }
    if (cleanValue.length === 14) {
      return validateCNPJ(cleanValue)
    }
    return false
  }, 'CPF ou CNPJ inválido'),
})

export type SignUpData = z.infer<typeof signUpSchema>
