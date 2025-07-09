import { Image, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { HomeHeader } from '@components/HomeHeader'

import { Badge } from '@components/Badge'
import { GradientButton } from '@components/GradientButton'
import { useState } from 'react'
import { categories } from '../@types/categories'

export function Categories() {
  const [selected, setSelected] = useState<string[]>([])

  function toggleCategory(category: string) {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category))
    } else if (selected.length < 5) {
      setSelected([...selected, category])
    }
  }

  function handleFilter() {
    console.log(selected)
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
        <HomeHeader />
      </VStack>
      <ScrollView
        className=" flex-1 bg-white rounded-tr-3xl rounded-tl-3xl"
        showsVerticalScrollIndicator={false}
      >
        <Text className=" my-8 ml-8 text-lg">Filtre até cinco categorias</Text>
        <View className=" flex flex-row w-full flex-wrap items-start px-4 mb-12">
          {categories.map((category: string) => (
            <Badge
              key={category}
              value={category}
              selected={selected.includes(category)}
              onPress={() => toggleCategory(category)}
            />
          ))}
        </View>
        <GradientButton text="Filtrar Categorias" onPress={handleFilter} />
      </ScrollView>
    </SafeAreaView>
  )
}
