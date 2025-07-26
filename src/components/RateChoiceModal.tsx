import { Button, ButtonText, Text, View } from '@gluestack-ui/themed'
import { Star } from 'lucide-react-native'
import React from 'react'
import { Animated } from 'react-native'

interface RateChoiceModalProps {
  visible: boolean
  onClose: () => void
  onRateService: () => void
  onRateProvider: () => void
}

export function RateChoiceModal({
  visible,
  onClose,
  onRateService,
  onRateProvider,
}: RateChoiceModalProps) {
  const scaleValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }).start()
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, scaleValue])

  if (!visible) {
    return null
  }

  return (
    <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <Animated.View
        style={{ transform: [{ scale: scaleValue }] }}
        className="bg-white w-10/12 rounded-xl p-6 shadow-lg"
      >
        <View className="mx-auto bg-steam-100 p-3 rounded-full">
          <Star size={32} color="#9356FC" />
        </View>
        <Text className="text-xl font-bold text-center text-gray-800 mt-4">
          Avaliar
        </Text>
        <Text className="text-base text-center text-gray-500 my-4">
          O que você deseja avaliar?
        </Text>

        <View className="flex flex-row justify-between mt-4 w-full gap-2">
          <Button
            onPress={onRateService}
            className="flex flex-row w-[47.5%] bg-purple-500 rounded-md py-3 justify-center"
          >
            <ButtonText className="text-white font-bold">Serviço</ButtonText>
          </Button>
          <Button
            onPress={onRateProvider}
            className="flex flex-row w-[47.5%] bg-purple-500 rounded-md py-3 justify-center"
          >
            <ButtonText className="text-white font-bold">Prestador</ButtonText>
          </Button>
        </View>
        <View className="mt-4">
          <Button
            onPress={onClose}
            className="flex flex-row bg-white border border-purple-500 rounded-md py-3 justify-center w-full"
          >
            <ButtonText className="text-gray-400">Cancelar</ButtonText>
          </Button>
        </View>
      </Animated.View>
    </View>
  )
}
