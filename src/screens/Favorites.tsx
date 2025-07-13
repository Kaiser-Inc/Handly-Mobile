import { Image, VStack } from '@gluestack-ui/themed'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'
import { Post } from '@components/Post'
import { SearchBar } from '@components/SearchBar'
import type { ServiceFeedDTO } from '@dtos/serviceDTO'
import { useFocusEffect } from '@react-navigation/native'
import { getFeed } from '@services/services-services'
import { useCallback, useEffect, useState } from 'react'

export function Favorites() {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')

  const loadServices = useCallback(async () => {
    const data = await getFeed()
    setServices(data)
  }, [])

  useEffect(() => {
    loadServices()
  }, [loadServices])

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
            name={service.service_name}
            // serviceImage={service.image}
            categories={service.categories}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
