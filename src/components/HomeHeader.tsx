import { HStack, Pressable } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { Bell, House } from 'lucide-react-native'
import type { ReactNode } from 'react'

interface HomeHeaderProps {
  children?: ReactNode
  onBellPress: () => void
}

export function HomeHeader({ children, onBellPress }: HomeHeaderProps) {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  return (
    <HStack className="mx-auto rounded-2xl w-11/12 flex flex-row px-8 bg-white mb-8 items-center">
      <HStack className="flex flex-row items-center">
        <Pressable onPress={() => navigation.navigate('Home')}>
          <House size={30} stroke="#9356FC" />
        </Pressable>
      </HStack>
      <HStack className="flex flex-row flex-1">{children}</HStack>
      <HStack className="flex flex-row items-center gap-4">
        <Pressable onPress={onBellPress}>
          <Bell size={30} />
        </Pressable>
      </HStack>
    </HStack>
  )
}
