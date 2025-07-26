import BackgroundImage from '@assets/bg.png'
import { HStack, Image, Pressable, Text, VStack } from '@gluestack-ui/themed'
import clsx from 'clsx'
import { useRef } from 'react'
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { Animated, Dimensions } from 'react-native'

interface RoleSelectorProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  error?: string
}

export function RoleSelector<T extends FieldValues>({
  control,
  name,
  error,
}: RoleSelectorProps<T>) {
  const roles = [
    { label: 'Sou cliente', value: 'customer' },
    { label: 'Sou prestador', value: 'provider' },
  ]

  const slideAnim = useRef(new Animated.Value(0)).current
  const { width } = Dimensions.get('window')
  const buttonWidth = (width - 64) / 2

  const animateSlide = (toValue: number) => {
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }

  return (
    <VStack className=" w-full px-8 mt-2">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <HStack className=" flex flex-row bg-steam-100 p-1 rounded-full">
            <Animated.View
              style={{
                position: 'absolute',
                width: buttonWidth,
                height: '95%',
                top: '15%',
                left: '1%',
                backgroundColor: 'white',
                borderRadius: 9999,
                transform: [
                  {
                    translateX: slideAnim,
                  },
                ],
              }}
            >
              <Image
                source={BackgroundImage}
                alt="gradiente de indigo a lavanda"
                defaultSource={BackgroundImage}
                className="w-full h-full absolute rounded-full"
              />
            </Animated.View>
            {roles.map((role, index) => (
              <Pressable
                key={role.value}
                onPress={() => {
                  onChange(role.value)
                  animateSlide(index * buttonWidth)
                }}
                className={clsx(
                  'px-4 py-1 rounded-full w-1/2 items-center',
                  'z-10',
                )}
              >
                <Text
                  className={clsx(
                    'font-medium',
                    value === role.value ? 'text-white' : 'text-gray-300',
                  )}
                >
                  {role.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        )}
      />
      {error && <Text className=" text-danger-300 mt-1">{error}</Text>}
    </VStack>
  )
}
