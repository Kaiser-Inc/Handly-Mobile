import { Post } from '@components/Post'
import { ReportChoiceModal } from '@components/ReportChoiceModal'
import { ReportModal } from '@components/ReportModal'
import { ServiceDetailsModal } from '@components/ServiceDetailsModal'
import { ToastMessage } from '@components/ToastMessage'
import { UserPhoto } from '@components/UserPhoto'
import type { ServiceWithProviderDTO } from '@dtos/serviceDTO'
import type { UserDTO } from '@dtos/userDTO'
import {
  Button,
  ButtonText,
  Center,
  Image,
  Pressable,
  Text,
  VStack,
  View,
} from '@gluestack-ui/themed'
import { useAuth } from '@hooks/useAuth'
import { useNavigation, useRoute } from '@react-navigation/native'
import { apiUrl } from '@services/api/api'
import { fetchFavorites, fetchServices } from '@services/services-services'
import {
  getProfileByCpfCnpj,
  getProviderRatings,
} from '@services/users-services'
import { formatPhoneNumber } from '@utils/formatPhone'
import {
  ChevronLeft,
  Flag,
  Heart,
  Star,
  TriangleAlert,
} from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Rating } from '../@types/profileSchema'

import Reaching from '@assets/Reaching.svg'
import BackgroundImg from '@assets/bg.png'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'

type RouteParams = {
  provider_key: string
}

