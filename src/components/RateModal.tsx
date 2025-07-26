import { Text, VStack, View } from '@gluestack-ui/themed'
import { ChevronLeft, Star } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, TouchableOpacity } from 'react-native'

import LoveEmoji from '@assets/love.svg'
import { GradientButton } from './GradientButton'

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
        toValue: Dimensions.get('window').height * 0.1,
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

  const handleOnSubmit = () => {
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
          <View className=" mx-auto bg-steam-100 p-3 rounded-full mb-4">
            <LoveEmoji width={40} height={40} />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            {type === 'service'
              ? 'Avalie este serviço'
              : 'Avalie este prestador'}
          </Text>
          <Text className="text-xl text-gray-800 mb-4 w-11/12">
            {type === 'service'
              ? 'O que achou do serviço?'
              : 'Como foi a sua experiência?'}
          </Text>

          <View className="flex flex-row gap-4 mt-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
              >
                <Star
                  size={40}
                  fill={star <= rating ? '#FFB65C' : '#E6E6E6'}
                  stroke={star <= rating ? '#FFB65C' : '#E6E6E6'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-xl text-gray-800 mb-4 w-11/12">
            Quer deixar um comentário?
          </Text>

          <GradientButton onPress={handleOnSubmit} text="Enviar avaliação" />
        </VStack>
      </Animated.View>
    </View>
  )
}
