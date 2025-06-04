import { GluestackUIProvider, StatusBar } from '@gluestack-ui/themed'

import './src/global.css'

import {
  DMSans_400Regular,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans'

import { Loading } from '@components/Loading'
import { Routes } from '@routes/index'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthContextPovider } from '@contexts/AuthContext'

export default function App() {
  const [fonstsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
  })
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <AuthContextPovider>
          {fonstsLoaded ? <Routes /> : <Loading />}
        </AuthContextPovider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  )
}
