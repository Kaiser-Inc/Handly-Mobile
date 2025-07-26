import { Image, VStack } from '@gluestack-ui/themed'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'
import { Post } from '@components/Post'
import { SearchBar } from '@components/SearchBar'
import { ServiceDetailsModal } from '@components/ServiceDetailsModal'
import type { ServiceFeedDTO } from '@dtos/serviceDTO'
import { useAuth } from '@hooks/useAuth'
import { useScreenRefresh } from '@hooks/useScreenRefresh'
import { fetchFavorites, getFeed } from '@services/services-services'
import { useCallback, useEffect, useState } from 'react'

export function Favorites() {
  const { isLoadingUserStorageData, token } = useAuth()
  const [services, setServices] = useState<ServiceFeedDTO[]>([])
  const [search, setSearch] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  )

  const loadFavorites = useCallback(async () => {
    if (isLoadingUserStorageData || !token) {
      return
    }
    try {
      const [servicesData, favoritesData] = await Promise.all([
        getFeed(),
        fetchFavorites(),
      ])

      const favIds = new Set(
        (favoritesData as { target_id: string }[]).map((fav) => fav.target_id),
      )

      const favoriteServices = (servicesData as ServiceFeedDTO[]).filter(
        (service) => favIds.has(service.id),
      )

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

  const filteredServices = services.filter(
    (service: ServiceFeedDTO) =>
      service.service_name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()),
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
        <HomeHeader>
          <SearchBar onChange={setSearch} />
        </HomeHeader>
      </VStack>
      <ScrollView
        className="flex bg-white flex-col rounded-tr-3xl rounded-tl-3xl pt-10"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filteredServices.map((service: ServiceFeedDTO) => (
          <Post
            key={service.id}
            serviceId={service.id}
            isInitiallyFavorited={true}
            name={service.provider_name}
            categories={service.categories}
            profileImage={service.profile_pic}
            serviceImage={service.image}
            onUnfavorite={handleUnfavorite}
            onPress={handlePostPress}
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
    </SafeAreaView>
  )
}
