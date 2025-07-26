import type { ServiceDTO } from '@dtos/serviceDTO'
import { Image, Text, VStack, View } from '@gluestack-ui/themed'
import { apiUrl } from '@services/api/api'
import { getService } from '@services/services-services'
import { ChevronLeft, Star } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, TouchableOpacity } from 'react-native'
import DefaultService from '../assets/defaut-service.svg'
import { Badge } from './Badge'

interface ServiceDetailsModalProps {
  visible: boolean
  serviceId: string | null
  onClose: () => void
}

export function ServiceDetailsModal({
  visible,
  serviceId,
  onClose,
}: ServiceDetailsModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const [serviceDetails, setServiceDetails] = useState<ServiceDTO | null>(null)
  const [loading, setLoading] = useState(true)

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
