import { HStack, Image, Text, VStack } from '@gluestack-ui/themed'
import {
  FolderMinus,
  Heart,
  MessageCircleMore,
  Send,
} from 'lucide-react-native'
import { UserPhoto } from './UserPhoto'

import SourceImg from '@assets/dev.png'

export function Post() {
  return (
    <HStack className=" w-10/12 flex flex-col border border-gray-100 rounded-2xl mx-auto p-4">
      <VStack className=" flex flex-row w-11/12 mx-auto">
        <UserPhoto
          className=" w-14 h-14 rounded-2xl mr-4 "
          source={'https://github.com/pHenrymelo.png'}
          alt="Foto de perfil de usuário"
        />
        <HStack className=" flex flex-col my-auto">
          <Text className=" font-bold text-lg ">Pedro Melo</Text>
          <Text className=" text-gray-300 font-thin text-sm ">
            Desenvolvedor freelancer
          </Text>
        </HStack>
      </VStack>

      <VStack className=" flex flex-col mx-auto my-4 relative">
        <Image
          source={SourceImg}
          alt="Imagem de serviço"
          defaultSource={SourceImg}
          className=" rounded-2xl"
        />
      </VStack>

      <VStack className=" flex flex-row w-10/12 mx-auto mt-4 gap-4">
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
      </VStack>
    </HStack>
  )
}
