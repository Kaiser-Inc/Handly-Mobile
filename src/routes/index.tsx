import { Box } from '@gluestack-ui/themed'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'

import { Loading } from '@components/Loading'
import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'

export function Routes() {
  const { token, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = 'white'

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box className=" flex-1 bg-white pt-0">
      <NavigationContainer theme={theme}>
        {token ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
