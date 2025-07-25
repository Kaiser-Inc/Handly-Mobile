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
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Camera, Pencil, ThumbsUp } from 'lucide-react-native'

import BackgroundImg from '@assets/bg.png'
import { GradientButton } from '@components/GradientButton'
import { Post } from '@components/Post'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import type { ServiceDTO } from '@dtos/serviceDTO'
import type { UserDTO } from '@dtos/userDTO'
import { useAuth } from '@hooks/useAuth'
import { useScreenRefresh } from '@hooks/useScreenRefresh'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { apiUrl } from '@services/api/api'
import {
  deleteService,
  fetchServices,
  uploadServiceImage,
} from '@services/services-services'
import {
  getProfile,
  getProfilePic,
  updateUser,
  uploadProfilePic,
} from '@services/users-services'
import { z } from 'zod'
import { nameProfileSchema } from '../@types/profileSchema'

export function Profile() {
  const { signOut } = useAuth()
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [user, setUser] = useState<UserDTO | null>(null)
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )

  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [services, setServices] = useState<ServiceDTO[]>([])

  const loadUserProfile = useCallback(async () => {
    try {
      const userData = await getProfile()
      setUser(userData)
      setEditedName(userData.name)

      const profilePicData = await getProfilePic()
      if (profilePicData?.profile_pic) {
        setProfilePicUrl(
          `${apiUrl}/uploads/profile_pics/${profilePicData.profile_pic}`,
        )
      } else if (userData.profile_pic) {
        setProfilePicUrl(
          `${apiUrl}/uploads/profile_pics/${userData.profile_pic}`,
        )
      } else {
        setProfilePicUrl(null)
      }
    } catch (error) {}
  }, [])

  async function handleSelectImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
      base64: false,
    })

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0]

      const formData = new FormData()
      formData.append('file', {
        uri: image.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as unknown as Blob)

      try {
        await uploadProfilePic(formData)
        await loadUserProfile()
        showToast('Foto atualizada com sucesso!', 'success')
      } catch (error) {
        showToast('Erro ao enviar imagem', 'error')
      }
    }
  }

  async function handleUpdateName() {
    try {
      const validatedName = nameProfileSchema.parse(editedName)

      await updateUser({ name: validatedName })
      await loadUserProfile()
      setIsEditingName(false)
      showToast('Nome atualizado com sucesso!', 'success')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || 'Erro de validação'
        showToast(errorMessage, 'error')
      } else {
        showToast('Erro ao atualizar o nome.', 'error')
      }
    }
  }

  function showToast(message: string, type: 'success' | 'error' | 'info') {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  async function handleEditService(serviceId: string) {
    navigation.navigate('Serviço', { serviceId })
  }

  async function handleDeleteService(serviceId: string) {
    try {
      await deleteService(serviceId)
      setServices((prev) => prev.filter((service) => service.id !== serviceId))
      showToast('Serviço deletado com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao deletar serviço.', 'error')
    }
  }

  async function handleUploadServiceImage(serviceId: string) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
      base64: false,
    })

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0]

      const formData = new FormData()
      formData.append('file', {
        uri: image.uri,
        name: 'service.jpg',
        type: 'image/jpeg',
      } as unknown as Blob)

      try {
        await uploadServiceImage(serviceId, formData)
        await loadUserProfile()
        showToast('Imagem do serviço atualizada com sucesso!', 'success')
      } catch (error) {
        showToast('Erro ao enviar imagem do serviço', 'error')
      }
    }
  }

  useScreenRefresh(loadUserProfile)

  useEffect(() => {
    async function fetchAndSetServices() {
      if (user?.role === 'provider') {
        const allServices: ServiceDTO[] = await fetchServices()
        const filtered = allServices.filter(
          (service) => service.provider_key === user.cpf_cnpj,
        )
        setServices(filtered)
      }
    }
    fetchAndSetServices()
  }, [user])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Center className="w-full items-center py-8">
          <Text className="font-bold text-xl mb-8">Perfil</Text>

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
                uri: profilePicUrl || 'https://unavatar.io/substack/bankless',
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

          <View className=" mx-auto flex w-8/12 flex-row justify-center items-center mt-4">
            {isEditingName ? (
              <VStack className="flex flex-col justify-start w-full">
                <Text className="font-bold text-xl">Nome completo</Text>
                <Input className="w-full border-b-2 border-purple-300 flex flex-row justify-between items-center">
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

          {user?.role === 'provider' && (
            <View className="w-full flex justify-center items-center mt-8 px-4">
              <Text className="font-bold text-lg mb-8">Meus Serviços</Text>
              {services.length === 0 ? (
                <Text>Nenhum serviço encontrado.</Text>
              ) : (
                services.map((service) => (
                  <Post
                    key={service.id}
                    name={user.name}
                    categories={service.categories}
                    serviceImage={service.image}
                    profileImage={user.profile_pic}
                    isProvider={true}
                    onEdit={() => handleEditService(service.id)}
                    onDelete={() => handleDeleteService(service.id)}
                    onUploadImage={() => handleUploadServiceImage(service.id)}
                  />
                ))
              )}
            </View>
          )}

          <View className="mt-8">
            <GradientButton text="Sair" onPress={signOut} />
          </View>
        </Center>
      </ScrollView>
    </SafeAreaView>
  )
}
