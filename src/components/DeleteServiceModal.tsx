import { Button, ButtonText, Text, View } from '@gluestack-ui/themed'
import { AlertTriangle } from 'lucide-react-native'
import React from 'react'
import { Animated } from 'react-native'

interface DeleteServiceModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteServiceModal({
  visible,
  onClose,
  onConfirm,
}: DeleteServiceModalProps) {
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
        <View className="mx-auto bg-danger-100 p-3 rounded-full">
          <AlertTriangle size={32} color="#ef4444" />
        </View>
        <Text className="text-xl font-bold text-center text-gray-800 mt-4">
          Excluir Serviço
        </Text>
        <Text className="text-base text-center text-gray-500 my-4">
          Tem certeza que deseja excluir este serviço? Esta ação não poderá ser
          desfeita.
        </Text>

        <View className="flex-row justify-around mt-4">
          <Button
            onPress={onClose}
            className="flex flex-row bg-white border border-purple-500 rounded-md py-3 justify-center w-5/12"
          >
            <ButtonText className="text-gray-400">Cancelar</ButtonText>
          </Button>
          <Button
            onPress={onConfirm}
            className="flex flex-row bg-danger-300 rounded-md py-3 justify-center w-5/12"
          >
            <ButtonText className="text-white font-bold">Excluir</ButtonText>
          </Button>
        </View>
      </Animated.View>
    </View>
  )
}
