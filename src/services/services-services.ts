import { storageTokenGet } from '@storage/storageToken'
import type { serviceData } from '../@types/serviceSchema'
import { api, apiUrl } from './api/api'

export async function fetchServices() {
  const response = await api.get('/services')
  return response.data
}

export async function getService(serviceId: string) {
  const response = await api.get(`/services/${serviceId}`)
  return response.data
}

export async function createService(serviceData: serviceData) {
  const response = await api.post('/services', serviceData)
  return response.data
}

export async function updateService(
  serviceId: string,
  serviceUpdatedData: Partial<serviceData>,
) {
  const response = await api.put(`/services/${serviceId}`, serviceUpdatedData)
  return response.data
}

export async function deleteService(serviceId: string) {
  const response = await api.delete(`/services/${serviceId}`)
  return response.data
}

export async function updateServiceImage(
  serviceId: string,
  serviceImage: string,
) {
  const response = await api.post(`/services/${serviceId}/image`, serviceImage)
  return response.data
}

export async function uploadServiceImage(
  serviceId: string,
  formData: FormData,
) {
  const token = await storageTokenGet()
  const response = await fetch(`${apiUrl}/services/${serviceId}/image`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Erro no upload: ${response.status} - ${errorData}`)
  }

  return await response.json()
}

export async function getFeed() {
  const response = await api.get('/feed')
  return response.data
}

export async function getCategories(filter: string[]) {
  if (!filter || filter.length === 0) {
    const response = await api.get('/categories')
    return response.data
  }

  const filterString = filter.join(',')
  const response = await api.get(`/categories?filer=${filterString}`)
  return response.data
}
