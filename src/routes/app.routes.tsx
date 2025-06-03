import {
    type NativeStackNavigationProp,
    createNativeStackNavigator,
  } from '@react-navigation/native-stack'
import { Feed } from '@screens/Feed'

  type AppRoutes = {
    Feed: undefined
  }
  
  export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>
  
  const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>()
  
  export function AppRoutes() {
    return (
      <Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
      <Screen name="Feed" component={Feed} />

      </Navigator>
    )
  }
  