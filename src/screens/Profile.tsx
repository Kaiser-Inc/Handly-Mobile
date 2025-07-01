import {
  Center,
  Image,
  Input,
  InputField,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Camera, Pencil, ThumbsUp } from 'lucide-react-native'

import BackgroundImg from '@assets/bg.png'
import { GradientButton } from '@components/GradientButton'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import type { UserDTO } from '@dtos/userDTO'
import { useAuth } from '@hooks/useAuth'
import {
  getProfile,
  updateUser,
  uploadProfilePic,
} from '@services/users-services'
import { AppError } from '@utils/AppError'
import { z } from 'zod'
import { imagemProfileSchema } from '../@types/profileSchema'

export function Profile() {
  const { signOut } = useAuth()
  const [user, setUser] = useState<UserDTO | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )

  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')

  const loadUserProfile = useCallback(async () => {
    try {
      const userData = await getProfile()
      setUser(userData)
      setEditedName(userData.name)
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Algo deu errado, por favor tente novamente'

      setToastMessage(message)
      setToastType('error')
      setToastVisible(true)
    }
  }, [])

  async function handleSelectImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
      base64: true,
    })

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0]
      const base64 = `data:image/jpeg;base64,${image.base64}`

      try {
        imagemProfileSchema.parse(base64)
        await uploadProfilePic({ profile_pic: base64 })
        await loadUserProfile()
        showToast('Foto atualizada com sucesso!', 'success')
      } catch (error) {
        if (error instanceof z.ZodError) {
          showToast(error.errors[0].message, 'error')
        } else {
          console.error(error)
          showToast('Erro ao enviar a imagem!', 'error')
        }
      }
    }
  }

  async function handleUpdateName() {
    try {
      await updateUser({ name: editedName })
      await loadUserProfile()
      setIsEditingName(false)
      showToast('Nome atualizado com sucesso!', 'success')
    } catch {
      showToast('Erro ao atualizar o nome.', 'error')
    }
  }

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  useEffect(() => {
    loadUserProfile()
  }, [loadUserProfile])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <Center className="w-full h-full items-center">
        <Text className="font-bold text-xl my-12">Perfil</Text>

        <Center className="w-10/12 h-32 shadow-2xl rounded-3xl overflow-hidden bg-white">
          <Image
            source={BackgroundImg}
            alt="gradiente de indigo a lavanda"
            defaultSource={BackgroundImg}
            className="w-full h-full"
          />
        </Center>

        <View className="relative -mt-20">
          <UserPhoto
            className="w-32 h-32 rounded-full border-4 border-white bg-gray-400"
            source={{
              uri:
                typeof user?.profile_pic === 'string'
                  ? user.profile_pic
                  : 'https://unavatar.io/substack/bankless',
            }}
            alt="Foto de perfil de usuário"
          />
          <TouchableOpacity
            className="absolute bottom-2 right-2 bg-white rounded-full p-1"
            onPress={handleSelectImage}
          >
            <Camera size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-4">
          {isEditingName ? (
            <VStack className=" flex flex-col justify-start w-8/12">
              <Text className=" font-bold text-xl">Nome completo</Text>
              <Input className=" w-full border-b-2 border-purple-300 flex flex-row justify-between items-center">
                <InputField
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Digite seu nome"
                />
                <TouchableOpacity className="ml-2" onPress={handleUpdateName}>
                  <ThumbsUp size={20} color="#9356FC" />
                </TouchableOpacity>
              </Input>
            </VStack>
          ) : (
            <>
              <Text className="text-xl font-medium text-black mr-2">
                {user?.name || 'Usuário'}
              </Text>
              <TouchableOpacity onPress={() => setIsEditingName(true)}>
                <Pencil size={18} color="#4B5563" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text className="text-gray-400 mt-2">
          {user?.email || 'Carregando...'}
        </Text>

        <Center className="mt-auto">
          <GradientButton text="Sair" onPress={signOut} />
        </Center>
      </Center>
    </SafeAreaView>
  )
}
