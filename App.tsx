import { Text, Center, GluestackUIProvider } from '@gluestack-ui/themed'
import { View, StatusBar } from 'react-native'
import './src/global.css'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { Loading } from '@components/Loading'

export default function App() {
  const [fonstsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  return (
    <GluestackUIProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fonstsLoaded ? (
        <Center className="bg-stone-900 flex flex-1 justify-center items-center">
          <Text className=" text-stone-100 text-3xl font-normal"> Handly </Text>
        </Center>
      ) : (
        <Loading />
      )}
    </GluestackUIProvider>
  )
}
