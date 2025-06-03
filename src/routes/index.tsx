import { Box } from '@gluestack-ui/themed'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'

export function Routes() {

  const { token } = useAuth()
  
  const theme = DefaultTheme
  theme.colors.background = 'white'

  return (
    <Box className=" flex-1 bg-white">
      <NavigationContainer theme={theme}>
        { token === '' ? <AuthRoutes /> : <AppRoutes />}
      </NavigationContainer>
    </Box>
  )
}
