import { Text, VStack, View } from '@gluestack-ui/themed'
import { ChevronLeft, Star } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Animated, Dimensions, TextInput, TouchableOpacity } from 'react-native'

import LoveEmoji from '@assets/love.svg'
import { rateService } from '@services/services-services'
import { rateUser } from '@services/users-services'
import { AppError } from '@utils/AppError'
import { GradientButton } from './GradientButton'
import { ToastMessage } from './ToastMessage' // Importe o ToastMessage

interface RateModalProps {
  visible: boolean
  type: 'service' | 'provider' | null
  targetId: string
  onClose: () => void
}

export function RateModal({
  visible,
  type,
  targetId,
  onClose,
}: RateModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )

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

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const handleOnSubmit = async () => {
    if (rating === 0) {
      showToast(
        'Por favor, selecione uma avaliação de 1 a 5 estrelas.',
        'error',
      )
      return
    }

    setIsSubmitting(true)
    try {
      if (type === 'service') {
        await rateService(targetId, rating, comment)
      } else {
        await rateUser(targetId, rating, comment)
      }
      showToast('Avaliação enviada com sucesso!', 'success')
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      const isAppError = error instanceof AppError
      const errorMessage = isAppError
        ? error.message
        : 'Não foi possível enviar a avaliação. Tente novamente mais tarde.'
      showToast(errorMessage, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!visible || !type) {
    return null
  }

  return (
    <View className="absolute inset-0 z-50 flex items-center justify-end bg-black/50">
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
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

          <TextInput
            className="w-11/12 h-28 bg-steam-100 rounded-lg p-4 mb-8"
            placeholder="Opcional"
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />

          <GradientButton
            onPress={handleOnSubmit}
            text="Enviar avaliação"
            isLoading={isSubmitting}
          />
        </VStack>
      </Animated.View>
    </View>
  )
}
