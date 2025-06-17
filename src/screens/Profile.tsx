import { Center, Image, Text, get } from '@gluestack-ui/themed'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import BackgroundImg from '@assets/bg.png'
import { GradientButton } from '@components/GradientButton'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import type { UserDTO } from '@dtos/userDTO'
import { useAuth } from '@hooks/useAuth'
import { getProfile } from '@services/users-services'
import { AppError } from '@utils/AppError'
import React from 'react'

export function Profile() {
  const { signOut } = useAuth()
  const [user, setUser] = useState<UserDTO | null>(null)

  const [toastVisible, setToastVisible] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState('')
  const [toastType, setToastType] = React.useState<
    'success' | 'error' | 'info'
  >('error')

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const userData = await getProfile()
        setUser(userData)
      } catch (error) {
        const isAppError = error instanceof AppError
        const message = isAppError
          ? error.message
          : 'Algo deu errado, por favor tente novamente'

        setToastMessage(message)
        setToastType('error')
        setToastVisible(true)
      }
    }

    loadUserProfile()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <Center className=" w-full h-full items-center">
        <Text className=" font-bold text-xl my-12"> Perfil! </Text>
        <Center className=" w-10/12 h-32 shadow-2xl rounded-3xl overflow-hidden bg-white">
          <Image
            source={BackgroundImg}
            alt="gradiente de indigo a lavanda"
            defaultSource={BackgroundImg}
            className="w-full h-full"
          />
        </Center>
        <UserPhoto
          className=" w-32 h-32 rounded-full -mt-20 border-4 border-white bg-gray-400 "
          source={{
            uri: user?.profile_pic || 'https://unavatar.io/substack/bankless',
          }}
          alt="Foto de perfil de usuário"
        />
        <Text className=" font-bold text-2xl mt-8">
          {' '}
          {user?.name || 'Carregando...'}{' '}
        </Text>
        <Text className=" text-gray-400 mt-4">
          {' '}
          {user?.email || 'Carregando...'}{' '}
        </Text>
        <Center className="mt-auto">
          <GradientButton text="Sair" onPress={signOut} />
        </Center>
      </Center>
    </SafeAreaView>
  )
}
