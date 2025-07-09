import { Image, ScrollView, VStack } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'
import { Post } from '@components/Post'
import type { ServiceFeedDTO } from '@dtos/serviceDTO'
import { fetchServices, getFeed } from '@services/services-services'
import { useEffect, useState } from 'react'

export function Favorites() {
  const [services, setServices] = useState([])
  useEffect(() => {
    async function loadServices() {
      const data = await getFeed()
      setServices(data)
    }
    loadServices()
  }, [])

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <Image
        source={BackgroundImg}
        alt="gradiente de indigo a lavanda"
        defaultSource={BackgroundImg}
        className="w-full h-full absolute"
      />
      <VStack className="flex">
        <HomeHeader />
      </VStack>
      <ScrollView
        className="flex bg-white flex-col rounded-tr-3xl rounded-tl-3xl pt-10"
        showsVerticalScrollIndicator={false}
      >
        {services.map((service: ServiceFeedDTO) => (
          <Post
            key={service.service_name}
            name={service.service_name}
            image={service.image}
            categories={service.categories}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
