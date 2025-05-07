import { Text, Center, GluestackUIProvider } from '@gluestack-ui/themed'
import { StatusBar, StyleSheet } from 'react-native'
import './src/global.css'

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat'

import { Loading } from '@components/Loading'
import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'
import React from 'react'

export default function App() {
  const [fonstsLoaded] = useFonts({ Montserrat_400Regular, Montserrat_700Bold })
  return (
    <GluestackUIProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fonstsLoaded ? <SignUp /> : <Loading />}
    </GluestackUIProvider>
  )
}
