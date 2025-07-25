import { Image, ScrollView, Text, VStack, View } from '@gluestack-ui/themed'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { Badge } from '@components/Badge'
import { GradientButton } from '@components/GradientButton'
import { HomeHeader } from '@components/HomeHeader'
import { Post } from '@components/Post'
import { SearchBar } from '@components/SearchBar'
import { ToastMessage } from '@components/ToastMessage'
import type { ServiceFeedDTO } from '@dtos/serviceDTO'
import { useAuth } from '@hooks/useAuth'
import { useScreenRefresh } from '@hooks/useScreenRefresh'
import { fetchFavorites, getCategories } from '@services/services-services'
import { useCallback, useEffect, useState } from 'react'

export function Categories() {
  const { token } = useAuth()
  const [selected, setSelected] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [services, setServices] = useState<ServiceFeedDTO[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceFeedDTO[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )
  const [search, setSearch] = useState('')

  const loadData = useCallback(async () => {
    if (!token) {
      return
    }
    try {
      const [categoriesData, favoritesData] = await Promise.all([
        getCategories([]),
        fetchFavorites(),
      ])

      const favIds = new Set(
        (favoritesData as { target_id: string }[]).map((fav) => fav.target_id),
      )

      setCategories(categoriesData.categories)
      setServices(categoriesData.services)
      setFavoriteIds(favIds)
      setFilteredServices([])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
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

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase()),
  )

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
        <HomeHeader>
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
          {filteredServices.map((service) => (
            <Post
              key={service.id}
              serviceId={service.id}
              isInitiallyFavorited={favoriteIds.has(service.id)}
              name={service.provider_name}
              categories={service.categories}
              profileImage={service.profile_pic}
              serviceImage={service.image}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}