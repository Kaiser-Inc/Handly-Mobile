import { Box, GluestackUIProvider, StatusBar } from '@gluestack-ui/themed'
import './src/global.css'

import {
  useFonts,
  DMSans_400Regular,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans'

import { Routes } from '@routes/index'
import { Loading } from '@components/Loading'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
        {fonstsLoaded ? <Routes /> : <Loading />}
      </GluestackUIProvider>
    </SafeAreaProvider>
  )
}
