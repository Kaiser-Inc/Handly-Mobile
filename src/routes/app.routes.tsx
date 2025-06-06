import { type BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Categories } from '@screens/Categories'
import { Favorites } from '@screens/Favorites'
import { Feed } from '@screens/Feed'
import { Profile } from '@screens/Profile'
import { CircleUserRound, Clock, House, LayoutGrid } from 'lucide-react-native'
import { Platform } from 'react-native'

type AppRoutes = {
  Home: undefined
  Categorias: undefined
  Favoritos: undefined
  Perfil: undefined
}

export type AppNavigatorRoutesProps =  BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  return (
    <Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#B87EF2',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        height: Platform.OS === "android" ? 75 : 90,
        paddingTop: 12
      },
      animation: 'fade'
    }}
    >
      <Screen name="Home" component={Feed} options={{ tabBarIcon: ({color}) => <House color={color}/>}} />
      <Screen name="Categorias" component={Categories} options={{ tabBarIcon: ({color}) => <LayoutGrid color={color}/>}}  />
      <Screen name="Favoritos" component={Favorites} options={{ tabBarIcon: ({color}) => <Clock color={color}/>}}  />
      <Screen name="Perfil" component={Profile} options={{ tabBarIcon: ({color}) => <CircleUserRound color={color}/>}}  />
    </Navigator>
  )
}
