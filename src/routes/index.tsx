import { Box } from '@gluestack-ui/themed'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'

import { useAuth } from '@hooks/useAuth'
import { AuthRoutes } from './auth.routes'

export function Routes() {

  const { user } = useAuth()
  
  const theme = DefaultTheme
  theme.colors.background = 'white'

  return (
    <Box className=" flex-1 bg-white">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}
