import { Text, Center, GluestackUIProvider } from '@gluestack-ui/themed'
import { StatusBar, StyleSheet } from 'react-native'
import './src/global.css'

import {
  useFonts,
  DMSans_400Regular,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans'

import { Loading } from '@components/Loading'
import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'
import React from 'react'

export default function App() {
  const [fonstsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  })
  return (
    <GluestackUIProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fonstsLoaded ? <SignIn /> : <Loading />}
    </GluestackUIProvider>
  )
}
