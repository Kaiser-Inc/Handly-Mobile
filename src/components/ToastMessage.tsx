import { Text } from "@gluestack-ui/themed";
import React from "react";
import { Animated, View } from "react-native";

interface ToastMessageProps {
    message: string
    type?: 'success' | 'error' | 'info'
    visible: boolean
    onHide: () => void
}

export function ToastMessage({ message, type = 'info', visible, onHide }: ToastMessageProps) {
    const translateY = React.useRef(new Animated.Value(-100)).current
  
    React.useEffect(() => {
      if (visible) {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start()
  
        const timer = setTimeout(() => {
          Animated.spring(translateY, {
            toValue: -100,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start(() => {
            onHide()
          })
        }, 3000)
  
        return () => clearTimeout(timer)
      }
    }, [visible, onHide, translateY])
  
    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-danger-300',
      info: 'bg-purple-300',
    }[type]
  
    if (!visible) return null
  
    return (
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
        className={`absolute top-12 left-4 right-4 z-50 ${bgColor} py-3 px-4 rounded-lg shadow-lg`}
      >
        <Text className="text-white font-bold text-center">{message}</Text>
      </Animated.View>
    )
  }