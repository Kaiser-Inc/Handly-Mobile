import {
  Image,
  ScrollView,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { GradientButton } from '@components/GradientButton'
import { HomeHeader } from '@components/HomeHeader'
import { SearchBar } from '@components/SearchBar'
import { useAuth } from '@hooks/useAuth'

export function Feed() {
  const { signOut } = useAuth()
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
        <GradientButton text="Sair" onPress={signOut} />
      </ScrollView>
    </SafeAreaView>
  )
}
