import {
  type BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'

type AppRoutes = {
  Home: undefined
  Categorias: undefined
  Favoritos: undefined
  Perfil: undefined
  Serviço: { serviceId?: string } | undefined
  UserProfile: { provider_key: string }
}

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Categories } from '@screens/Categories'
import { Favorites } from '@screens/Favorites'
import { Feed } from '@screens/Feed'
import { Profile } from '@screens/Profile'
import { ServiceForm } from '@screens/ServiceForm'
import { UserProfile } from '@screens/UserProfile'
import {
  CircleUserRound,
  Clock,
  House,
  LayoutGrid,
  Wrench,
} from 'lucide-react-native'
import { Platform } from 'react-native'

type TabRoutes = {
  Home: undefined
  Categorias: undefined
  Favoritos: undefined
  Perfil: undefined
  Serviço: { serviceId?: string } | undefined
}

type StackRoutes = {
  Tabs: undefined
  UserProfile: { provider_key: string }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<TabRoutes> & {
  navigate: (
    screen: keyof StackRoutes,
    params?: StackRoutes[keyof StackRoutes],
  ) => void
}

const Tab = createBottomTabNavigator<TabRoutes>()
const Stack = createNativeStackNavigator<StackRoutes>()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B87EF2',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 75 : 90,
          paddingTop: 12,
        },
        animation: 'fade',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Feed}
        options={{ tabBarIcon: ({ color }) => <House color={color} /> }}
      />
      <Tab.Screen
        name="Categorias"
        component={Categories}
        options={{ tabBarIcon: ({ color }) => <LayoutGrid color={color} /> }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favorites}
        options={{ tabBarIcon: ({ color }) => <Clock color={color} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => <CircleUserRound color={color} />,
        }}
      />
      <Tab.Screen
        name="Serviço"
        component={ServiceForm}
        options={{
          tabBarIcon: ({ color }) => <Wrench color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  )
}
