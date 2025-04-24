import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import './src/global.css'

export default function App() {
  return (
    <View style={styles.container}>
      <Text> Handly </Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
