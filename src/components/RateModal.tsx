import {
  Button,
  ButtonText,
  Input,
  InputField,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed'
import { ChevronLeft, Star } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, TouchableOpacity } from 'react-native'

interface RateModalProps {
  visible: boolean
  type: 'service' | 'provider' | null
  onClose: () => void
}

export function RateModal({ visible, type, onClose }: RateModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height * 0.1, // Ajuste para cobrir a maior parte da tela
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setRating(0)
        setComment('')
      })
    }
  }, [visible, slideAnim])

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const handleSubmit = () => {
    console.log(
      `Avaliação de ${type}: Estrelas: ${rating}, Comentário: ${comment}`,
    )
    onClose()
  }

  if (!visible || !type) {
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
          <Text className=" text-xl">
            Avaliar {type === 'service' ? 'Serviço' : 'Prestador'}
          </Text>
        </View>

        <VStack className=" mt-8 items-center flex-1">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            {type === 'service' ? 'Avalie o Serviço' : 'Avalie o Prestador'}
          </Text>
          <Text className="text-base text-gray-300 mb-2 text-center">
            Deixe sua avaliação e comentário para ajudar outros usuários.
          </Text>

          <View className="flex-row my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Star
                  size={32}
                  fill={star <= rating ? '#FFD700' : 'none'}
                  stroke={star <= rating ? '#FFD700' : '#95A1B1'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            onPress={handleSubmit}
            className="flex flex-row bg-purple-500 rounded-md py-3 justify-center w-11/12"
          >
            <ButtonText className="text-white font-bold">
              Enviar Avaliação
            </ButtonText>
          </Button>
        </VStack>
      </Animated.View>
    </View>
  )
}
