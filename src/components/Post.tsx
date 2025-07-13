import { HStack, Image, Text, VStack } from '@gluestack-ui/themed'
import { apiUrl } from '@services/api/api'
import {
  FolderMinus,
  Heart,
  MessageCircleMore,
  Send,
  SquarePen,
  Trash2,
} from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'
import DefaultService from '../assets/defaut-service.svg'
import { UserPhoto } from './UserPhoto'

interface PostProps {
  name: string
  categories: string[]
  profileImage?: string
  serviceImage?: string
  isProvider?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function Post({
  categories,
  profileImage,
  serviceImage,
  name,
  isProvider,
  onEdit,
  onDelete,
}: PostProps) {
  return (
    <HStack className=" w-10/12 flex flex-col border border-gray-100 rounded-2xl mx-auto p-4 mb-6">
      <VStack className=" flex flex-row w-11/12 mx-auto">
        <UserPhoto
          className=" w-14 h-14 rounded-2xl mr-4 "
          source={{
            uri:
              typeof profileImage === 'string'
                ? `${apiUrl}/uploads/profile_pics/${profileImage}`
                : 'https://unavatar.io/substack/bankless',
          }}
          alt="Foto de perfil de usuário"
        />
        <HStack className=" flex flex-col my-auto">
          <Text className=" font-bold text-lg ">{name}</Text>
          <Text className=" text-gray-300 font-thin text-sm ">
            {categories}
          </Text>
        </HStack>
      </VStack>
      <VStack className=" flex flex-col mx-auto my-4 relative">
        {serviceImage ? (
          <Image
            source={{
              uri: `${apiUrl}/uploads/services/${serviceImage}`,
            }}
            alt="Imagem de serviço"
            className=" rounded-2xl"
          />
        ) : (
          <DefaultService width={120} height={120} />
        )}
      </VStack>

      <VStack className=" flex flex-row w-10/12 mx-auto mt-4 gap-4">
        {!isProvider && (
          <>
            <VStack className=" felx flex-row gap-2 justify-center items-center">
              <Heart size={24} stroke="#95A1B1" />
              <Text className=" text-gray-300">413</Text>
            </VStack>
            <VStack className=" felx flex-row gap-2 justify-center items-center">
              <MessageCircleMore size={24} stroke="#95A1B1" />
              <Text className=" text-gray-300">25</Text>
            </VStack>
            <VStack className=" felx flex-row gap-2 justify-center items-center">
              <FolderMinus size={24} stroke="#95A1B1" />
              <Text className=" text-gray-300">137</Text>
            </VStack>
            <HStack className=" ml-auto ">
              <Send size={24} stroke="#95A1B1" />
            </HStack>
          </>
        )}
        {isProvider && (
          <HStack className=" mx-auto w-full flex flex-row justify-around">
            <TouchableOpacity onPress={onEdit}>
              <SquarePen size={24} stroke="#9356FC" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Trash2 size={24} stroke="#FF4B4B" />
            </TouchableOpacity>
          </HStack>
        )}
      </VStack>
    </HStack>
  )
}
