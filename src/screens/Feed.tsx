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
import { useFocusEffect } from '@react-navigation/native'
import { fetchFavorites, getFeed } from '@services/services-services'
import { useCallback, useState } from 'react'

export function Feed() {
  const { isLoadingUserStorageData, token } = useAuth()
  const [services, setServices] = useState<ServiceFeedDTO[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
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

      setServices(servicesData as ServiceFeedDTO[])
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
    (service: ServiceFeedDTO) =>
      service.service_name.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase()) ||
      service.provider_name.toLowerCase().includes(search.toLowerCase()),
  )

  const handlePostPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedServiceId(null)
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
        <HomeHeader>
          <SearchBar onChange={setSearch} />
        </HomeHeader>
      </VStack>
      <ScrollView
        className="flex bg-white flex-col rounded-tr-3xl rounded-tl-3xl pt-10 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filteredServices.map((service: ServiceFeedDTO) => (
          <Post
            key={service.id}
            serviceId={service.id}
            isInitiallyFavorited={favoriteIds.has(service.id)}
            name={service.provider_name}
            categories={service.categories}
            profileImage={service.profile_pic}
            serviceImage={service.image}
            onPress={handlePostPress}
          />
        ))}
      </ScrollView>

      <ServiceDetailsModal
        visible={isModalVisible}
        serviceId={selectedServiceId}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  )
}
