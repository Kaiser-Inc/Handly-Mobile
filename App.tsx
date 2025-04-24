import { Text, View, StatusBar } from 'react-native'
import './src/global.css'

export default function App() {
  return (
    <View className=' flex-1 flex justify-center items-center bg-zinc-900'>
      <Text> Handly </Text>
      <StatusBar className='color-white' translucent backgroundColor='transparent' />
    </View>
  )
}

