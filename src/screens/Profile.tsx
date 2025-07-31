import {
  Button,
  ButtonText,
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

import { Camera, ChevronRight, Pencil, ThumbsUp } from 'lucide-react-native'
import { Star } from 'lucide-react-native'

import BackgroundImg from '@assets/bg.png'
import { DeleteServiceModal } from '@components/DeleteServiceModal'
import { Post } from '@components/Post'
import { SignOutModal } from '@components/SignOutModal'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import type { ServiceWithProviderDTO } from '@dtos/serviceDTO'
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
  getProviderRatings,
  updateUser,
  uploadProfilePic,
} from '@services/users-services'
import { z } from 'zod'
import { type Rating, profileUpdateSchema } from '../@types/profileSchema'
import { formatPhoneNumber } from '../utils/formatPhone'

import Reaching from '@assets/Reaching.svg'
import AngryEmoji from '@assets/angry.svg'

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
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [editedPhone, setEditedPhone] = useState('')
  const [services, setServices] = useState<ServiceWithProviderDTO[]>([])
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  )

  const [showing, setShowing] = useState('services')
  const [ratings, setRatings] = useState<Rating[]>([])

  const loadUserProfile = useCallback(async () => {
    try {
      const userData = await getProfile()
      setUser(userData)
      setEditedName(userData.name)
      setEditedPhone(userData.phone || '')

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

  async function handleUpdateProfile() {
    try {
      const dataToUpdate: { name?: string; phone?: string } = {
        name: user?.name,
        phone: user?.phone ?? undefined,
      }

      if (isEditingName) {
        dataToUpdate.name = editedName
      }
      if (isEditingPhone) {
        dataToUpdate.phone = editedPhone
      }

      profileUpdateSchema.parse(dataToUpdate)
      await updateUser(dataToUpdate)
      await loadUserProfile()
      setIsEditingName(false)
      setIsEditingPhone(false)
      showToast('Perfil atualizado com sucesso!', 'success')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || 'Erro de validação'
        showToast(errorMessage, 'error')
      } else {
        showToast('Erro ao atualizar o perfil.', 'error')
      }
    }
  }

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info') => {
      setToastMessage(message)
      setToastType(type)
      setToastVisible(true)
    },
    [],
  )

  async function handleEditService(serviceId: string) {
    navigation.navigate('Serviço', { serviceId })
  }

  async function handleDeleteService(serviceId: string) {
    setSelectedServiceId(serviceId)
    setIsDeleteModalVisible(true)
  }

  async function handleConfirmDelete() {
    if (!selectedServiceId) return

    try {
      await deleteService(selectedServiceId)
      setServices((prev) =>
        prev.filter((service) => service.id !== selectedServiceId),
      )
      showToast('Serviço deletado com sucesso!', 'success')
    } catch (error) {
      showToast('Erro ao deletar serviço.', 'error')
    } finally {
      setIsDeleteModalVisible(false)
      setSelectedServiceId(null)
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

  function openSignOutModal() {
    setIsSignOutModalVisible(true)
  }

  function handleConfirmSignOut() {
    signOut()
    setIsSignOutModalVisible(false)
  }

  useScreenRefresh(loadUserProfile)

  const loadUserRatings = useCallback(async () => {
    try {
      if (user?.role === 'provider' && user.cpf_cnpj) {
        const userRatings = await getProviderRatings(user.cpf_cnpj)
        setRatings(userRatings)
      }
    } catch (error) {
      showToast('Erro ao carregar avaliações.', 'error')
    }
  }, [user, showToast])

  useEffect(() => {
    async function fetchAndSetServices() {
      if (user?.role === 'provider') {
        const allServices: ServiceWithProviderDTO[] = await fetchServices()
        const filtered = allServices.filter(
          (service) => service.provider.cpf_cnpj === user.cpf_cnpj,
        )
        setServices(filtered)
      }
    }
    fetchAndSetServices()
  }, [user])

  useEffect(() => {
    if (showing === 'rates' && user?.role === 'provider') {
      loadUserRatings()
    }
  }, [showing, user, loadUserRatings])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="absolute -right-40 inset-0 items-center justify-end">
        <Reaching />
      </View>
      <ToastMessage
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
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
                  <TouchableOpacity
                    className="ml-2"
                    onPress={handleUpdateProfile}
                  >
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

          {user?.role === 'provider' ? (
            <View className="w-full flex justify-center items-center mt-8 px-4">
              <View className=" flex flex-row items-cente w-11/12 justify-center items-center py-4">
                <View className=" flex flex-col items-center px-2 py-3 w-1/2">
                  <Text className="text-800 font-bold text-md">
                    {user.email}
                  </Text>
                  <Text className=" text-gray-400">Email</Text>
                </View>
                <View className="border h-20 border-purple-900" />
                <View className=" flex flex-col items-center px-2 py-3 w-1/2">
                  {isEditingPhone ? (
                    <VStack className="flex flex-col justify-start w-full">
                      <Text className="font-bold text-md">Telefone</Text>
                      <Input className="w-full border-b-2 border-purple-300 flex flex-row justify-between items-center">
                        <InputField
                          value={formatPhoneNumber(editedPhone)}
                          onChangeText={(text) =>
                            setEditedPhone(text.replace(/\D/g, ''))
                          }
                          placeholder="Digite seu telefone"
                          keyboardType="phone-pad"
                        />
                        <TouchableOpacity
                          className="ml-2"
                          onPress={handleUpdateProfile}
                        >
                          <ThumbsUp size={20} color="#9356FC" />
                        </TouchableOpacity>
                      </Input>
                    </VStack>
                  ) : (
                    <>
                      <View className=" flex flex-row gap-2">
                        <Text className="text-800 font-bold text-md">
                          {formatPhoneNumber(user.phone)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setIsEditingPhone(true)}
                        >
                          <Pencil size={18} color="#4B5563" />
                        </TouchableOpacity>
                      </View>
                      <Text className=" text-gray-400">Contato</Text>
                    </>
                  )}
                </View>
              </View>
              <View className="flex flex-row justify-between my-4 w-10/12 gap-2">
                <Button
                  onPress={() => setShowing('services')}
                  className={`flex flex-row w-[47.5%] rounded-md py-3 justify-center ${showing === 'services' ? 'bg-purple-500 text-white ' : 'bg-steam-100 text-gray-800  ´'}  `}
                >
                  <ButtonText
                    className={`font-bold ${showing === 'services' ? ' text-white ' : '  text-gray-400 ´'}  `}
                  >
                    Serviço
                  </ButtonText>
                </Button>
                <Button
                  onPress={() => setShowing('rates')}
                  className={`flex flex-row w-[47.5%] rounded-md py-3 justify-center ${showing !== 'services' ? 'bg-purple-500 text-white ' : 'bg-steam-100 text-gray-800  ´'}  `}
                >
                  <ButtonText
                    className={`font-bold ${showing !== 'services' ? ' text-white ' : '  text-gray-400 ´'}  `}
                  >
                    Avaliações
                  </ButtonText>
                </Button>
              </View>
              {showing === 'services' ? (
                <View className=" flex flex-col items-center w-full">
                  <Text className="font-bold text-lg mb-8">Meus Serviços</Text>
                  {services.length === 0 ? (
                    <Text>Nenhum serviço encontrado.</Text>
                  ) : (
                    services.map((service) => (
                      <Post
                        key={service.id}
                        serviceId={service.id}
                        name={user.name}
                        isInitiallyFavorited={false}
                        categories={service.categories}
                        serviceImage={service.image}
                        profileImage={user.profile_pic}
                        isProvider={true}
                        onEdit={() => handleEditService(service.id)}
                        onDelete={() => handleDeleteService(service.id)}
                        onUploadImage={() =>
                          handleUploadServiceImage(service.id)
                        }
                      />
                    ))
                  )}
                </View>
              ) : (
                <ScrollView
                  className="mt-8 w-10/12"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 80 }}
                >
                  {ratings.length === 0 ? (
                    <VStack className="flex-1 justify-center items-center">
                      <Text className="text-lg text-gray-600">
                        Você ainda não possui avaliações.
                      </Text>
                    </VStack>
                  ) : (
                    ratings.map((rating) => (
                      <View
                        key={rating.id}
                        className="bg-steam-100 p-3 rounded-lg mb-2"
                      >
                        <Text className="font-bold flex flex-row items-center">
                          Nota: {rating.stars}.0{' '}
                          <Star size={12} fill="#9356FC" stroke="#9356FC" />
                        </Text>
                        <Text>{rating.comment}</Text>
                      </View>
                    ))
                  )}
                </ScrollView>
              )}
            </View>
          ) : (
            <Text className="text-gray-400 mt-2">
              {user?.email || 'Carregando...'}
            </Text>
          )}
        </Center>
      </ScrollView>
      <View className=" absolute bottom-8 flex flex-col w-full mx-auto mt-8">
        <Button
          onPress={openSignOutModal}
          className=" flex flex-row bg-steam-100 w-10/12 rounded-2xl mx-auto py-6"
        >
          <View className=" flex flex-row bg-white p-2 rounded-full mx-4">
            <AngryEmoji width={30} height={30} />
          </View>
          <ButtonText className=" text-gray-600 text-xl p-2">Sair</ButtonText>
          <View className=" flex flex-rowe p-2 ml-auto mr-8">
            <ChevronRight stroke="#95A1B1" />
          </View>
        </Button>
      </View>
      <SignOutModal
        visible={isSignOutModalVisible}
        onClose={() => setIsSignOutModalVisible(false)}
        onConfirm={handleConfirmSignOut}
      />
      <DeleteServiceModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  )
}
