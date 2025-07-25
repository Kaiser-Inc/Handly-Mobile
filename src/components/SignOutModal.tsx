import { Button, ButtonText, Text, View } from '@gluestack-ui/themed'
import React from 'react'
import { Animated } from 'react-native'

import SadEmoji from '@assets/sad.svg'

interface SignOutModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function SignOutModal({
  visible,
  onClose,
  onConfirm,
}: SignOutModalProps) {
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
        <View className=" mx-auto bg-danger-100 p-2 rounded-full">
          <SadEmoji width={40} height={40} />
        </View>
        <Text className="text-xl font-bold text-center text-gray-800">
          Tem certeza que deseja sair?
        </Text>
        <Text className="text-base text-center text-gray-400 my-4">
          Você poderá entrar novamente a qualquer momento.
        </Text>
        <Text className="text-base text-center text-gray-400 my-4">
          Vamos sentir sua falta!
        </Text>

        <View className="flex-row justify-around mt-4">
          <Button
            onPress={onClose}
            className="flex flex-row bg-white border border-purple-500 rounded-md py-3 justify-center w-5/12"
          >
            <ButtonText className="text-gray-400">Ficar</ButtonText>
          </Button>
          <Button
            onPress={onConfirm}
            className="flex flex-row bg-gray-800 border border-gray-800 rounded-md py-3 justify-center w-5/12"
          >
            <ButtonText className="text-white font-bold">Sair</ButtonText>
          </Button>
        </View>
      </Animated.View>
    </View>
  )
}
