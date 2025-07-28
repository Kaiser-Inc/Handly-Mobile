export type UserDTO = {
  cpf_cnpj: string
  name: string
  email: string
  phone: string | null
  role: 'customer' | 'provider'
  profile_pic: string | null
}

export type TokenDTO = {
  access_token: string
}
