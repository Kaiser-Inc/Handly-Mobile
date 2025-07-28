import { Text, VStack, View } from '@gluestack-ui/themed'
import { ChevronLeft, Star } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'

import { useAuth } from '@hooks/useAuth'
import { getProfile, getProviderRatings } from '@services/users-services'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Rating {
  id: string
  stars: number
  comment: string
  // Adicione outros campos da avaliação se houver
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height * 0.1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      const fetchRatings = async () => {
        try {
          setLoading(true)
          const profile = await getProfile()
          const providerId = profile.cpf_cnpj || profile.id

          if (!providerId) {
            setError('ID do provedor não encontrado no perfil.')
            setLoading(false)
            return
          }

          const data = await getProviderRatings(providerId)
          setRatings(data)
          setError(null)
        } catch (err) {
          console.error('Erro ao buscar avaliações do provedor:', err)
          setError('Não foi possível carregar suas avaliações.')
        } finally {
          setLoading(false)
        }
      }
      fetchRatings()
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setRatings([])
        setError(null)
        setLoading(true)
      })
    }
  }, [isOpen, slideAnim])

  if (!isOpen) {
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
          <Text className=" text-xl">Minhas Avaliações</Text>
        </View>

        {loading ? (
          <VStack className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">
              Carregando avaliações...
            </Text>
          </VStack>
        ) : error ? (
          <VStack className="flex-1 justify-center items-center">
            <Text className="text-lg text-red-500">{error}</Text>
          </VStack>
        ) : ratings.length === 0 ? (
          <VStack className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-600">
              Você ainda não possui avaliações.
            </Text>
          </VStack>
        ) : (
          <ScrollView
            className="mt-8"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {ratings.map((rating) => (
              <View
                key={rating.id}
                className="bg-steam-100 p-3 rounded-lg mb-2"
              >
                <Text className="font-bold flex flex-row items-center">
                  Nota: {rating.stars}.0{' '}
                  <Star size={12} fill="#9356FC" stroke="#9356FC" />
                </Text>
                <Text>{rating.comment}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  )
}
