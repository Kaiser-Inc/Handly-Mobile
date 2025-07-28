import { Text, VStack, View } from '@gluestack-ui/themed'
import { ChevronLeft } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Animated, Dimensions, TouchableOpacity } from 'react-native'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const slideAnim = React.useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current

  useEffect(() => {
    if (isOpen) {
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
      }).start()
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
          <Text className=" text-xl">Notificações</Text>
        </View>

        <VStack className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">
            Conteúdo do modal de notificações.
          </Text>
        </VStack>
      </Animated.View>
    </View>
  )
}
