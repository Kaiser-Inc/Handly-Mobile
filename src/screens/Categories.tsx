import { Image, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { Badge } from '@components/Badge'
import { GradientButton } from '@components/GradientButton'
import { HomeHeader } from '@components/HomeHeader'
import { NotificationModal } from '@components/NotificationModal'
import { Post } from '@components/Post'
import { RateChoiceModal } from '@components/RateChoiceModal'
import { RateModal } from '@components/RateModal'
import { ReportChoiceModal } from '@components/ReportChoiceModal'
import { ReportModal } from '@components/ReportModal'
import { SearchBar } from '@components/SearchBar'
import { ServiceDetailsModal } from '@components/ServiceDetailsModal'
import { ToastMessage } from '@components/ToastMessage'
import type { ServiceWithProviderDTO } from '@dtos/serviceDTO'
import { useAuth } from '@hooks/useAuth'
import { useScreenRefresh } from '@hooks/useScreenRefresh'
import {
  fetchFavorites,
  fetchServices,
  getCategories,
} from '@services/services-services'
import { useCallback, useEffect, useState } from 'react'

export function Categories() {
  const { token } = useAuth()
  const [selected, setSelected] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [services, setServices] = useState<ServiceWithProviderDTO[]>([])
  const [filteredServices, setFilteredServices] = useState<
    ServiceWithProviderDTO[]
  >([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )
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
    if (!token) {
      return
    }
    try {
      const [servicesData, favoritesData, categoriesData] = await Promise.all([
        fetchServices(),
        fetchFavorites(),
        getCategories([]),
      ])

      const favIds = new Set(
        (favoritesData as { target_id: string }[]).map((fav) => fav.target_id),
      )

      setCategories(
        Array.isArray(categoriesData?.categories)
          ? categoriesData.categories
          : [],
      )

      setServices(servicesData as ServiceWithProviderDTO[])
      setFavoriteIds(favIds)
      setFilteredServices([])
    } catch (error) {}
  }, [token])

  useScreenRefresh(loadData)

  useEffect(() => {
    loadData()
  }, [loadData])

  function toggleCategory(category: string) {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category))
    } else if (selected.length < 5) {
      setSelected([...selected, category])
    }
  }

  async function handleFilter() {
    const filtrados = services
      .filter((service) =>
        service.categories?.some((cat: string) => selected.includes(cat)),
      )
      .sort((a, b) => {
        const aIsFav = favoriteIds.has(a.id)
        const bIsFav = favoriteIds.has(b.id)
        if (aIsFav === bIsFav) {
          return 0
        }
        return aIsFav ? -1 : 1
      })

    setFilteredServices(filtrados)
    setToastMessage(
      filtrados.length > 0
        ? 'Serviços filtrados com sucesso'
        : 'Nenhum serviço encontrado',
    )
    setToastType(filtrados.length > 0 ? 'success' : 'info')
    setToastVisible(true)
  }

  const selectedService = services.find((s) => s.id === selectedServiceId)

  const handlePostPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedServiceId(null)
    loadData() // Recarrega os dados para refletir as mudanças de favorito
  }

  const handleFavoriteChange = (serviceId: string, isFavorited: boolean) => {
    setFavoriteIds((prev) => {
      const newFavIds = new Set(prev)
      if (isFavorited) {
        newFavIds.add(serviceId)
      } else {
        newFavIds.delete(serviceId)
      }
      return newFavIds
    })
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

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) =>
        category.toLowerCase().includes(search.toLowerCase()),
      )
    : []

  const badgesToShow =
    filteredServices.length > 0 ? selected : filteredCategories

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
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
        className=" flex-1 bg-white rounded-tr-3xl rounded-tl-3xl"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-row items-center justify-between my-8 mx-8">
          <Text className="text-lg">Filtre até cinco categorias</Text>
          <TouchableOpacity
            onPress={() => {
              setSelected([])
              setFilteredServices([])
            }}
          >
            <Text className="text-purple-900 font-bold">Limpar</Text>
          </TouchableOpacity>
        </View>
        <View className=" flex flex-row w-full flex-wrap items-start px-4 mb-12">
          {badgesToShow.map((category: string) => (
            <Badge
              key={category}
              value={category}
              selected={selected.includes(category)}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </View>
        <GradientButton text="Filtrar Categorias" onPress={handleFilter} />
        <View>
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
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
          ) : categories.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-lg text-gray-600">
                Nenhum serviço ou categoria encontrado.
              </Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-lg text-gray-600">
                Nenhum serviço filtrado.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ServiceDetailsModal
        visible={isModalVisible}
        serviceId={selectedServiceId}
        onClose={handleCloseModal}
        isInitiallyFavorited={favoriteIds.has(selectedServiceId || '')}
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
