import type { ServiceDTO } from '@dtos/serviceDTO'
import { Image, Text, VStack, View } from '@gluestack-ui/themed'
import { apiUrl } from '@services/api/api'
import { favoriteService, getService } from '@services/services-services'
import { ChevronLeft, Heart, Star } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, Pressable, TouchableOpacity } from 'react-native'
import DefaultService from '../assets/defaut-service.svg'
import { Badge } from './Badge'

interface ServiceDetailsModalProps {
  visible: boolean
  serviceId: string | null
  onClose: () => void
  isInitiallyFavorited: boolean
  onFavoriteChange?: (serviceId: string, isFavorited: boolean) => void
}

export function ServiceDetailsModal({
  visible,
  serviceId,
  onClose,
  isInitiallyFavorited,
  onFavoriteChange,
}: ServiceDetailsModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const [serviceDetails, setServiceDetails] = useState<ServiceDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited)

  useEffect(() => {
    setIsFavorited(isInitiallyFavorited)
  }, [isInitiallyFavorited])

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height * 0.1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      if (serviceId) {
        setLoading(true)
        getService(serviceId)
          .then((data) => {
            setServiceDetails(data)
          })
          .catch((error) => {
            console.error('Erro ao buscar detalhes do serviço:', error)
            setServiceDetails(null)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setServiceDetails(null)
      })
    }
  }, [visible, serviceId, slideAnim])

  async function handleFavorite() {
    if (!serviceId) return

    const originalState = isFavorited
    setIsFavorited(!originalState)

    try {
      await favoriteService(serviceId)
      onFavoriteChange?.(serviceId, !originalState)
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar serviço:', error)
      setIsFavorited(originalState)
    }
  }

  if (!visible) {
    return null
  }

  return (
    <View className="absolute inset-0 z-50 flex items-center justify-end bg-black/50">
      <Animated.View
        style={{ transform: [{ translateY: slideAnim }] }}
        className="bg-white w-full rounded-t-3xl p-6 shadow-lg h-[95%]"
      >
        <View className=" flex flex-row items-center">
          <TouchableOpacity
            onPress={onClose}
            className=" flex flex-row bg-steam-100 p-2 rounded-full mx-4"
          >
            <ChevronLeft size={28} color="#6F7D90" />
          </TouchableOpacity>
          <Text className=" text-xl">Detalhes</Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">Carregando...</Text>
          </View>
        ) : serviceDetails ? (
          <View className=" mt-8">
            <VStack className=" flex flex-col mx-auto mb-4 relative">
              {serviceDetails.image ? (
                <Image
                  width={400}
                  height={215}
                  className=" rounded-2xl "
                  source={{
                    uri: `${apiUrl}/uploads/services/${serviceDetails.image}`,
                  }}
                  alt="Imagem de serviço"
                />
              ) : (
                <DefaultService width={120} height={120} />
              )}
              <Pressable
                onPress={handleFavorite}
                className="absolute bottom-4 right-4 bg-gray-500 p-3 rounded-full"
              >
                <Heart
                  size={24}
                  fill={isFavorited ? '#F05D6C' : 'none'}
                  stroke={isFavorited ? '#F05D6C' : '#95A1B1'}
                />
              </Pressable>
            </VStack>
            <View className=" flex flex-row w-full flex-wrap items-start">
              {serviceDetails.categories.map((category) => (
                <Badge key={category} value={category} selected={true} />
              ))}
            </View>
            <View className=" w-11/12 mx-auto">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                {serviceDetails.name}
              </Text>
              <Text className="text-base text-gray-300 mb-2">
                {serviceDetails.description}
              </Text>
              <View className=" flex flex-row items-center gap-2">
                <Star stroke="#9356FC" />
                <Text className=" text-800 font-bold text-lg">5.0</Text>
              </View>
              <View className=" flex flex-row items-cente w-11/12 justify-center items-center py-4">
                <View className=" flex flex-col items-center border-r border-purple-900 px-2 py-3 w-1/2">
                  <Text className="text-800 font-bold text-lg">
                    perseu@gmail.com
                  </Text>
                  <Text>Email</Text>
                </View>
                <View className=" flex flex-col items-center border-l border-purple-900 px-2 py-3 w-1/2">
                  <Text className="text-800 font-bold text-lg">
                    (137)99999-9999
                  </Text>
                  <Text>Contato</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-500">
              Não foi possível carregar os detalhes do serviço.
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  )
}
