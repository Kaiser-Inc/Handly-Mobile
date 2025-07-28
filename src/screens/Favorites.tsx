import { Image, VStack } from '@gluestack-ui/themed'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'
import { NotificationModal } from '@components/NotificationModal'
import { Post } from '@components/Post'
import { RateChoiceModal } from '@components/RateChoiceModal'
import { RateModal } from '@components/RateModal'
import { ReportChoiceModal } from '@components/ReportChoiceModal'
import { ReportModal } from '@components/ReportModal'
import { SearchBar } from '@components/SearchBar'
import { ServiceDetailsModal } from '@components/ServiceDetailsModal'
import type { ServiceWithProviderDTO } from '@dtos/serviceDTO'
import { useAuth } from '@hooks/useAuth'
import { useScreenRefresh } from '@hooks/useScreenRefresh'
import { fetchFavorites, fetchServices } from '@services/services-services'
import { useCallback, useEffect, useState } from 'react'

export function Favorites() {
  const { isLoadingUserStorageData, token } = useAuth()
  const [services, setServices] = useState<ServiceWithProviderDTO[]>([])
  const [search, setSearch] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  )

  const [isRateChoiceModalVisible, setIsRateChoiceModalVisible] = useState(false)
  const [isRateModalVisible, setIsRateModalVisible] = useState(false)
  const [rateType, setRateType] = useState<'service' | 'provider' | null>(null)

  const [isReportChoiceModalVisible, setIsReportChoiceModalVisible] =
    useState(false)
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const [reportType, setReportType] = useState<'service' | 'provider' | null>(
    null,
  )

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)

  const handleOpenNotificationModal = () => {
    setIsNotificationModalOpen(true)
  }

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false)
  }

  const loadFavorites = useCallback(async () => {
    if (isLoadingUserStorageData || !token) {
      return
    }
    try {
      const [servicesData, favoritesData] = await Promise.all([
        fetchServices(),
        fetchFavorites(),
      ])

      const favIds = new Set(
        (favoritesData as { target_id: string }[]).map((fav) => fav.target_id),
      )

      const favoriteServices = (
        servicesData as ServiceWithProviderDTO[]
      ).filter((service) => favIds.has(service.id))

      setServices(favoriteServices)
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    }
  }, [isLoadingUserStorageData, token])

  useScreenRefresh(loadFavorites)

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  function handleUnfavorite(serviceId: string) {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== serviceId),
    )
  }

  const selectedService = services.find((s) => s.id === selectedServiceId)

  const handlePostPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedServiceId(null)
    loadFavorites() // Recarrega os favoritos para refletir as mudanças
  }

  const handleFavoriteChange = (serviceId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      handleUnfavorite(serviceId)
    }
  }

  const handleRatePress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsRateChoiceModalVisible(true)
  }

  const handleRateService = () => {
    setIsRateChoiceModalVisible(false)
    setRateType('service')
    setIsRateModalVisible(true)
  }

  const handleRateProvider = () => {
    setIsRateChoiceModalVisible(false)
    setRateType('provider')
    setIsRateModalVisible(true)
  }

  const handleCloseRateModal = () => {
    setIsRateModalVisible(false)
    setRateType(null)
  }

  const getTargetId = () => {
    if (!rateType || !selectedService) return ''
    return rateType === 'service'
      ? selectedService.id
      : selectedService.provider.cpf_cnpj
  }

  const handleReportPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsReportChoiceModalVisible(true)
  }

  const handleReportService = () => {
    setIsReportChoiceModalVisible(false)
    setReportType('service')
    setIsReportModalVisible(true)
  }

  const handleReportProvider = () => {
    setIsReportChoiceModalVisible(false)
    setReportType('provider')
    setIsReportModalVisible(true)
  }

  const handleCloseReportModal = () => {
    setIsReportModalVisible(false)
    setReportType(null)
  }

  const getReportTargetId = () => {
    if (!reportType || !selectedService) return ''
    return reportType === 'service'
      ? selectedService.id
      : selectedService.provider.cpf_cnpj
  }

  const filteredServices = services.filter(
    (service: ServiceWithProviderDTO) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()) ||
      service.provider.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <Image
        source={BackgroundImg}
        alt="gradiente de indigo a lavanda"
        defaultSource={BackgroundImg}
        className="w-full h-full absolute"
      />
      <VStack className="flex">
        <HomeHeader onBellPress={handleOpenNotificationModal}>
          <SearchBar onChange={setSearch} />
        </HomeHeader>
      </VStack>
      <ScrollView
        className="flex bg-white flex-col rounded-tr-3xl rounded-tl-3xl pt-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filteredServices.map((service: ServiceWithProviderDTO) => (
          <Post
            key={service.id}
            serviceId={service.id}
            isInitiallyFavorited={true}
            name={service.provider.name}
            categories={service.categories}
            profileImage={service.provider.profile_pic}
            serviceImage={service.image}
            onUnfavorite={handleUnfavorite}
            onPress={() => handlePostPress(service.id)}
            onRatePress={() => handleRatePress(service.id)}
            onReportPress={() => handleReportPress(service.id)}
          />
        ))}
      </ScrollView>
      <ServiceDetailsModal
        visible={isModalVisible}
        serviceId={selectedServiceId}
        onClose={handleCloseModal}
        isInitiallyFavorited={true}
        onFavoriteChange={handleFavoriteChange}
      />

      <RateChoiceModal
        visible={isRateChoiceModalVisible}
        onClose={() => setIsRateChoiceModalVisible(false)}
        onRateService={handleRateService}
        onRateProvider={handleRateProvider}
      />

      <RateModal
        visible={isRateModalVisible}
        type={rateType}
        targetId={getTargetId()}
        onClose={handleCloseRateModal}
      />

      <ReportChoiceModal
        visible={isReportChoiceModalVisible}
        onClose={() => setIsReportChoiceModalVisible(false)}
        onReportService={handleReportService}
        onReportProvider={handleReportProvider}
      />

      <ReportModal
        visible={isReportModalVisible}
        type={reportType}
        targetId={getReportTargetId()}
        onClose={handleCloseReportModal}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={handleCloseNotificationModal}
      />
    </SafeAreaView>
  )
}
