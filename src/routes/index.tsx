import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { Box } from '@gluestack-ui/themed'

export function Routes() {
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
