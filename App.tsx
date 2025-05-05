import { Text, Center, GluestackUIProvider } from '@gluestack-ui/themed'
import { View, StatusBar } from 'react-native'
import './src/global.css'

import { Loading } from '@components/Loading'

export default function App() {
  return (
    <GluestackUIProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Center className="bg-stone-900 flex flex-1 justify-center items-center">
        <Text className=" text-stone-100"> Handly </Text>
      </Center>
    </GluestackUIProvider>
  )
}
