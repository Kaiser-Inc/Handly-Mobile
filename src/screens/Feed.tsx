import { Image, Text, VStack, View } from '@gluestack-ui/themed'
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
import { useFocusEffect } from '@react-navigation/native'
import { fetchFavorites, fetchServices } from '@services/services-services'
import { useCallback, useState } from 'react'

export function Feed() {
  const { isLoadingUserStorageData, token } = useAuth()
  const [services, setServices] = useState<ServiceWithProviderDTO[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  )

  const [isRateChoiceModalVisible, setIsRateChoiceModalVisible] =
    useState(false)
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

  const loadData = useCallback(async () => {
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

      setServices(servicesData as ServiceWithProviderDTO[])
      setFavoriteIds(favIds)
    } catch (error) {
      console.error('Erro ao carregar dados do feed:', error)
    }
  }, [isLoadingUserStorageData, token])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData]),
  )

  const filteredServices = services.filter(
    (service: ServiceWithProviderDTO) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()) ||
      service.provider.name.toLowerCase().includes(search.toLowerCase()),
  )

  const selectedService = services.find((s) => s.id === selectedServiceId)

  const handlePostPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedServiceId(null)
    loadData()
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
        className="flex bg-white flex-col rounded-tr-3xl rounded-tl-3xl pt-10 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map((service: ServiceWithProviderDTO) => (
            <Post
              key={service.id}
              serviceId={service.id}
              isInitiallyFavorited={favoriteIds.has(service.id)}
              name={service.provider.name}
              categories={service.categories}
              profileImage={service.provider.profile_pic}
              serviceImage={service.image}
              onPress={() => handlePostPress(service.id)}
              onRatePress={() => handleRatePress(service.id)}
              onReportPress={() => handleReportPress(service.id)}
              providerCpfCnpj={service.provider.cpf_cnpj}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">
              Nenhum serviço encontrado.
            </Text>
          </View>
        )}
      </ScrollView>

      <ServiceDetailsModal
        visible={isModalVisible}
        serviceId={selectedServiceId}
        onClose={handleCloseModal}
        isInitiallyFavorited={favoriteIds.has(selectedServiceId || '')}
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
