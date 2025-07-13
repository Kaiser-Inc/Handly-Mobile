import { Image, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { Badge } from '@components/Badge'
import { GradientButton } from '@components/GradientButton'
import { HomeHeader } from '@components/HomeHeader'
import { SearchBar } from '@components/SearchBar'
import { ToastMessage } from '@components/ToastMessage'
import type { ServiceFeedDTO } from '@dtos/serviceDTO'
import { getCategories } from '@services/services-services'
import { useEffect, useState } from 'react'

export function Categories() {
  const [selected, setSelected] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [services, setServices] = useState<ServiceFeedDTO[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceFeedDTO[]>([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories([])
      setCategories(data.categories)
      setServices(data.services)
      setFilteredServices([]) // Limpa os filtrados ao carregar
    }
    loadCategories()
  }, [])

  function toggleCategory(category: string) {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category))
    } else if (selected.length < 5) {
      setSelected([...selected, category])
    }
  }

  async function handleFilter() {
    const filtrados = services.filter((service) =>
      service.categories?.some((cat: string) => selected.includes(cat)),
    )
    setFilteredServices(filtrados)
    setToastMessage(
      filtrados.length > 0
        ? 'Serviços filtrados com sucesso'
        : 'Nenhum serviço encontrado',
    )
    setToastType(filtrados.length > 0 ? 'success' : 'info')
    setToastVisible(true)
  }

  // Filtra as categorias pelo texto da barra de pesquisa
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase()),
  )

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
        <HomeHeader>
          <SearchBar onChange={setSearch} />
        </HomeHeader>
      </VStack>
      <ScrollView
        className=" flex-1 bg-white rounded-tr-3xl rounded-tl-3xl"
        showsVerticalScrollIndicator={false}
      >
        <Text className=" my-8 ml-8 text-lg">Filtre até cinco categorias</Text>
        <View className=" flex flex-row w-full flex-wrap items-start px-4 mb-12">
          {filteredCategories.map((category: string) => (
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
          {filteredServices.map((service) => (
            <Text key={service.service_name}>{service.service_name}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
