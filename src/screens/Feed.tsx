import {
  Image,
  ScrollView,
  VStack,
} from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'
import { Post } from '@components/Post'
import { SearchBar } from '@components/SearchBar'

export function Feed() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <Image
        source={BackgroundImg}
        alt="gradiente de indigo a lavanda"
        defaultSource={BackgroundImg}
        className="w-full h-full absolute"
      />
      <VStack className="flex">
        <HomeHeader/>
        <SearchBar />
      </VStack>
      <ScrollView
        className="flex bg-white flex-col rounded-tr-3xl rounded-tl-3xl pt-10"
        showsVerticalScrollIndicator={false}
      >
        <Post />
      </ScrollView>
    </SafeAreaView>
  )
}
