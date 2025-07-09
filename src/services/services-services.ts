import type { serviceData } from '../@types/serviceSchema'
import { api } from './api/api'

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
  const response = await api.post(`/services/${serviceId}`, serviceUpdatedData)
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

export async function getFeed() {
  const response = await api.get('/feed')
  return response.data
}
