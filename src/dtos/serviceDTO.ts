export type ServiceDTO = {
  categories: string[]
  created_at: Date
  description: string
  id: string
  image: string
  name: string
  provider_key: string
  updated_at: Date
}

export type ServiceFeedDTO = {
  id: string
  categories: string[]
  image: string
  service_name: string
  description: string
}
