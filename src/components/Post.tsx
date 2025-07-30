import { HStack, Image, Text, VStack } from '@gluestack-ui/themed'
import { apiUrl } from '@services/api/api'
import {
  Camera,
  Heart,
  MessageCircleMore,
  Send,
  SquarePen,
  Trash2,
  TriangleAlert,
} from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'
import DefaultService from '../assets/defaut-service.svg'
import { UserPhoto } from './UserPhoto'

import { favoriteService } from '@services/services-services'
import { useEffect, useState } from 'react'

interface PostProps {
  serviceId: string
  name: string
  categories: string[]
  profileImage: string | null
  serviceImage: string | null
  isInitiallyFavorited: boolean
  isProvider?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onUploadImage?: () => void
  onUnfavorite?: (serviceId: string) => void
  onPress?: (serviceId: string) => void
  onRatePress?: () => void
  onReportPress?: () => void
}

export function Post({
  categories,
  profileImage,
  serviceImage,
  name,
  isProvider,
  onEdit,
  onDelete,
  onUploadImage,
  serviceId,
  isInitiallyFavorited,
  onUnfavorite,
  onPress,
  onRatePress,
  onReportPress,
}: PostProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited)

  async function handleReport() {
    if (onReportPress) {
      onReportPress()
    }
  }

  async function handleFavorite() {
    const originalState = isFavorited
    setIsFavorited(!originalState)

    try {
      await favoriteService(serviceId)
      if (originalState && onUnfavorite) {
        onUnfavorite(serviceId)
      }
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar serviço:', error)
      setIsFavorited(originalState)
    }
  }

  useEffect(() => {
    setIsFavorited(isInitiallyFavorited)
  }, [isInitiallyFavorited])

  return (
    <TouchableOpacity
      onPress={() => onPress?.(serviceId)}
      className="w-10/12 flex flex-col border border-gray-100 rounded-2xl mx-auto p-4 mb-6 bg-white"
    >
      <HStack className=" flex flex-col w-11/12 mx-auto">
        <VStack className=" flex flex-row w-11/12 mx-auto">
          <UserPhoto
            className=" w-14 h-14 rounded-2xl mr-4 "
            source={{
              uri: profileImage
                ? `${apiUrl}/uploads/profile_pics/${profileImage}`
                : 'https://unavatar.io/substack/bankless',
            }}
            alt="Foto de perfil de usuário"
          />
          <HStack className=" flex flex-col my-auto">
            <Text className=" font-bold text-lg ">{name}</Text>
            <Text className=" text-gray-300 font-thin text-sm ">
              {categories.join(', ').length > 35
                ? `${categories.join(', ').substring(0, 32)}...`
                : categories.join(', ')}
            </Text>
          </HStack>
        </VStack>
        <VStack className=" flex flex-col mx-auto my-4 relative">
          {serviceImage ? (
            <Image
              width={300}
              height={200}
              className=" rounded-lg "
              source={{
                uri: serviceImage
                  ? `${apiUrl}/uploads/services/${serviceImage}`
                  : undefined,
              }}
              alt="Imagem de serviço"
            />
          ) : (
            <DefaultService width={120} height={120} />
          )}
        </VStack>

        <VStack className=" flex flex-row w-10/12 mx-auto mt-4 gap-4">
          {!isProvider && (
            <>
              <TouchableOpacity onPress={handleFavorite}>
                <VStack className=" felx flex-row gap-2 justify-center items-center">
                  <Heart
                    size={28}
                    fill={isFavorited ? '#F05D6C' : 'none'}
                    stroke={isFavorited ? '#F05D6C' : '#95A1B1'}
                  />
                </VStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={onRatePress}>
                <VStack className=" felx flex-row gap-2 justify-center items-center">
                  <MessageCircleMore size={28} stroke="#95A1B1" />
                </VStack>
              </TouchableOpacity>
              <HStack className=" ml-auto ">
                <TouchableOpacity onPress={handleReport}>
                  <VStack className=" felx flex-row gap-2 justify-center items-center">
                    <TriangleAlert size={28} stroke="#F05D6C" />
                  </VStack>
                </TouchableOpacity>
              </HStack>
            </>
          )}
          {isProvider && (
            <HStack className=" mx-auto w-full flex flex-row justify-around">
              <TouchableOpacity onPress={onEdit}>
                <SquarePen size={24} stroke="#9356FC" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onUploadImage}>
                <Camera size={24} stroke="#4B5563" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete}>
                <Trash2 size={24} stroke="#FF4B4B" />
              </TouchableOpacity>
            </HStack>
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  )
}
