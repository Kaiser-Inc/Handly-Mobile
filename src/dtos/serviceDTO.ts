export type ProviderDTO = {
  cpf_cnpj: string
  name: string
  email: string
  role: 'provider'
  phone: string | null
  profile_pic: string
}

export type ServiceWithProviderDTO = {
  id: string
  provider_key: string
  categories: string[]
  name: string
  description: string
  image: string
  created_at: number[] | Date
  updated_at: number[] | Date
  provider: ProviderDTO
  provider_id: string
}