export function UserProfile() {
  const { token } = useAuth()
  const [user, setUser] = useState<UserDTO | null>(null)
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'error',
  )
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const [services, setServices] = useState<ServiceWithProviderDTO[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  )

  const [isReportChoiceModalVisible, setIsReportChoiceModalVisible] =
    useState(false)
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const [reportType, setReportType] = useState<'service' | 'provider' | null>(
    null,
  )

  const [showing, setShowing] = useState('services')
  const [ratings, setRatings] = useState<Rating[]>([])
  const route = useRoute()
  const { provider_key } = route.params as RouteParams

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info') => {
      setToastMessage(message)
      setToastType(type)
      setToastVisible(true)
    },
    [],
  )

  const loadData = useCallback(async () => {
    if (!token) return
    try {
      const [userData, favoritesData, servicesData] = await Promise.all([
        getProfileByCpfCnpj(provider_key),
        fetchFavorites(),
        fetchServices(),
      ])

      setUser(userData)
      if (userData.profile_pic) {
        setProfilePicUrl(
          `${apiUrl}/uploads/profile_pics/${userData.profile_pic}`,
        )
      } else {
        setProfilePicUrl(null)
      }

      const favIds = new Set(
        (favoritesData as { target_id: string }[]).map((fav) => fav.target_id),
      )
      setFavoriteIds(favIds)

      const userServices = (servicesData as ServiceWithProviderDTO[]).filter(
        (service) => service.provider.cpf_cnpj === userData.cpf_cnpj,
      )
      setServices(userServices)
    } catch (error) {
      showToast('Erro ao carregar dados do perfil.', 'error')
    }
  }, [provider_key, token, showToast])

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
    loadData()
  }, [loadData])

  useEffect(() => {
    if (showing === 'rates' && user?.role === 'provider') {
      loadUserRatings()
    }
  }, [showing, user, loadUserRatings])

  const selectedService = services.find((s) => s.id === selectedServiceId)

  const handlePostPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedServiceId(null)
    loadData()
  }

  const handleReportPress = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setIsReportChoiceModalVisible(true)
  }

  const handleReportService = () => {
    setIsReportChoiceModalVisible(false)
    setReportType('service')
    setIsReportModalVisible(true)
  }

  const handleReportProvider = () => {
    setIsReportChoiceModalVisible(false)
    setReportType('provider')
    setIsReportModalVisible(true)
  }

  const handleCloseReportModal = () => {
    setIsReportModalVisible(false)
    setReportType(null)
  }

  const handleReportProviderPress = () => {
    setReportType('provider')
    setIsReportModalVisible(true)
  }

  const getReportTargetId = () => {
    if (reportType === 'provider') {
      return provider_key
    }
    if (!reportType || !selectedService) return ''
    return reportType === 'service'
      ? selectedService.id
      : selectedService.provider.cpf_cnpj
  }

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
          <View className="w-10/12 flex-row items-center justify-center relative mb-8">
            <Pressable
              onPress={() => navigation.goBack()}
              className="absolute left-0 p-2 z-10"
            >
              <ChevronLeft size={28} color="#4B5563" />
            </Pressable>
            <Text className="font-bold text-xl">Perfil do Prestador</Text>
            <Pressable
              onPress={handleReportProviderPress}
              className="absolute right-0 p-2 z-10"
            >
              <TriangleAlert size={28} color="#F05D6C" />
            </Pressable>
          </View>

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
          </View>

          <View className=" mx-auto flex w-8/12 flex-row justify-center items-center mt-4">
            <Text className="text-xl font-medium text-black mr-2">
              {user?.name || 'Usuário'}
            </Text>
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
                  <View className=" flex flex-row gap-2">
                    <Text className="text-800 font-bold text-md">
                      {formatPhoneNumber(user.phone)}
                    </Text>
                  </View>
                  <Text className=" text-gray-400">Contato</Text>
                </View>
              </View>
              <View className="flex flex-row justify-between my-4 w-10/12 gap-2">
                <Button
                  onPress={() => setShowing('services')}
                  className={`flex flex-row w-[47.5%] rounded-md py-3 justify-center ${
                    showing === 'services'
                      ? 'bg-purple-500 text-white '
                      : 'bg-steam-100 text-gray-800  '
                  }  `}
                >
                  <ButtonText
                    className={`font-bold ${
                      showing === 'services'
                        ? ' text-white '
                        : '  text-gray-400 '
                    }  `}
                  >
                    Serviços
                  </ButtonText>
                </Button>
                <Button
                  onPress={() => setShowing('rates')}
                  className={`flex flex-row w-[47.5%] rounded-md py-3 justify-center ${
                    showing !== 'services'
                      ? 'bg-purple-500 text-white '
                      : 'bg-steam-100 text-gray-800  '
                  }  `}
                >
                  <ButtonText
                    className={`font-bold ${
                      showing !== 'services'
                        ? ' text-white '
                        : '  text-gray-400 '
                    }  `}
                  >
                    Avaliações
                  </ButtonText>
                </Button>
              </View>
              {showing === 'services' ? (
                <View className=" flex flex-col items-center w-full">
                  <Text className="font-bold text-lg my-8 mx-auto">
                    Serviços de {user.name.split(' ')[0]}
                  </Text>
                  {services.length === 0 ? (
                    <Text>Nenhum serviço encontrado.</Text>
                  ) : (
                    services.map((service) => (
                      <Post
                        key={service.id}
                        serviceId={service.id}
                        name={user.name}
                        providerCpfCnpj={user.cpf_cnpj}
                        isInitiallyFavorited={favoriteIds.has(service.id)}
                        categories={service.categories}
                        serviceImage={service.image}
                        profileImage={user.profile_pic}
                        isProvider={false}
                        onPress={() => handlePostPress(service.id)}
                        onReportPress={() => handleReportPress(service.id)}
                      />
                    ))
                  )}
                </View>
              ) : (
                <ScrollView
                  className=" w-10/12"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 80 }}
                >
                  <Text className="font-bold text-lg my-8 mx-auto">
                    Avaliações de {user.name.split(' ')[0]}
                  </Text>
                  {ratings.length === 0 ? (
                    <VStack className="flex-1 justify-center items-center">
                      <Text className="text-lg text-gray-600">
                        Ainda não possui avaliações.
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
          onPress={() => console.log('favoritar')}
          className=" flex flex-row bg-steam-100 w-10/12 rounded-2xl mx-auto py-6"
        >
          <View className=" flex flex-row bg-white p-2 rounded-full mx-4">
            <Heart width={30} height={30} />
          </View>
          <ButtonText className=" text-gray-600 text-xl p-2">
            Favoritar este prestador
          </ButtonText>
        </Button>
      </View>
      <ServiceDetailsModal
        visible={isModalVisible}
        serviceId={selectedServiceId}
        onClose={handleCloseModal}
        isInitiallyFavorited={favoriteIds.has(selectedServiceId || '')}
      />
      <ReportChoiceModal
        visible={isReportChoiceModalVisible}
        onClose={() => setIsReportChoiceModalVisible(false)}
        onReportService={handleReportService}
        onReportProvider={handleReportProvider}
      />
      <ReportModal
        visible={isReportModalVisible}
        type={reportType}
        targetId={getReportTargetId()}
        onClose={handleCloseReportModal}
      />
    </SafeAreaView>
  )
}
