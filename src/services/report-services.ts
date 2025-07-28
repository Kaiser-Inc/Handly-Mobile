import type { ReportReason } from '../@types/reportReasons'
import { api } from './api/api'

export async function reportService(
  serviceId: string,
  reason: ReportReason,
  description: string,
) {
  await api.post(`/services/${serviceId}/report`, {
    reason,
    description,
  })
}

export async function reportUser(
  userId: string,
  reason: ReportReason,
  description: string,
) {
  await api.post(`/users/${userId}/report`, {
    reason,
    description,
  })
}
