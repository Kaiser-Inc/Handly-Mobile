import { HStack } from '@gluestack-ui/themed'
import { Bell, House } from 'lucide-react-native'
import { SearchBar } from './SearchBar'

export function HomeHeader() {
  return (
    <HStack className=" mx-auto rounded-2xl w-11/12 flex flex-row px-8 bg-white mb-8">
      <HStack className=" flex flex-row items-center ">
        <House size={30} stroke="#9356FC" />
      </HStack>
      <HStack className='flex flex-row flex-1'>
        <SearchBar />
      </HStack>
      <HStack className=" flex flex-row items-center gap-4">
        <Bell size={30} />
      </HStack>
    </HStack>
  )
}
