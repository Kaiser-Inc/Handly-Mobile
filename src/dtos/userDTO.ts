export type UserDTO = {
  cpf_cnpj: string
  name: string
  email: string
  role: 'customer' | 'provider'
  profile_pic: typeof File | null
}

export type TokenDTO = {
  access_token: string
}
