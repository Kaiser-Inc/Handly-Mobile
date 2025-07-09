import { Image, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'

import { Badge } from '@components/Badge'
import { categories } from '../@types/categories'

export function Categories() {
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
        className=" flex-1 bg-white rounded-tr-3xl rounded-tl-3xl py-8"
        showsVerticalScrollIndicator={false}
      >
        <View className=" flex flex-row w-full flex-wrap items-start px-4 mb-12">
          {categories.map((category: string) => (
            <Badge key={category} content={category} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
